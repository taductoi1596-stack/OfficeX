import { IAIProviderAdapter, AIProviderStatus, AIModelInfo } from '../IAIProviderAdapter';
import { SecureStorage } from '../SecureStorage';

export class ClaudeAdapter implements IAIProviderAdapter {
  id = 'anthropic';
  name = 'Claude';
  status: AIProviderStatus = 'offline';

  private apiKey: string | null = null;

  async initialize(): Promise<void> {
    this.apiKey = SecureStorage.getSecret('anthropic_api_key');
    this.status = 'online';
  }

  async healthCheck(): Promise<boolean> {
    return this.status === 'online';
  }

  getModels(): AIModelInfo[] {
    return [
      { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', maxTokens: 200000, visionSupport: true, costPer1kPrompt: 0.003, costPer1kCompletion: 0.015 },
      { id: 'claude-3-opus', name: 'Claude 3 Opus', maxTokens: 200000, visionSupport: true, costPer1kPrompt: 0.015, costPer1kCompletion: 0.075 },
      { id: 'claude-3-haiku', name: 'Claude 3 Haiku', maxTokens: 200000, visionSupport: true, costPer1kPrompt: 0.00025, costPer1kCompletion: 0.00125 },
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
    let cancelled = false;
    
    let responseText = `[Claude ${modelId}]\n`;
    if (options.mockResponseText) {
      responseText += options.mockResponseText;
    } else if (prompt.includes('summarize')) {
      responseText += `Here is a clear summary:\n- Topic 1\n- Topic 2\nConclusions drawn properly.`;
    } else if (prompt.includes('translate')) {
      responseText += `[Translated text...]`;
    } else {
      responseText += `Hello! I am Claude. You said: "${prompt.substring(0, 50)}..."`;
    }

    const tokens = responseText.match(/\S+\s*/g) ?? [responseText];
    let index = 0;

    const streamNext = () => {
      if (cancelled) return;
      if (index < tokens.length) {
        onToken(tokens[index]);
        index++;
        setTimeout(streamNext, 2 + Math.random() * 5);
      } else {
        onComplete(responseText);
      }
    };

    setTimeout(streamNext, 10);

    return () => { cancelled = true; };
  }
}
