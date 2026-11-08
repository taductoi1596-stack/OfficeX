// ─────────────────────────────────────────────────────────────────────────────
// Style Analyzer — Detects wordiness, passive voice, readability issues
// Ref: GRAMMAR_ENGINE.md §10
// ─────────────────────────────────────────────────────────────────────────────

import type { Sentence } from './Tokenizer';
import type { GrammarIssue } from './models/GrammarIssue';

export class StyleAnalyzer {
  analyze(sentence: Sentence, language: string): GrammarIssue[] {
    const issues: GrammarIssue[] = [];

    // Mock Rule: "Passive Voice" (extremely naive detection: "is/was" + "by")
    const words = sentence.tokens.map(t => t.text.toLowerCase());
    
    const beVerbIndex = words.findIndex(w => ['is', 'are', 'was', 'were', 'been'].includes(w));
    const byIndex = words.findIndex(w => w === 'by');

    if (beVerbIndex >= 0 && byIndex > beVerbIndex) {
      issues.push({
        issueId: `style-${Date.now()}-${sentence.startOffset}`,
        type: 'style',
        severity: 'info',
        originalText: sentence.text,
        startOffset: sentence.startOffset,
        endOffset: sentence.endOffset,
        message: 'Passive voice detected. Consider rewriting in active voice.',
        suggestions: [], // AI might fill this in
        ruleId: 'passive-voice'
      });
    }

    return issues;
  }
}
