import { describe, it, expect } from 'vitest';
import { TranslateEngine, SUPPORTED_LANGUAGES } from './TranslateEngine';

describe('TranslateEngine', () => {
  it('has comprehensive language list including Vietnamese, English, Chinese, etc.', () => {
    expect(SUPPORTED_LANGUAGES).toContain('Vietnamese');
    expect(SUPPORTED_LANGUAGES).toContain('English');
    expect(SUPPORTED_LANGUAGES).toContain('Chinese');
    expect(SUPPORTED_LANGUAGES).toContain('Auto Detect');
  });

  it('maps language names to codes and vice-versa', () => {
    expect(TranslateEngine.getLangCode('Vietnamese')).toBe('vi');
    expect(TranslateEngine.getLangCode('English')).toBe('en');
    expect(TranslateEngine.getLangCode('Auto Detect')).toBe('auto');

    expect(TranslateEngine.getLangName('vi')).toBe('Vietnamese');
    expect(TranslateEngine.getLangName('en')).toBe('English');
  });

  it('detects language from text patterns', () => {
    const vi = TranslateEngine.detectLanguage('Xin chào, đây là biểu mẫu đánh giá dự án');
    expect(vi.lang).toBe('Vietnamese');

    const en = TranslateEngine.detectLanguage('eProjects Feedback Form Student Details');
    expect(en.lang).toBe('English');

    const zh = TranslateEngine.detectLanguage('你好，这是项目评估表');
    expect(zh.lang).toBe('Chinese');
  });

  it('handles empty text gracefully', async () => {
    const res = await TranslateEngine.translate('', { sourceLang: 'en', targetLang: 'vi' });
    expect(res.translatedText).toBe('');
    expect(res.wordCount).toBe(0);
  });
});

