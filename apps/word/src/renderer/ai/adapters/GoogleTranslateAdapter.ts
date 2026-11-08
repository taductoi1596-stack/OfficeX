import { IAIProviderAdapter, AIProviderStatus, AIModelInfo } from '../IAIProviderAdapter';

export class GoogleTranslateAdapter implements IAIProviderAdapter {
  id = 'google-translate';
  name = 'Google Translate API (Direct)';
  status: AIProviderStatus = 'offline';

  async initialize(): Promise<void> {
    this.status = 'online';
  }

  async healthCheck(): Promise<boolean> {
    return this.status === 'online';
  }

  getModels(): AIModelInfo[] {
    return [
      { id: 'google-translate', name: 'Google Translate', maxTokens: 5000, visionSupport: false, costPer1kPrompt: 0, costPer1kCompletion: 0 }
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

    // Use raw text and target language if provided by AIEngine, else try to extract from prompt
    const rawText = options.rawText || prompt;
    let targetLangCode = 'vi'; // Default to Vietnamese
    
    if (options.targetLang) {
      const map: Record<string, string> = {
        'Vietnamese': 'vi',
        'English': 'en',
        'French': 'fr',
        'Spanish': 'es',
        'Japanese': 'ja',
        'Chinese': 'zh-CN',
        'Korean': 'ko',
        'German': 'de',
      };
      targetLangCode = map[options.targetLang] || 'vi';
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLangCode}&dt=t&q=${encodeURIComponent(rawText)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (cancelled) return;
        let translatedText = '';
        if (data && data[0]) {
          data[0].forEach((item: any) => {
            if (item[0]) translatedText += item[0];
          });
        }
        // Simulate streaming for UI effect
        const tokens = translatedText.split(/(?<=\s)/);
        let index = 0;
        const streamNext = () => {
          if (cancelled) return;
          if (index < tokens.length) {
            onToken(tokens[index]);
            index++;
            setTimeout(streamNext, 10);
          } else {
            onComplete(translatedText);
          }
        };
        streamNext();
      })
      .catch(err => {
        if (cancelled) return;
        onError(err);
      });

    return () => {
      cancelled = true;
    };
  }
}
