/**
 * IAIProviderAdapter.ts
 *
 * Defines the standard adapter interface for all AI providers (OpenAI, Claude, etc.)
 */

export type AIProviderStatus =
  | 'online'
  | 'offline'
  | 'connecting'
  | 'unauthorized'
  | 'rate_limited'
  | 'disabled';

export type AIModelInfo = {
  id: string;
  name: string;
  maxTokens: number;
  visionSupport: boolean;
  costPer1kPrompt: number;
  costPer1kCompletion: number;
};

export interface IAIProviderAdapter {
  readonly id: string;
  readonly name: string;
  status: AIProviderStatus;
  
  /**
   * Initializes the provider (e.g. loads keys from SecureStorage).
   */
  initialize(): Promise<void>;

  /**
   * Checks connection health.
   */
  healthCheck(): Promise<boolean>;

  /**
   * Returns list of supported models.
   */
  getModels(): AIModelInfo[];

  /**
   * Streams a generic chat completion.
   */
  streamChat(
    modelId: string,
    prompt: string,
    systemPrompt: string,
    options: Record<string, any>,
    onToken: (token: string) => void,
    onComplete: (fullText: string) => void,
    onError: (error: Error) => void
  ): () => void; // Returns a cancel function
}
