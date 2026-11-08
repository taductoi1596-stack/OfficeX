import { LLMProvider } from '../gateway/AIGateway';

export class MockAIProvider implements LLMProvider {
  public name = 'MockAI';

  public async generateText(prompt: string, context?: any): Promise<string> {
    // Simulate network delay between 1-2 seconds
    const delay = Math.floor(Math.random() * 1000) + 1000;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        let response = `Tôi là OfficeX AI. Bạn vừa yêu cầu:\n"${prompt}"\n\n`;
        
        // Mock some specific responses based on keywords
        const lowerPrompt = prompt.toLowerCase();
        if (lowerPrompt.includes('chào') || lowerPrompt.includes('hello')) {
          response += 'Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?';
        } else if (lowerPrompt.includes('viết') || lowerPrompt.includes('soạn')) {
          response += 'Dưới đây là một đoạn văn bản nháp mà tôi đã soạn theo yêu cầu của bạn...\n(Đây là bản nháp giả lập vì hiện tại chưa có kết nối tới API thực sự.)';
        } else if (lowerPrompt.includes('tóm tắt')) {
          response += 'Tóm tắt nội dung:\n- Điểm chính 1\n- Điểm chính 2\n- Điểm chính 3';
        } else {
          response += 'Hiện tại tính năng gọi LLM API thực tế đang được chờ cấu hình, nên tôi chỉ có thể phản hồi giả lập như thế này thôi!';
        }

        resolve(response);
      }, delay);
    });
  }
}
