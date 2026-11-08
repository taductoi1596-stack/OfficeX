// ─────────────────────────────────────────────────────────────────────────────
// Citation Manager — Manages Citations and Bibliography
// Ref: REFERENCE_ENGINE.md §11, §12
// ─────────────────────────────────────────────────────────────────────────────

import type { Reference } from './models/Reference';

export interface CitationSource {
  id: string;
  author: string;
  title: string;
  year: string;
  publisher?: string;
  type: 'book' | 'article' | 'website';
}

export class CitationManager {
  private sources = new Map<string, CitationSource>();

  addSource(source: CitationSource): void {
    this.sources.set(source.id, source);
  }

  getSource(id: string): CitationSource | undefined {
    return this.sources.get(id);
  }

  getAllSources(): CitationSource[] {
    return Array.from(this.sources.values());
  }

  createCitation(sourceObjectId: string, targetSourceId: string): Reference {
    return {
      referenceId: `cite-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      referenceType: 'citation',
      sourceObjectId,
      targetObjectId: targetSourceId,
      displayFormat: 'APA', // Default style
      status: this.sources.has(targetSourceId) ? 'valid' : 'broken',
      dependencies: [`source:${targetSourceId}`],
      metadata: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }
}
