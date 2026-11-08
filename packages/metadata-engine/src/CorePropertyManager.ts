// ─────────────────────────────────────────────────────────────────────────────
// Core Property Manager — Manages OpenXML core properties
// Ref: METADATA_ENGINE.md §7, §10
// ─────────────────────────────────────────────────────────────────────────────

import type { CoreProperties, ContentType } from './models/Metadata';

export class CorePropertyManager {
  private properties: CoreProperties;

  constructor(initial?: Partial<CoreProperties>) {
    this.properties = {
      contentType: 'word-document',
      keywords: [],
      ...initial
    };
  }

  get(): CoreProperties {
    return { ...this.properties, keywords: [...(this.properties.keywords ?? [])] };
  }

  set(updates: Partial<CoreProperties>): void {
    if (updates.keywords !== undefined) {
      this.properties.keywords = [...updates.keywords];
    }
    this.properties = { ...this.properties, ...updates, keywords: this.properties.keywords };
  }

  addKeyword(keyword: string): void {
    const kw = this.properties.keywords ?? [];
    if (!kw.includes(keyword)) {
      this.properties.keywords = [...kw, keyword];
    }
  }

  removeKeyword(keyword: string): void {
    this.properties.keywords = (this.properties.keywords ?? []).filter(k => k !== keyword);
  }

  setContentType(type: ContentType): void {
    this.properties.contentType = type;
  }
}
