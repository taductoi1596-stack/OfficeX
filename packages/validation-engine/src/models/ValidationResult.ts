// ─────────────────────────────────────────────────────────────────────────────
// Validation Engine — Core Data Models
// Ref: VALIDATION_ENGINE.md §6, §13
// ─────────────────────────────────────────────────────────────────────────────

export type ValidationSeverity = 'error' | 'warning' | 'info';

export type ValidationType =
  | 'openxml'
  | 'schema'
  | 'formula'
  | 'reference'
  | 'relationship'
  | 'resource';

export type ValidationStatus = 'open' | 'fixed' | 'suppressed';

export interface ValidationResult {
  validationId: string;
  type: ValidationType;
  severity: ValidationSeverity;
  sourceObjectId?: string; // e.g., paragraphId, imageId
  message: string;
  suggestedFix?: string;
  status: ValidationStatus;
  metadata: Record<string, any>;
}

export interface ValidationReport {
  documentId: string;
  ranAt: number;
  results: ValidationResult[];
  errorCount: number;
  warningCount: number;
  infoCount: number;
  isValid: boolean; // true if no errors
}
