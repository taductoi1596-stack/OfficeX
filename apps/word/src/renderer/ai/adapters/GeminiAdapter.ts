import { IAIProviderAdapter, AIProviderStatus, AIModelInfo } from '../IAIProviderAdapter';
import { SecureStorage } from '../SecureStorage';

export class GeminiAdapter implements IAIProviderAdapter {
  id = 'google';
  name = 'Google Gemini';
  status: AIProviderStatus = 'offline';

  private apiKey: string | null = null;

  async initialize(): Promise<void> {
    this.apiKey = SecureStorage.getSecret('gemini_api_key');
    this.status = 'online';
  }

  async healthCheck(): Promise<boolean> {
    return this.status === 'online';
  }

  getModels(): AIModelInfo[] {
    return [
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', maxTokens: 2097152, visionSupport: true, costPer1kPrompt: 0.0035, costPer1kCompletion: 0.0105 },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', maxTokens: 1048576, visionSupport: true, costPer1kPrompt: 0.00035, costPer1kCompletion: 0.00105 },
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
    
    let responseText = `[Gemini ${modelId}]\n`;
    if (options.mockResponseText) {
      responseText += options.mockResponseText;
    } else {
      responseText += `Hi there, I am Google Gemini. You asked: "${prompt.substring(0, 50)}..."`;
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
