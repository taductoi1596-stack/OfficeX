// ─────────────────────────────────────────────────────────────────────────────
// Recent Files Manager — tracks recently opened documents & favourites
// Ref: SESSION_ENGINE.md §9
// ─────────────────────────────────────────────────────────────────────────────

import type { RecentFile } from './models/Session';

export class RecentFilesManager {
  private files: RecentFile[] = [];
  private maxItems: number;

  constructor(maxItems = 50) {
    this.maxItems = maxItems;
  }

  add(entry: Omit<RecentFile, 'lastOpenedAt'>): void {
    // Remove existing entry with the same path
    this.files = this.files.filter((f) => f.filePath !== entry.filePath);

    // Insert at front
    this.files.unshift({ ...entry, lastOpenedAt: Date.now() });

    // Trim — keep pinned files beyond the limit
    const pinned = this.files.filter((f) => f.isPinned);
    const unpinned = this.files.filter((f) => !f.isPinned).slice(0, this.maxItems);
    this.files = [...pinned, ...unpinned];
  }

  remove(id: string): void {
    this.files = this.files.filter((f) => f.id !== id);
  }

  pin(id: string): void {
    const file = this.files.find((f) => f.id === id);
    if (file) file.isPinned = true;
  }

  unpin(id: string): void {
    const file = this.files.find((f) => f.id === id);
    if (file) file.isPinned = false;
  }

  getAll(): RecentFile[] {
    return [...this.files].sort((a, b) => {
      // Pinned first, then by recency
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      return b.lastOpenedAt - a.lastOpenedAt;
    });
  }

  getPinned(): RecentFile[] {
    return this.files.filter((f) => f.isPinned);
  }

  getCloud(): RecentFile[] {
    return this.files.filter((f) => f.isCloud);
  }

  clear(): void {
    // Keep pinned entries
    this.files = this.files.filter((f) => f.isPinned);
  }

  serialize(): RecentFile[] {
    return this.getAll();
  }

  hydrate(files: RecentFile[]): void {
    this.files = files;
  }
}
