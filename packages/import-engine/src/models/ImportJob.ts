export type ImportStatus = 'pending' | 'detecting' | 'validating' | 'parsing' | 'completed' | 'failed';
export type DetectedFormat = 'docx' | 'xlsx' | 'pptx' | 'pdf' | 'rtf' | 'html' | 'txt' | 'csv' | 'unknown';
export type ParserType = 'openxml' | 'pdf' | 'legacy' | 'text' | 'plugin' | 'none';

export interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

export interface ImportJob {
  readonly id: string;
  sourceFile: string;
  detectedFormat: DetectedFormat;
  parser: ParserType;
  compatibilityMode: boolean;
  validationResult: ValidationResult;
  progress: number;
  status: ImportStatus;
  metadata: Record<string, any>;
}

export const createImportJob = (sourceFile: string): ImportJob => ({
  id: `imp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
  sourceFile,
  detectedFormat: 'unknown',
  parser: 'none',
  compatibilityMode: false,
  validationResult: { isValid: true, warnings: [], errors: [] },
  progress: 0,
  status: 'pending',
  metadata: {}
});
