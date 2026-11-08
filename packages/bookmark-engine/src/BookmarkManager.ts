// ─────────────────────────────────────────────────────────────────────────────
// Bookmark Manager — Central orchestrator for the Bookmark Engine
// Ref: BOOKMARK_ENGINE.md §4, §5, §7
// ─────────────────────────────────────────────────────────────────────────────

import type { Bookmark, BookmarkType, BookmarkPosition, BookmarkStatus } from './models/Bookmark';
import { AnchorManager } from './AnchorManager';
import { NamedRangeManager } from './NamedRangeManager';

function generateId(): string {
  return `bm-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export class BookmarkManager {
  readonly anchors: AnchorManager;
  readonly namedRanges: NamedRangeManager;

  private bookmarks = new Map<string, Bookmark>();
  private nameIndex = new Map<string, string>(); // name → bookmarkId

  constructor() {
    this.anchors = new AnchorManager();
    this.namedRanges = new NamedRangeManager();
  }

  // ─── CRUD ─────────────────────────────────────────────────────────────────

  create(
    name: string,
    bookmarkType: BookmarkType,
    position: BookmarkPosition,
    endPosition?: BookmarkPosition,
    metadata: Record<string, any> = {}
  ): Bookmark {
    if (this.nameIndex.has(name)) {
      throw new Error(`Bookmark name '${name}' already exists.`);
    }

    const bookmark: Bookmark = {
      bookmarkId: generateId(),
      name,
      bookmarkType,
      position,
      endPosition,
      status: 'valid',
      metadata,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.bookmarks.set(bookmark.bookmarkId, bookmark);
    this.nameIndex.set(name, bookmark.bookmarkId);
    return bookmark;
  }

  getById(bookmarkId: string): Bookmark | undefined {
    return this.bookmarks.get(bookmarkId);
  }

  getByName(name: string): Bookmark | undefined {
    const id = this.nameIndex.get(name);
    return id ? this.bookmarks.get(id) : undefined;
  }

  getAll(typeFilter?: BookmarkType): Bookmark[] {
    const all = Array.from(this.bookmarks.values());
    return typeFilter ? all.filter(b => b.bookmarkType === typeFilter) : all;
  }

  rename(bookmarkId: string, newName: string): void {
    const bookmark = this.bookmarks.get(bookmarkId);
    if (!bookmark) return;
    if (this.nameIndex.has(newName)) {
      throw new Error(`Bookmark name '${newName}' already exists.`);
    }
    this.nameIndex.delete(bookmark.name);
    bookmark.name = newName;
    bookmark.updatedAt = Date.now();
    this.nameIndex.set(newName, bookmarkId);
  }

  delete(bookmarkId: string): void {
    const bookmark = this.bookmarks.get(bookmarkId);
    if (bookmark) {
      this.nameIndex.delete(bookmark.name);
      this.bookmarks.delete(bookmarkId);
    }
  }

  // ─── Position Tracking ────────────────────────────────────────────────────

  /**
   * Called by Document Engine when object positions change.
   */
  updatePosition(bookmarkId: string, newPosition: BookmarkPosition): void {
    const bookmark = this.bookmarks.get(bookmarkId);
    if (bookmark) {
      bookmark.position = newPosition;
      bookmark.updatedAt = Date.now();
    }
  }

  /**
   * Mark a bookmark as orphaned when its target object is deleted.
   */
  markOrphaned(bookmarkId: string): void {
    const bookmark = this.bookmarks.get(bookmarkId);
    if (bookmark) {
      bookmark.status = 'orphaned';
      bookmark.updatedAt = Date.now();
    }
  }

  // ─── Validation ───────────────────────────────────────────────────────────

  /**
   * Validates all bookmarks — marks orphaned ones as broken.
   * In a real implementation, cross-checks against Document Engine's object registry.
   */
  validateAll(liveObjectIds: Set<string>): void {
    for (const bookmark of this.bookmarks.values()) {
      if (!liveObjectIds.has(bookmark.position.objectId)) {
        bookmark.status = 'broken';
      } else if (bookmark.status !== 'valid') {
        bookmark.status = 'valid';
      }
      bookmark.updatedAt = Date.now();
    }
  }

  getBrokenBookmarks(): Bookmark[] {
    return this.getAll().filter(b => b.status === 'broken' || b.status === 'orphaned');
  }

  // ─── Cross-Reference Targets ──────────────────────────────────────────────

  /**
   * Registers a cross-reference target (heading, figure, table) automatically.
   */
  registerCrossRefTarget(name: string, objectId: string, pageHint?: number): Bookmark {
    // Overwrite silently if already exists (from previous render)
    const existing = this.getByName(name);
    if (existing) {
      this.updatePosition(existing.bookmarkId, { objectId, pageHint });
      return existing;
    }
    return this.create(name, 'cross-ref-target', { objectId, pageHint });
  }
}
