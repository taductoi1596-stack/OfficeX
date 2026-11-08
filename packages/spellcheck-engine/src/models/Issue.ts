// ─────────────────────────────────────────────────────────────────────────────
// SpellCheck Engine — Core Data Models
// Ref: SPELLCHECK.md §4, §5, §7
// ─────────────────────────────────────────────────────────────────────────────

export type IssueType = 'spelling' | 'grammar' | 'style';
export type IssueSeverity = 'error' | 'warning' | 'info';

export interface Suggestion {
  /** The suggested replacement text */
  replacement: string;
  /** A confidence score between 0 and 1 */
  confidence: number;
  /** Optional explanation of the suggestion */
  explanation?: string;
}

export interface SpellIssue {
  /** Unique ID for this issue instance */
  issueId: string;
  /** The type of issue detected */
  type: IssueType;
  /** The severity of the issue (determines underline color) */
  severity: IssueSeverity;
  /** The original text that triggered the issue */
  originalText: string;
  /** Start offset within the checked text block */
  startOffset: number;
  /** End offset within the checked text block */
  endOffset: number;
  /** A descriptive message explaining the issue */
  message: string;
  /** Ranked list of suggestions */
  suggestions: Suggestion[];
  /** The language used to detect the issue */
  language: string;
}
