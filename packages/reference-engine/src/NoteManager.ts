// ─────────────────────────────────────────────────────────────────────────────
// Note Manager — Manages Footnotes and Endnotes
// Ref: REFERENCE_ENGINE.md §14, §15
// ─────────────────────────────────────────────────────────────────────────────

import type { Reference } from './models/Reference';

export class NoteManager {
  private footnotes: Reference[] = [];
  private endnotes: Reference[] = [];

  createFootnote(sourceObjectId: string, noteContentId: string): Reference {
    const ref: Reference = {
      referenceId: `fn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      referenceType: 'footnote',
      sourceObjectId,
      targetObjectId: noteContentId,
      displayFormat: 'arabic',
      status: 'valid',
      dependencies: ['layout', 'pagination'],
      metadata: { number: this.footnotes.length + 1 },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.footnotes.push(ref);
    return ref;
  }

  createEndnote(sourceObjectId: string, noteContentId: string): Reference {
    const ref: Reference = {
      referenceId: `en-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      referenceType: 'endnote',
      sourceObjectId,
      targetObjectId: noteContentId,
      displayFormat: 'roman',
      status: 'valid',
      dependencies: ['layout', 'pagination'],
      metadata: { number: this.endnotes.length + 1 },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.endnotes.push(ref);
    return ref;
  }

  getFootnotes(): Reference[] {
    return [...this.footnotes];
  }

  getEndnotes(): Reference[] {
    return [...this.endnotes];
  }

  /**
   * Recalculates footnote/endnote numbers after edits.
   */
  recalculateNumbers(): void {
    this.footnotes.forEach((fn, idx) => fn.metadata.number = idx + 1);
    this.endnotes.forEach((en, idx) => en.metadata.number = idx + 1);
  }
}
