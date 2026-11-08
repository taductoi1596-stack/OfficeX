import { IAIProviderAdapter, AIProviderStatus, AIModelInfo } from '../IAIProviderAdapter';

export class LocalOllamaAdapter implements IAIProviderAdapter {
  id = 'ollama';
  name = 'Local Ollama';
  status: AIProviderStatus = 'offline';
  private installedModels: string[] = [];
  public modelReady = false;

  async initialize(): Promise<void> {
    try {
      // Check if Ollama is running and get installed models
      const res = await fetch('http://127.0.0.1:11434/api/tags').catch(() => null);
      if (res && res.ok) {
        this.status = 'online';
        const data = await res.json();
        this.installedModels = data.models?.map((m: any) => m.name) || [];
        this.modelReady = this.installedModels.some(m => m.includes('qwen3:8b'));
        if (!this.modelReady) {
          console.warn('Model qwen3:8b is missing. Please download Qwen3 8B using: ollama run qwen3:8b');
        }
      } else {
        this.status = 'offline';
        console.warn('Ollama is not running. Please install and run Ollama on port 11434.');
      }
    } catch (e) {
      this.status = 'offline';
    }
  }

  async healthCheck(): Promise<boolean> {
    return this.status === 'online';
  }

  isModelInstalled(model: string): boolean {
    return this.installedModels.includes(model) || this.installedModels.some(m => m.startsWith(model));
  }

  getModels(): AIModelInfo[] {
    return [
      { id: 'qwen3:8b', name: 'Qwen 3 (8B) - Default', maxTokens: 8192, visionSupport: false, costPer1kPrompt: 0, costPer1kCompletion: 0 }
    ];
  }

  streamChat(
    modelId: string,
    prompt: string,
    systemPrompt: string,
    options: Record<string, any>,
    onToken: (token: string) => void,
    onComplete: (fullText: string) => void,
    onError: (error: Error) => void
  ): () => void {
    const controller = new AbortController();
    let fullText = '';

    const isChat = options.operation === 'chat';

    const messages = isChat
      ? [
          { role: 'system', content: systemPrompt || 'You are OfficeX Copilot, a helpful local AI assistant powered by Qwen3. Answer concisely.' },
          { role: 'user', content: prompt }
        ]
      : [
          { role: 'user', content: `${systemPrompt}\n\nTask context/text:\n${prompt}\n\nProvide ONLY the result, without markdown blocks or explanations.` }
        ];

    const payload = {
      model: modelId || 'qwen3:8b',
      messages,
      stream: true,
      options: {
        temperature: options.temperature ?? (isChat ? 0.7 : 0.2),
        top_k: isChat ? 40 : 10,
        top_p: options.topP ?? (isChat ? 0.9 : 0.5),
        num_ctx: options.maxTokens ?? 4096
      }
    };

    fetch('http://127.0.0.1:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    }).then(async (response) => {
      if (!response.body) throw new Error('No response body');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(l => l.trim() !== '');
        
        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message && data.message.content) {
              fullText += data.message.content;
              onToken(data.message.content);
            }
          } catch (e) {
            // ignore JSON parse errors for incomplete chunks
          }
        }
      }
      onComplete(fullText);
    }).catch(err => {
      if (err.name === 'AbortError') return;
      onError(err);
    });

    return () => { controller.abort(); };
  }
}
