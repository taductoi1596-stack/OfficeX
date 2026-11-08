// ─────────────────────────────────────────────────────────────────────────────
// TOC Manager — Manages Table of Contents entries
// Ref: REFERENCE_ENGINE.md §7
// ─────────────────────────────────────────────────────────────────────────────

import type { Reference } from './models/Reference';

export interface TOCEntry {
  id: string;
  level: number;
  text: string;
  targetObjectId: string;
  pageHint?: number;
}

export class TOCManager {
  private tocEntries: TOCEntry[] = [];
  
  /**
   * Called by the system when parsing headings in the document to rebuild the TOC structure.
   */
  rebuildTOC(headings: { id: string, text: string, level: number, page?: number }[]): void {
    this.tocEntries = headings.map(h => ({
      id: `toc-entry-${h.id}`,
      level: h.level,
      text: h.text,
      targetObjectId: h.id,
      pageHint: h.page
    }));
  }

  getEntries(): TOCEntry[] {
    return [...this.tocEntries];
  }

  /**
   * Creates a root Reference object for a TOC field in the document.
   */
  createTOCReference(sourceObjectId: string): Reference {
    return {
      referenceId: `ref-toc-${Date.now()}`,
      referenceType: 'toc',
      sourceObjectId,
      displayFormat: 'default',
      status: 'valid',
      dependencies: ['headings', 'pagination'],
      metadata: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }
}
