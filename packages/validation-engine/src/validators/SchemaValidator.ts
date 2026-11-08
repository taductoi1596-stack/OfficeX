// ─────────────────────────────────────────────────────────────────────────────
// Schema Validator — Validates document object model structure
// Ref: VALIDATION_ENGINE.md §8
// ─────────────────────────────────────────────────────────────────────────────

import type { ValidationResult } from '../models/ValidationResult';

let _idSeq = 0;
function makeId() { return `val-schema-${++_idSeq}`; }

export class SchemaValidator {
  /**
   * Validates a generic document object (simplified).
   * In a full implementation this would validate against the OpenXML schema.
   */
  validate(document: Record<string, any>): ValidationResult[] {
    const results: ValidationResult[] = [];

    // Rule 1: document must have an 'id'
    if (!document['id']) {
      results.push({
        validationId: makeId(),
        type: 'schema',
        severity: 'error',
        message: 'Document is missing required "id" field.',
        suggestedFix: 'Assign a unique document ID.',
        status: 'open',
        metadata: {}
      });
    }

    // Rule 2: document must have sections
    if (!Array.isArray(document['sections']) || document['sections'].length === 0) {
      results.push({
        validationId: makeId(),
        type: 'schema',
        severity: 'warning',
        message: 'Document has no sections defined.',
        suggestedFix: 'Add at least one section to the document.',
        status: 'open',
        metadata: {}
      });
    }

    // Rule 3: document should have a title in metadata
    if (!document['title'] && !document['metadata']?.title) {
      results.push({
        validationId: makeId(),
        type: 'schema',
        severity: 'info',
        message: 'Document title is not set.',
        suggestedFix: 'Set a title via the Metadata Engine.',
        status: 'open',
        metadata: {}
      });
    }

    return results;
  }
}
