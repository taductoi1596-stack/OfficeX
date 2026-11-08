// ─────────────────────────────────────────────────────────────────────────────
// Reference Manager — Central orchestrator for the Reference Engine
// Ref: REFERENCE_ENGINE.md §4, §5
// ─────────────────────────────────────────────────────────────────────────────

import type { Reference } from './models/Reference';
import { TOCManager } from './TOCManager';
import { CitationManager } from './CitationManager';
import { NoteManager } from './NoteManager';

export class ReferenceManager {
  readonly toc = new TOCManager();
  readonly citations = new CitationManager();
  readonly notes = new NoteManager();

  private references = new Map<string, Reference>();

  // ─── Cross References ─────────────────────────────────────────────────────

  createCrossReference(sourceObjectId: string, targetBookmarkId: string): Reference {
    const ref: Reference = {
      referenceId: `xref-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      referenceType: 'cross-reference',
      sourceObjectId,
      targetObjectId: targetBookmarkId,
      displayFormat: 'default',
      status: 'valid',
      dependencies: [`bookmark:${targetBookmarkId}`],
      metadata: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.references.set(ref.referenceId, ref);
    return ref;
  }

  getCrossReference(id: string): Reference | undefined {
    return this.references.get(id);
  }

  // ─── Global Validation ────────────────────────────────────────────────────

  validateAll(liveTargets: Set<string>): void {
    // Cross references
    for (const ref of this.references.values()) {
      if (ref.targetObjectId && !liveTargets.has(ref.targetObjectId)) {
        ref.status = 'broken';
      } else {
        ref.status = 'valid';
      }
    }
    
    // Notes re-numbering
    this.notes.recalculateNumbers();
  }
}
