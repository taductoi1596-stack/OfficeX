// ─────────────────────────────────────────────────────────────────────────────
// Gallery Manager — Template catalogue, search, categories, favourites
// Ref: TEMPLATE_ENGINE.md §14
// ─────────────────────────────────────────────────────────────────────────────

import type { Template, TemplateCategory, TemplateType } from './models/Template';

export interface GalleryQuery {
  category?: TemplateCategory;
  type?: TemplateType;
  search?: string;
  /** Only return corporate / org-managed templates */
  corporateOnly?: boolean;
}

export class GalleryManager {
  private templates: Map<string, Template> = new Map();
  private favourites: Set<string> = new Set();
  private recent: string[] = [];

  // ─── Registration ────────────────────────────────────────────────────────────

  register(template: Template): void {
    this.templates.set(template.id, template);
  }

  unregister(id: string): boolean {
    return this.templates.delete(id);
  }

  // ─── Query ───────────────────────────────────────────────────────────────────

  query(query: GalleryQuery = {}): Template[] {
    let results = Array.from(this.templates.values());

    if (query.category) {
      results = results.filter((t) => t.category === query.category);
    }
    if (query.type) {
      results = results.filter((t) => t.type === query.type);
    }
    if (query.corporateOnly) {
      results = results.filter((t) => t.metadata.isCorporate);
    }
    if (query.search) {
      const term = query.search.toLowerCase();
      results = results.filter(
        (t) =>
          t.name.toLowerCase().includes(term) ||
          t.description?.toLowerCase().includes(term) ||
          t.metadata.tags?.some((tag) => tag.toLowerCase().includes(term))
      );
    }

    return results;
  }

  getById(id: string): Template | undefined {
    return this.templates.get(id);
  }

  getAll(): Template[] {
    return Array.from(this.templates.values());
  }

  // ─── Favourites ──────────────────────────────────────────────────────────────

  addFavourite(id: string): void {
    this.favourites.add(id);
  }

  removeFavourite(id: string): void {
    this.favourites.delete(id);
  }

  getFavourites(): Template[] {
    return [...this.favourites]
      .map((id) => this.templates.get(id))
      .filter(Boolean) as Template[];
  }

  // ─── Recent ──────────────────────────────────────────────────────────────────

  markUsed(id: string): void {
    this.recent = [id, ...this.recent.filter((r) => r !== id)].slice(0, 20);
  }

  getRecent(): Template[] {
    return this.recent
      .map((id) => this.templates.get(id))
      .filter(Boolean) as Template[];
  }

  // ─── Stats ───────────────────────────────────────────────────────────────────

  getStats(): { total: number; corporate: number; favourites: number } {
    return {
      total: this.templates.size,
      corporate: this.query({ corporateOnly: true }).length,
      favourites: this.favourites.size,
    };
  }
}
