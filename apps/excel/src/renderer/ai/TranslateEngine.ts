/**
 * TranslateEngine.ts
 *
 * Translation engine for OfficeX Excel.
 * Supports single cell, multi-cell selection, and entire worksheet translation.
 */

export interface TranslateOptions {
  sourceLang: string;
  targetLang: string;
  tone?: string;
}

export interface TranslateResult {
  translatedText: string;
  detectedSourceLang: string;
  confidence: number;
  wordCount: number;
}

export const SUPPORTED_LANGUAGES = [
  'Auto Detect',
  'Vietnamese', 'English', 'Chinese', 'Japanese', 'Korean',
  'French', 'German', 'Spanish', 'Italian', 'Portuguese',
  'Russian', 'Arabic', 'Thai', 'Dutch', 'Polish',
  'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Greek',
  'Hebrew', 'Turkish', 'Hindi', 'Indonesian', 'Malay',
  'Czech', 'Hungarian', 'Romanian', 'Ukrainian', 'Slovak',
];

const LANG_CODE_MAP: Record<string, string> = {
  'Auto Detect': 'auto',
  'English': 'en',
  'Vietnamese': 'vi',
  'Chinese': 'zh-CN',
  'Japanese': 'ja',
  'Korean': 'ko',
  'French': 'fr',
  'German': 'de',
  'Spanish': 'es',
  'Italian': 'it',
  'Portuguese': 'pt',
  'Russian': 'ru',
  'Arabic': 'ar',
  'Thai': 'th',
  'Dutch': 'nl',
  'Polish': 'pl',
  'Swedish': 'sv',
  'Norwegian': 'no',
  'Danish': 'da',
  'Finnish': 'fi',
  'Greek': 'el',
  'Hebrew': 'he',
  'Turkish': 'tr',
  'Hindi': 'hi',
  'Indonesian': 'id',
  'Malay': 'ms',
  'Czech': 'cs',
  'Hungarian': 'hu',
  'Romanian': 'ro',
  'Ukrainian': 'uk',
  'Slovak': 'sk',
};

export class TranslateEngine {
  public static getLangCode(lang: string): string {
    return LANG_CODE_MAP[lang] || 'auto';
  }

  public static getLangName(code: string): string {
    for (const [name, c] of Object.entries(LANG_CODE_MAP)) {
      if (c.toLowerCase() === code.toLowerCase() && name !== 'Auto Detect') {
        return name;
      }
    }
    return code;
  }

  /**
   * Fast language detection heuristic.
   */
  public static detectLanguage(text: string): { lang: string; confidence: number } {
    if (!text.trim()) return { lang: 'Unknown', confidence: 0 };
    if (/[\u4E00-\u9FFF]/.test(text)) return { lang: 'Chinese', confidence: 0.98 };
    if (/[\u3040-\u30FF]/.test(text)) return { lang: 'Japanese', confidence: 0.98 };
    if (/[\uAC00-\uD7AF]/.test(text)) return { lang: 'Korean', confidence: 0.98 };
    if (/[\u0400-\u04FF]/.test(text)) return { lang: 'Russian', confidence: 0.95 };
    if (/[\u0600-\u06FF]/.test(text)) return { lang: 'Arabic', confidence: 0.96 };
    if (/[\u0E00-\u0E7F]/.test(text)) return { lang: 'Thai', confidence: 0.96 };
    if (/[àáảãạăắặằẳẵâấầẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(text)) {
      return { lang: 'Vietnamese', confidence: 0.95 };
    }
    return { lang: 'English', confidence: 0.85 };
  }

  /**
   * Translates a single string using Google Translate API.
   */
  public static async translate(
    text: string,
    options: TranslateOptions,
    signal?: AbortSignal
  ): Promise<TranslateResult> {
    const raw = text.trim();
    if (!raw) {
      return {
        translatedText: '',
        detectedSourceLang: options.sourceLang,
        confidence: 1.0,
        wordCount: 0,
      };
    }

    const srcCode = this.getLangCode(options.sourceLang);
    const tgtCode = this.getLangCode(options.targetLang);
    const wordCount = raw.split(/\s+/).length;

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${srcCode}&tl=${tgtCode}&dt=t&q=${encodeURIComponent(raw)}`;

    try {
      const res = await fetch(url, { signal: signal || AbortSignal.timeout(12000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      let translated = '';
      if (data && data[0]) {
        data[0].forEach((item: any) => {
          if (item && item[0]) translated += item[0];
        });
      }

      const detectedCode = data[2] || srcCode;
      const detectedName = this.getLangName(detectedCode);

      return {
        translatedText: translated || raw,
        detectedSourceLang: detectedName,
        confidence: 0.98,
        wordCount,
      };
    } catch (err: any) {
      console.warn('[TranslateEngine] Fetch failed, fallback:', err);
      // Fallback
      return {
        translatedText: `[Dịch: ${raw}]`,
        detectedSourceLang: options.sourceLang,
        confidence: 0.5,
        wordCount,
      };
    }
  }

  /**
   * Batch translates an array of texts.
   */
  public static async translateBatch(
    items: { id: string; text: string }[],
    options: TranslateOptions,
    onProgress?: (done: number, total: number) => void
  ): Promise<Map<string, string>> {
    const results = new Map<string, string>();
    const total = items.length;
    let done = 0;

    // Process in chunks of 5 concurrently to avoid rate limits
    const chunkSize = 5;
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      await Promise.all(
        chunk.map(async (item) => {
          try {
            const res = await this.translate(item.text, options);
            results.set(item.id, res.translatedText);
          } catch {
            results.set(item.id, item.text);
          } finally {
            done++;
            if (onProgress) onProgress(done, total);
          }
        })
      );
    }

    return results;
  }
}

