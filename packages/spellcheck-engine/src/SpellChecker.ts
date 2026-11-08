// ─────────────────────────────────────────────────────────────────────────────
// Spell Checker — Detects typos and spelling issues
// Ref: SPELLCHECK.md §4
// ─────────────────────────────────────────────────────────────────────────────

import type { SpellIssue } from './models/Issue';
import type { DictionaryManager } from './DictionaryManager';

export class SpellChecker {
  constructor(private dictionary: DictionaryManager) {}

  /**
   * Scans a block of text and returns a list of spelling issues.
   * Mock implementation using basic regex word splitting.
   */
  checkText(text: string, language: string): SpellIssue[] {
    const issues: SpellIssue[] = [];
    // Basic regex to find words and their offsets
    const wordRegex = /\b[a-zA-Z]+\b/g;
    let match;

    while ((match = wordRegex.exec(text)) !== null) {
      const word = match[0];
      if (!this.dictionary.isWordValid(word)) {
        issues.push({
          issueId: `spell-${Date.now()}-${match.index}`,
          type: 'spelling',
          severity: 'error',
          originalText: word,
          startOffset: match.index,
          endOffset: match.index + word.length,
          message: `Unknown word: "${word}"`,
          suggestions: this.generateSuggestions(word),
          language
        });
      }
    }

    return issues;
  }

  private generateSuggestions(word: string) {
    // Mock suggestion generation
    if (word.toLowerCase() === 'teh') {
      return [{ replacement: 'the', confidence: 0.95 }];
    }
    if (word.toLowerCase() === 'docment') {
      return [{ replacement: 'document', confidence: 0.9 }];
    }
    return [];
  }
}
