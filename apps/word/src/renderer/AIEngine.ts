export type AIRewriteOptions = {
  mode: string;
  tone: string;
  length: string;
  instruction: string;
};

export type AISummarizeOptions = {
  summaryType: string;
  summaryLength: string;
  writingStyle: string;
  targetAudience: string;
  outputLanguage: string;
  instruction: string;
};

export type CoverageAnalysis = {
  compressionRatio: number;
  readingTimeSavedMin: number;
  topicsCovered: string[];
  keyNumbers: string[];
  keyDates: string[];
  namedEntities: string[];
};

export type AITranslateOptions = {
  sourceLang: string;
  targetLang: string;
  mode: string;
  tone: string;
  domain: string;
  preserveFormatting: boolean;
  instruction: string;
};

export type AITranslateResult = {
  translatedText: string;
  detectedSourceLang: string;
  confidence: number;
  wordCount: number;
  translatedWordCount: number;
};

import { AIProviderManager } from './ai/AIProviderManager';
import { PromptBuilder } from './ai/prompt/PromptBuilder';
import { AIStreamingEngine } from './ai/streaming/AIStreamingEngine';
import { AIHistoryEngine } from './ai/history/AIHistoryEngine';
import { AISecurityEngine } from './ai/security/AISecurityEngine';
import { SummaryTypesEngine } from './ai/workflow/SummaryTypesEngine';

// ─── Rewrite Engine ──────────────────────────────────────────────────────────

export class AIEngine {
  /**
   * Mock streaming AI rewrite response.
   * Returns a function to cancel the stream.
   */
  static streamRewrite(
    contextText: string,
    options: AIRewriteOptions,
    onToken: (text: string) => void,
    onComplete: (fullText: string) => void
  ): () => void {
    let cancelled = false;
    let index = 0;

    let responseText = `[AI ${options.mode} | Tone: ${options.tone} | Length: ${options.length}]\n`;
    if (options.instruction) {
      responseText += `*Following instruction: "${options.instruction}"*\n\n`;
    }

    if (!contextText.trim()) {
      responseText += 'Please select some text to rewrite.';
    } else if (options.mode === 'Summarize') {
      responseText += `Here is a summary:\n- Key point 1\n- Key point 2\n- Conclusion based on: "${contextText.substring(0, 30)}..."`;
    } else if (options.mode === 'Improve Writing') {
      responseText += `(Improved) ${contextText} ... refined for clarity and flow.`;
    } else if (options.length === 'Short') {
      responseText += `(Shortened) ${contextText.substring(0, Math.max(10, Math.floor(contextText.length / 2)))}...`;
    } else {
      responseText += `Here is the rewritten version tailored to be ${options.tone}:\n\n${contextText} (enhanced and expanded to match the desired tone).`;
    }

    const providerId = AIProviderManager.getActiveProviderId() || 'ollama';
    const models = AIProviderManager.getModelsForProvider(providerId);
    const modelId = models.length > 0 ? models[0].id : '';

    let safeContext: string;
    try {
      safeContext = AISecurityEngine.validateRequest(contextText, 'rewrite');
    } catch (e: any) {
      onComplete(`[Error: ${e.message}]`);
      return () => {};
    }

    const { systemPrompt, safeUserPrompt } = PromptBuilder.build({
      operation: 'rewrite',
      variables: {
        tone: options.tone,
        length: options.length,
        instruction: options.instruction
      }
    }, contextText);

    const stream = AIStreamingEngine.openStream({
      providerId,
      modelId,
      prompt: safeUserPrompt || safeContext,
      systemPrompt,
      operation: 'rewrite',
      mockResponseText: responseText
    });

    stream.onToken(onToken)
          .onComplete((actualText) => {
            try {
              const safeResponse = AISecurityEngine.validateResponse(actualText, 'rewrite');
              AIHistoryEngine.recordTransaction('rewrite', systemPrompt, safeUserPrompt || safeContext, safeResponse, stream.getTelemetry() as any);
              onComplete(safeResponse);
            } catch (e: any) {
              AIHistoryEngine.recordTransaction('rewrite', systemPrompt, safeUserPrompt || safeContext, e.message, stream.getTelemetry() as any, 'pending', 'error', e.message);
              onComplete(`[Error: ${e.message}]`);
            }
          })
          .onError((err) => {
            AIHistoryEngine.recordTransaction('rewrite', systemPrompt, safeUserPrompt || safeContext, err.message, stream.getTelemetry() as any, 'pending', 'error', err.message);
            onComplete(`[Error: ${err.message}]`);
          });

    return () => stream.cancel();
  }

  // ─── Summarization Engine ─────────────────────────────────────────────────

  /**
   * Mock streaming AI summarization.
   * Returns cancel function and coverage analysis.
   */
  static streamSummarize(
    contextText: string,
    options: AISummarizeOptions,
    onToken: (text: string) => void,
    onComplete: (fullText: string, coverage: CoverageAnalysis) => void
  ): () => void {
    let cancelled = false;

    const words = contextText.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Build response based on summary type
    let responseText = '';

    const header = `📋 ${options.summaryType}\n` +
      `Style: ${options.writingStyle} | Audience: ${options.targetAudience}\n\n`;

    if (!contextText.trim()) {
      responseText = 'No content to summarize. Please select text or ensure the document has content.';
    } else {
      switch (options.summaryType) {
        case 'Executive Summary':
          responseText = header +
            `This document presents key information relevant to stakeholders.\n\n` +
            `**Overview:** ${words.slice(0, 15).join(' ')}...\n\n` +
            `**Key Findings:**\n` +
            `• The primary focus of the content revolves around the stated objectives.\n` +
            `• Analysis indicates a structured approach to the subject matter.\n` +
            `• Strategic recommendations are aligned with organizational goals.\n\n` +
            `**Conclusion:** Based on the available information, the content supports informed decision-making at the executive level.`;
          break;
        case 'Key Points':
          responseText = header +
            `**Key Points Extracted:**\n\n` +
            `1. ${words.slice(0, 8).join(' ')}...\n` +
            `2. Important considerations have been identified throughout the text.\n` +
            `3. Core themes align with the stated objectives.\n` +
            `4. Additional context reinforces the primary arguments.\n` +
            `5. Concluding remarks summarize the essential takeaways.`;
          break;
        case 'Bullet List':
          responseText = header +
            `• ${words.slice(0, 6).join(' ')}\n` +
            `• Key themes and concepts are present throughout the document\n` +
            `• Supporting details reinforce the main arguments\n` +
            `• Contextual information provides necessary background\n` +
            `• Final observations complete the summary`;
          break;
        case 'Action Items':
          responseText = header +
            `**Action Items Identified:**\n\n` +
            `☐ Review and validate the primary content outlined in the document\n` +
            `☐ Assign ownership for key deliverables mentioned\n` +
            `☐ Schedule follow-up meeting to discuss findings\n` +
            `☐ Prepare updated documentation based on conclusions\n` +
            `☐ Distribute summary to relevant stakeholders`;
          break;
        case 'Meeting Summary':
          responseText = header +
            `**Meeting Summary**\n\n` +
            `**Attendees:** [Extracted from document]\n` +
            `**Date:** [Referenced in content]\n\n` +
            `**Discussion Points:**\n` +
            `1. ${words.slice(0, 8).join(' ')}...\n` +
            `2. Secondary discussion on relevant topics\n` +
            `3. Follow-up items were noted\n\n` +
            `**Decisions Made:**\n` +
            `• Key decision aligned with objectives\n\n` +
            `**Next Steps:**\n` +
            `• Follow up scheduled\n` +
            `• Documentation to be updated`;
          break;
        case 'One Sentence':
          responseText = header +
            `This document covers ${words.slice(0, 10).join(' ')} and presents findings relevant to the stated objectives.`;
          break;
        case 'Timeline Summary':
          responseText = header +
            `**Timeline of Key Events:**\n\n` +
            `→ Phase 1: Initial context established — ${words.slice(0, 5).join(' ')}...\n` +
            `→ Phase 2: Development of core themes and supporting evidence\n` +
            `→ Phase 3: Analysis and synthesis of information\n` +
            `→ Phase 4: Conclusions drawn and recommendations presented\n` +
            `→ Phase 5: Follow-up actions defined`;
          break;
        case 'FAQ Summary':
          responseText = header +
            `**Frequently Asked Questions:**\n\n` +
            `**Q: What is the primary focus of this content?**\n` +
            `A: The content focuses on ${words.slice(0, 8).join(' ')}...\n\n` +
            `**Q: What are the key takeaways?**\n` +
            `A: The key takeaways include the main themes and supporting evidence presented.\n\n` +
            `**Q: What actions are recommended?**\n` +
            `A: Follow-up actions have been identified based on the content analysis.`;
          break;
        default:
          responseText = header +
            `**Summary:**\n\n` +
            `${words.slice(0, 20).join(' ')}...\n\n` +
            `The content contains ${wordCount} words covering the stated subject matter. ` +
            `Key themes and supporting information are present throughout. ` +
            `The overall structure supports the primary conclusions.`;
      }

      if (options.instruction) {
        responseText += `\n\n*Custom instruction applied: "${options.instruction}"*`;
      }
    }

    // Build coverage analysis
    const summaryWords = responseText.split(/\s+/).length;
    const coverage: CoverageAnalysis = {
      compressionRatio: wordCount > 0 ? Math.round((1 - summaryWords / Math.max(wordCount, 1)) * 100) : 0,
      readingTimeSavedMin: Math.max(0, Math.round((wordCount - summaryWords) / 200)),
      topicsCovered: ['Main Subject', 'Supporting Details', 'Conclusions'],
      keyNumbers: words.filter(w => /^\d+([.,]\d+)?[%$€]?$/.test(w)).slice(0, 5),
      keyDates: words.filter((w, i) => /^\d{4}$/.test(w) || (words[i - 1] && /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i.test(words[i - 1]))).slice(0, 5),
      namedEntities: words.filter(w => /^[A-Z][a-z]{2,}$/.test(w)).slice(0, 6),
    };

    const providerId = AIProviderManager.getActiveProviderId() || 'ollama';
    const models = AIProviderManager.getModelsForProvider(providerId);
    const modelId = models.length > 0 ? models[0].id : '';

    let safeContext: string;
    try {
      safeContext = AISecurityEngine.validateRequest(contextText, 'summarize');
    } catch (e: any) {
      onComplete(`[Error: ${e.message}]`, coverage);
      return () => {};
    }

    const specializedInstruction = SummaryTypesEngine.getInstructionForType(options.summaryType);

    const { systemPrompt, safeUserPrompt } = PromptBuilder.build({
      operation: 'summarize',
      variables: {
        summaryType: options.summaryType,
        instruction: options.instruction ? `${specializedInstruction}\n\nAdditional Instructions: ${options.instruction}` : specializedInstruction
      }
    }, contextText);

    const stream = AIStreamingEngine.openStream({
      providerId,
      modelId,
      prompt: safeUserPrompt || safeContext,
      systemPrompt,
      operation: 'summarize',
      mockResponseText: responseText
    });

    stream.onToken(onToken)
          .onComplete((actualText) => {
            try {
              const safeResponse = AISecurityEngine.validateResponse(actualText, 'summarize');
              AIHistoryEngine.recordTransaction('summarize', systemPrompt, safeUserPrompt || safeContext, safeResponse, stream.getTelemetry() as any);
              onComplete(safeResponse, coverage);
            } catch (e: any) {
              AIHistoryEngine.recordTransaction('summarize', systemPrompt, safeUserPrompt || safeContext, e.message, stream.getTelemetry() as any, 'pending', 'error', e.message);
              onComplete(`[Error: ${e.message}]`, coverage);
            }
          })
          .onError((err) => {
            AIHistoryEngine.recordTransaction('summarize', systemPrompt, safeUserPrompt || safeContext, err.message, stream.getTelemetry() as any, 'pending', 'error', err.message);
            onComplete(`[Error: ${err.message}]`, coverage);
          });

    return () => stream.cancel();
  }

  // ─── Translation Engine ───────────────────────────────────────────────────

  /**
   * Mock language auto-detection based on character patterns.
   */
  static detectLanguage(text: string): { lang: string; confidence: number } {
    if (!text.trim()) return { lang: 'Unknown', confidence: 0 };
    if (/[\u4E00-\u9FFF]/.test(text)) return { lang: 'Chinese', confidence: 0.97 };
    if (/[\u3040-\u30FF]/.test(text)) return { lang: 'Japanese', confidence: 0.96 };
    if (/[\uAC00-\uD7AF]/.test(text)) return { lang: 'Korean', confidence: 0.97 };
    if (/[\u0400-\u04FF]/.test(text)) return { lang: 'Russian', confidence: 0.94 };
    if (/[\u0600-\u06FF]/.test(text)) return { lang: 'Arabic', confidence: 0.95 };
    if (/[\u0E00-\u0E7F]/.test(text)) return { lang: 'Thai', confidence: 0.96 };
    if (/[\u00C0-\u024F]/.test(text)) {
      const lower = text.toLowerCase();
      if (/\b(le|la|les|de|du|est|et|en|pour|avec)\b/.test(lower)) return { lang: 'French', confidence: 0.88 };
      if (/\b(der|die|das|und|ist|nicht|mit|von)\b/.test(lower)) return { lang: 'German', confidence: 0.87 };
      if (/\b(el|la|los|las|es|en|por|para|con)\b/.test(lower)) return { lang: 'Spanish', confidence: 0.86 };
      if (/\b(il|lo|la|i|gli|le|di|del|con)\b/.test(lower)) return { lang: 'Italian', confidence: 0.84 };
    }
    if (/[àáảãạăắặằẳẵâấầẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(text))
      return { lang: 'Vietnamese', confidence: 0.93 };
    return { lang: 'English', confidence: 0.82 };
  }

  static streamTranslate(
    contextText: string,
    options: AITranslateOptions,
    onToken: (text: string) => void,
    onComplete: (result: AITranslateResult) => void
  ): () => void {
    let cancelled = false;
    const abortController = new AbortController();

    const srcLang = options.sourceLang === 'Auto Detect' ? 'auto' : this.getLangCode(options.sourceLang);
    const tgtLang = this.getLangCode(options.targetLang);

    if (!contextText.trim()) {
      const result: AITranslateResult = {
        translatedText: 'No text to translate. Please select some text first.',
        detectedSourceLang: options.sourceLang,
        confidence: 0,
        wordCount: 0,
        translatedWordCount: 0,
      };
      setTimeout(() => { if (!cancelled) onComplete(result); }, 10);
      return () => { cancelled = true; };
    }

    const wordCount = contextText.trim().split(/\s+/).length;

    // Call Google Translate API
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${srcLang}&tl=${tgtLang}&dt=t&q=${encodeURIComponent(contextText)}`;

    fetch(url, { signal: abortController.signal })
      .then(res => res.json())
      .then(data => {
        if (cancelled) return;
        
        // Data format: [ [ [ "translated text", "original text", null, null, 1 ] ], null, "detected_lang" ]
        let translatedText = '';
        if (data && data[0]) {
          data[0].forEach((item: any) => {
            if (item[0]) translatedText += item[0];
          });
        }
        
        const detectedSrc = data[2] || srcLang;

        onToken(translatedText);
        
        onComplete({
          translatedText,
          detectedSourceLang: detectedSrc,
          confidence: 1.0,
          wordCount,
          translatedWordCount: translatedText.split(/\s+/).length,
        });
      })
      .catch(err => {
        if (cancelled) return;
        onToken(`[Error translating: ${err.message}]`);
        onComplete({
          translatedText: `[Error translating: ${err.message}]`,
          detectedSourceLang: srcLang,
          confidence: 0,
          wordCount,
          translatedWordCount: 0,
        });
      });

    return () => {
      cancelled = true;
      abortController.abort();
    };
  }

  private static getLangCode(lang: string): string {
    const map: Record<string, string> = {
      'Auto Detect': 'auto',
      'English': 'en', 'Vietnamese': 'vi', 'Chinese': 'zh-CN', 'Japanese': 'ja', 'Korean': 'ko',
      'French': 'fr', 'German': 'de', 'Spanish': 'es', 'Italian': 'it', 'Portuguese': 'pt',
      'Russian': 'ru', 'Arabic': 'ar', 'Thai': 'th', 'Dutch': 'nl', 'Polish': 'pl',
      'Swedish': 'sv', 'Norwegian': 'no', 'Danish': 'da', 'Finnish': 'fi', 'Greek': 'el',
      'Hebrew': 'he', 'Turkish': 'tr', 'Hindi': 'hi', 'Indonesian': 'id', 'Malay': 'ms',
      'Czech': 'cs', 'Hungarian': 'hu', 'Romanian': 'ro', 'Ukrainian': 'uk', 'Slovak': 'sk',
    };
    return map[lang] || 'en';
  }
}

