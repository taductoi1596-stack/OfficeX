/**
 * AIProviderManager.ts
 *
 * Enterprise Singleton AI Provider Manager.
 * Orchestrates multiple AI adapters, handles failover, model selection,
 * usage tracking, and exposes a unified streaming interface for all AI panels.
 */

import { IAIProviderAdapter, AIModelInfo } from './IAIProviderAdapter';
import { LocalOllamaAdapter } from './adapters/LocalOllamaAdapter';
import { UsageTracker } from './UsageTracker';

type ProviderDef = {
  id: string;
  label: string;
  adapter: IAIProviderAdapter;
};

class AIProviderManagerImpl {
  private providers: Map<string, ProviderDef> = new Map();
  private activeProviderId: string | null = null;
  private fallbackProviderId: string | null = null;
  
  constructor() {
    UsageTracker.initialize();
  }

  /**
   * Initialize all registered adapters.
   */
  async initialize() {
    // Register defaults
    this.registerProvider(new LocalOllamaAdapter());

    // Init adapters
    const promises = Array.from(this.providers.values()).map(p => p.adapter.initialize());
    await Promise.all(promises);

    // Set defaults
    this.activeProviderId = 'ollama';
    this.fallbackProviderId = null; // No cloud fallback allowed
  }

  registerProvider(adapter: IAIProviderAdapter) {
    this.providers.set(adapter.id, {
      id: adapter.id,
      label: adapter.name,
      adapter,
    });
  }

  getProviders() {
    return Array.from(this.providers.values()).map(p => ({
      id: p.id,
      label: p.label,
      status: p.adapter.status,
    }));
  }

  getModelsForProvider(providerId: string): AIModelInfo[] {
    const p = this.providers.get(providerId);
    return p ? p.adapter.getModels() : [];
  }

  setActiveProvider(providerId: string) {
    if (this.providers.has(providerId)) {
      this.activeProviderId = providerId;
    }
  }

  getActiveProviderId() {
    return this.activeProviderId;
  }

  /**
   * Unified chat streaming with automatic fallback if primary provider fails health check.
   */
  streamChat(
    providerId: string,
    modelId: string,
    prompt: string,
    systemPrompt: string,
    options: Record<string, any>,
    onToken: (token: string) => void,
    onComplete: (fullText: string) => void,
    onError: (error: Error) => void
  ): () => void {
    const targetProviderId = this.providers.has(providerId) ? providerId : this.activeProviderId;
    if (!targetProviderId) {
      onError(new Error("No provider available"));
      return () => {};
    }

    let adapter = this.providers.get(targetProviderId)!.adapter;

    // Failover logic
    if (adapter.status !== 'online' && this.fallbackProviderId && this.providers.has(this.fallbackProviderId)) {
      console.warn(`[AIProviderManager] Primary provider ${targetProviderId} is offline. Failing over to ${this.fallbackProviderId}.`);
      adapter = this.providers.get(this.fallbackProviderId)!.adapter;
      // Also fallback model to the first available model of the new provider
      const fallbackModels = adapter.getModels();
      if (fallbackModels.length > 0) {
        modelId = fallbackModels[0].id;
      }
    }

    // Simulated usage tracking before streaming completes
    const modelInfo = adapter.getModels().find(m => m.id === modelId);
    const startTime = Date.now();
    const promptTokensEst = Math.ceil(prompt.length / 4);

    return adapter.streamChat(
      modelId, prompt, systemPrompt, options,
      onToken,
      (fullText) => {
        // Track usage
        const completionTokensEst = Math.ceil(fullText.length / 4);
        const cost = modelInfo 
          ? ((promptTokensEst / 1000) * modelInfo.costPer1kPrompt) + ((completionTokensEst / 1000) * modelInfo.costPer1kCompletion)
          : 0;

        UsageTracker.track({
          providerId: adapter.id,
          model: modelId,
          operation: options.operation || 'chat',
          promptTokens: promptTokensEst,
          completionTokens: completionTokensEst,
          latencyMs: Date.now() - startTime,
          costEstimate: cost,
        });

        onComplete(fullText);
      },
      onError
    );
  }
}

export const AIProviderManager = new AIProviderManagerImpl();
