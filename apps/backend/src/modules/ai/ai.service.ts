import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  async summarize(text: string): Promise<string> {
    this.logger.log(`Mocking AI Summarization...`);
    // Mock implementation. In a real scenario, call OpenAI/Gemini API here.
    return `[Tóm tắt AI]: ${text.substring(0, 100)}...`;
  }

  async translate(text: string, targetLanguage: string): Promise<string> {
    this.logger.log(`Mocking AI Translation to ${targetLanguage}...`);
    return `[Bản dịch AI sang ${targetLanguage}]: ${text}`;
  }

  async suggest(context: string): Promise<string[]> {
    this.logger.log(`Mocking AI Suggestions...`);
    return [
      `Gợi ý 1 dựa trên: ${context.substring(0, 50)}`,
      `Gợi ý 2 mở rộng ý tưởng`,
      `Gợi ý 3 với văn phong trang trọng hơn`,
    ];
  }
}
