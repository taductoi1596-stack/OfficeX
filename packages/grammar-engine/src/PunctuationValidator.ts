// ─────────────────────────────────────────────────────────────────────────────
// Punctuation Validator — Checks punctuation rules
// Ref: GRAMMAR_ENGINE.md §9
// ─────────────────────────────────────────────────────────────────────────────

import type { GrammarIssue } from './models/GrammarIssue';

export class PunctuationValidator {
  validate(text: string, language: string): GrammarIssue[] {
    const issues: GrammarIssue[] = [];

    // Mock Rule: Comma without a space after it (and not a number like 1,000)
    const commaRegex = /,([a-zA-Z])/g;
    let match;
    while ((match = commaRegex.exec(text)) !== null) {
      issues.push({
        issueId: `punct-${Date.now()}-${match.index}`,
        type: 'punctuation',
        severity: 'warning',
        originalText: `,${match[1]}`,
        startOffset: match.index,
        endOffset: match.index + 2,
        message: 'Add a space after a comma.',
        suggestions: [{ replacement: `, ${match[1]}`, confidence: 1.0 }],
        ruleId: 'comma-spacing'
      });
    }

    return issues;
  }
}
