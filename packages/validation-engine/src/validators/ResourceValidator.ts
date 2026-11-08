// ─────────────────────────────────────────────────────────────────────────────
// Resource Validator — Validates document resource availability
// Ref: VALIDATION_ENGINE.md §12
// ─────────────────────────────────────────────────────────────────────────────

import type { ValidationResult } from '../models/ValidationResult';

let _idSeq = 0;
function makeId() { return `val-res-${++_idSeq}`; }

export interface ResourceEntry {
  resourceId: string;
  type: 'image' | 'font' | 'video' | 'audio' | 'theme' | 'embedded';
  uri: string;
  isEmbedded: boolean;
}

export class ResourceValidator {
  /**
   * Validates resource entries. In a real implementation, this would
   * check that embedded resources are present in the package and that
   * external URIs are resolvable.
   */
  validate(resources: ResourceEntry[]): ValidationResult[] {
    const results: ValidationResult[] = [];

    for (const resource of resources) {
      // Simulate: flag external (non-embedded) resources as warnings
      if (!resource.isEmbedded && !resource.uri.startsWith('data:')) {
        results.push({
          validationId: makeId(),
          type: 'resource',
          severity: 'warning',
          sourceObjectId: resource.resourceId,
          message: `External ${resource.type} resource "${resource.uri}" may be unavailable when document is shared.`,
          suggestedFix: `Embed the ${resource.type} resource into the document package.`,
          status: 'open',
          metadata: { resourceType: resource.type, uri: resource.uri }
        });
      }

      // Simulate: flag resources with empty URIs as errors
      if (!resource.uri) {
        results.push({
          validationId: makeId(),
          type: 'resource',
          severity: 'error',
          sourceObjectId: resource.resourceId,
          message: `${resource.type} resource "${resource.resourceId}" has no URI.`,
          suggestedFix: `Provide a valid URI or remove the ${resource.type} resource.`,
          status: 'open',
          metadata: { resourceType: resource.type }
        });
      }
    }

    return results;
  }
}
