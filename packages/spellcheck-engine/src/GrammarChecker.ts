// ─────────────────────────────────────────────────────────────────────────────
// Grammar Checker — Detects grammar and punctuation issues
// Ref: SPELLCHECK.md §5
// ─────────────────────────────────────────────────────────────────────────────

import type { SpellIssue } from './models/Issue';

export class GrammarChecker {
  /**
   * Scans a block of text and returns a list of grammar/style issues.
   * Mock implementation with basic rules.
   */
  checkText(text: string, language: string): SpellIssue[] {
    const issues: SpellIssue[] = [];

    // Mock Rule 1: Multiple spaces between words
    const doubleSpaceRegex = /([a-zA-Z])( {2,})([a-zA-Z])/g;
    let match;
    while ((match = doubleSpaceRegex.exec(text)) !== null) {
      issues.push({
        issueId: `grammar-${Date.now()}-${match.index}`,
        type: 'grammar',
        severity: 'warning',
        originalText: match[2],
        startOffset: match.index + match[1].length,
        endOffset: match.index + match[1].length + match[2].length,
        message: 'Extra space between words.',
        suggestions: [{ replacement: ' ', confidence: 1.0 }],
        language
      });
    }

    // Mock Rule 2: Sentence starting with lowercase
    // Naive regex just for demo purposes
    const lowercaseStartRegex = /(^\s*|\.\s+)([a-z])/g;
    while ((match = lowercaseStartRegex.exec(text)) !== null) {
      const char = match[2];
      const offset = match.index + match[1].length;
      issues.push({
        issueId: `grammar-${Date.now()}-${offset}`,
        type: 'style',
        severity: 'info',
        originalText: char,
        startOffset: offset,
        endOffset: offset + 1,
        message: 'Sentence should start with a capital letter.',
        suggestions: [{ replacement: char.toUpperCase(), confidence: 0.9 }],
        language
      });
    }

    return issues;
  }
}
