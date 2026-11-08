// ─────────────────────────────────────────────────────────────────────────────
// Syntax Analyzer — Evaluates grammatical relationships
// Ref: GRAMMAR_ENGINE.md §7, §8
// ─────────────────────────────────────────────────────────────────────────────

import type { Sentence } from './Tokenizer';
import type { GrammarIssue } from './models/GrammarIssue';

export class SyntaxAnalyzer {
  analyze(sentence: Sentence, language: string): GrammarIssue[] {
    const issues: GrammarIssue[] = [];

    // Mock Rule: "a" vs "an"
    for (let i = 0; i < sentence.tokens.length - 1; i++) {
      const token = sentence.tokens[i];
      const nextToken = sentence.tokens[i + 1];

      const lowerText = token.text.toLowerCase();
      if (lowerText === 'a' || lowerText === 'an') {
        const nextStartsVowel = /^[aeiou]/i.test(nextToken.text);
        
        if (lowerText === 'a' && nextStartsVowel) {
          issues.push({
            issueId: `syn-${Date.now()}-${token.startOffset}`,
            type: 'grammar',
            severity: 'error',
            originalText: token.text,
            startOffset: token.startOffset,
            endOffset: token.endOffset,
            message: 'Use "an" before words starting with a vowel sound.',
            suggestions: [{ replacement: 'an', confidence: 0.95 }],
            ruleId: 'a-an-agreement'
          });
        } else if (lowerText === 'an' && !nextStartsVowel) {
          issues.push({
            issueId: `syn-${Date.now()}-${token.startOffset}`,
            type: 'grammar',
            severity: 'error',
            originalText: token.text,
            startOffset: token.startOffset,
            endOffset: token.endOffset,
            message: 'Use "a" before words starting with a consonant sound.',
            suggestions: [{ replacement: 'a', confidence: 0.95 }],
            ruleId: 'a-an-agreement'
          });
        }
      }
    }

    return issues;
  }
}
