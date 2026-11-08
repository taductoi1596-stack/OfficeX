import { IAIProviderAdapter, AIProviderStatus, AIModelInfo } from '../IAIProviderAdapter';
import { SecureStorage } from '../SecureStorage';

export class OpenAIAdapter implements IAIProviderAdapter {
  id = 'openai';
  name = 'OpenAI';
  status: AIProviderStatus = 'offline';

  private apiKey: string | null = null;

  async initialize(): Promise<void> {
    this.apiKey = SecureStorage.getSecret('openai_api_key');
    // For prototype purposes, we pretend it's online if there's any key, or even default it to online
    this.status = 'online';
  }

  async healthCheck(): Promise<boolean> {
    // Simulated health check
    return this.status === 'online';
  }

  getModels(): AIModelInfo[] {
    return [
      { id: 'gpt-4o', name: 'GPT-4o', maxTokens: 128000, visionSupport: true, costPer1kPrompt: 0.005, costPer1kCompletion: 0.015 },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', maxTokens: 128000, visionSupport: true, costPer1kPrompt: 0.01, costPer1kCompletion: 0.03 },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', maxTokens: 16385, visionSupport: false, costPer1kPrompt: 0.0005, costPer1kCompletion: 0.0015 },
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
    
    // Construct mock response
    let responseText = `[OpenAI ${modelId}]\n`;
    if (options.mockResponseText) {
      responseText += options.mockResponseText;
    } else if (prompt.includes('summarize')) {
      responseText += `Here is a summary based on the text: The key elements discussed revolve around ensuring accuracy and clarity.`;
    } else if (prompt.includes('translate')) {
      responseText += `[Translated text...]`;
    } else {
      responseText += `Hello! I am OpenAI responding to your prompt: "${prompt.substring(0, 50)}..."`;
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
