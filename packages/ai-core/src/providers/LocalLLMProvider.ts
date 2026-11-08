import { LLMProvider } from '../gateway/AIGateway';

export class LocalLLMProvider implements LLMProvider {
  public name = 'LocalLLM (Ollama)';
  private endpoint = 'http://192.168.1.252:11434/v1/chat/completions';
  
  // You can specify the model if you want, e.g., 'Qwen3:14b' or 'gemma3:12b'.
  // If left empty, some generic Ollama wrappers will use the default model.
  // We will default to a model if we want, or just let Ollama handle it.
  private modelName = 'Gemma4:12b';

  public async generateText(prompt: string, context?: any): Promise<string> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            { role: 'system', content: 'You are OfficeX AI, a highly capable assistant integrated into the OfficeX suite. You are helpful, concise, and smart.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`LLM Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error: any) {
      console.error('LLM Fetch Error:', error);
      throw new Error(`Không thể kết nối tới Local LLM: ${error.message}`);
    }
  }
}
