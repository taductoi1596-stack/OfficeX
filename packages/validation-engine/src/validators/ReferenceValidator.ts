// ─────────────────────────────────────────────────────────────────────────────
// Reference Validator — Detects broken internal references
// Ref: VALIDATION_ENGINE.md §10
// ─────────────────────────────────────────────────────────────────────────────

import type { ValidationResult } from '../models/ValidationResult';

let _idSeq = 0;
function makeId() { return `val-ref-${++_idSeq}`; }

export interface ReferenceEntry {
  referenceId: string;
  targetId: string;
  type: 'bookmark' | 'hyperlink' | 'cross-reference' | 'toc-entry';
}

export class ReferenceValidator {
  /**
   * Validates that all references in the document point to existing targets.
   * @param references List of references found in the document
   * @param knownTargetIds Set of valid target IDs (e.g., bookmark IDs, paragraph IDs)
   */
  validate(references: ReferenceEntry[], knownTargetIds: Set<string>): ValidationResult[] {
    const results: ValidationResult[] = [];

    for (const ref of references) {
      if (!knownTargetIds.has(ref.targetId)) {
        results.push({
          validationId: makeId(),
          type: 'reference',
          severity: 'warning',
          sourceObjectId: ref.referenceId,
          message: `Broken ${ref.type}: target "${ref.targetId}" does not exist.`,
          suggestedFix: `Remove or update the ${ref.type} pointing to "${ref.targetId}".`,
          status: 'open',
          metadata: { referenceType: ref.type, targetId: ref.targetId }
        });
      }
    }

    return results;
  }
}
