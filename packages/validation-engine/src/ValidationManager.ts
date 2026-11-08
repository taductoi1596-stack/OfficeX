// ─────────────────────────────────────────────────────────────────────────────
// Validation Manager — Central orchestrator for the Validation Engine
// Ref: VALIDATION_ENGINE.md §4, §5
// ─────────────────────────────────────────────────────────────────────────────

import type { ValidationReport, ValidationResult } from './models/ValidationResult';
import { SchemaValidator } from './validators/SchemaValidator';
import { ReferenceValidator, type ReferenceEntry } from './validators/ReferenceValidator';
import { ResourceValidator, type ResourceEntry } from './validators/ResourceValidator';

export class ValidationManager {
  private schemaValidator = new SchemaValidator();
  private referenceValidator = new ReferenceValidator();
  private resourceValidator = new ResourceValidator();

  /**
   * Runs all validators against the given document snapshot and returns
   * a consolidated ValidationReport.
   */
  validateDocument(
    documentId: string,
    document: Record<string, any>,
    references: ReferenceEntry[] = [],
    knownTargetIds: Set<string> = new Set(),
    resources: ResourceEntry[] = []
  ): ValidationReport {
    const allResults: ValidationResult[] = [
      ...this.schemaValidator.validate(document),
      ...this.referenceValidator.validate(references, knownTargetIds),
      ...this.resourceValidator.validate(resources),
    ];

    const errorCount = allResults.filter(r => r.severity === 'error').length;
    const warningCount = allResults.filter(r => r.severity === 'warning').length;
    const infoCount = allResults.filter(r => r.severity === 'info').length;

    return {
      documentId,
      ranAt: Date.now(),
      results: allResults,
      errorCount,
      warningCount,
      infoCount,
      isValid: errorCount === 0,
    };
  }

  filterBySeverity(report: ValidationReport, severity: ValidationResult['severity']): ValidationResult[] {
    return report.results.filter(r => r.severity === severity);
  }
}
