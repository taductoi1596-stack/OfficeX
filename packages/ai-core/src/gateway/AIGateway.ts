export interface LLMProvider {
  name: string;
  generateText(prompt: string, context?: any): Promise<string>;
}

export class AIGateway {
  private providers: Map<string, LLMProvider> = new Map();
  private activeProviderName: string | null = null;

  public registerProvider(provider: LLMProvider) {
    this.providers.set(provider.name, provider);
    if (!this.activeProviderName) {
      this.activeProviderName = provider.name;
    }
  }

  public setActiveProvider(name: string) {
    if (this.providers.has(name)) {
      this.activeProviderName = name;
    } else {
      throw new Error(`Provider ${name} not found`);
    }
  }

  public async generateText(prompt: string, context?: any): Promise<string> {
    if (!this.activeProviderName) {
      throw new Error("No active AI provider configured");
    }
    const provider = this.providers.get(this.activeProviderName)!;
    return await provider.generateText(prompt, context);
  }
}
