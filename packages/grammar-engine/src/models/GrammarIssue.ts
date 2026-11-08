// ─────────────────────────────────────────────────────────────────────────────
// Grammar Engine — Core Data Models
// Ref: GRAMMAR_ENGINE.md §6
// ─────────────────────────────────────────────────────────────────────────────

export type IssueType = 'grammar' | 'style' | 'punctuation';
export type IssueSeverity = 'error' | 'warning' | 'info';

export interface Suggestion {
  replacement: string;
  confidence: number;
  explanation?: string;
}

export interface GrammarIssue {
  issueId: string;
  type: IssueType;
  severity: IssueSeverity;
  originalText: string;
  startOffset: number;
  endOffset: number;
  message: string;
  suggestions: Suggestion[];
  ruleId?: string; // Identifier for the grammar rule that was violated
}
