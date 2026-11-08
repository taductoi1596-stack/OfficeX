// ─────────────────────────────────────────────────────────────────────────────
// Grammar Manager — Central orchestrator for the Grammar Engine
// Ref: GRAMMAR_ENGINE.md §4, §5, §18
// ─────────────────────────────────────────────────────────────────────────────

import { Tokenizer } from './Tokenizer';
import { SyntaxAnalyzer } from './SyntaxAnalyzer';
import { StyleAnalyzer } from './StyleAnalyzer';
import { PunctuationValidator } from './PunctuationValidator';
import type { GrammarIssue } from './models/GrammarIssue';

export class GrammarManager {
  readonly tokenizer = new Tokenizer();
  readonly syntaxAnalyzer = new SyntaxAnalyzer();
  readonly styleAnalyzer = new StyleAnalyzer();
  readonly punctuationValidator = new PunctuationValidator();

  private defaultLanguage = 'en-US';

  setDefaultLanguage(lang: string): void {
    this.defaultLanguage = lang;
  }

  /**
   * Analyzes a block of text for grammar, style, and punctuation issues.
   */
  analyzeText(text: string, language: string = this.defaultLanguage): GrammarIssue[] {
    const issues: GrammarIssue[] = [];

    // 1. Punctuation pass (operates on raw text)
    issues.push(...this.punctuationValidator.validate(text, language));

    // 2. Sentence-level passes
    const sentences = this.tokenizer.splitIntoSentences(text);
    for (const sentence of sentences) {
      // Syntax & Grammar
      issues.push(...this.syntaxAnalyzer.analyze(sentence, language));
      
      // Style
      issues.push(...this.styleAnalyzer.analyze(sentence, language));
    }

    // Sort issues by appearance order
    return issues.sort((a, b) => a.startOffset - b.startOffset);
  }
}
