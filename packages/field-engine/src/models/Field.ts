// ─────────────────────────────────────────────────────────────────────────────
// Field Engine — Core Data Models
// Ref: FIELD_ENGINE.md §6
// ─────────────────────────────────────────────────────────────────────────────

export type FieldType =
  | 'PAGE'
  | 'NUMPAGES'
  | 'DATE'
  | 'TIME'
  | 'AUTHOR'
  | 'TOC'
  | 'REF'
  | 'HYPERLINK'
  | 'INCLUDETEXT'
  | 'SEQ'
  | 'DOCVARIABLE'
  | 'MERGEFIELD'
  | 'UNKNOWN';

export type FieldStatus = 'uninitialized' | 'valid' | 'stale' | 'error';
export type EvaluationMode = 'auto' | 'manual' | 'lazy';

export interface FieldContext {
  pageNumber?: number;
  totalPages?: number;
  documentVariables: Record<string, string>;
  metadata: Record<string, string>;
}

export interface FieldAST {
  type: FieldType;
  params: string[];
  switches: Record<string, string | boolean>;
}

export interface Field {
  fieldId: string;
  rawCode: string; // e.g. " DATE \\@ 'yyyy-MM-dd' "
  ast?: FieldAST;
  result: string;  // The calculated text to display
  status: FieldStatus;
  mode: EvaluationMode;
  dependencies: string[]; // List of dependency keys (e.g., 'var:User', 'pagination')
  createdAt: number;
  updatedAt: number;
}
