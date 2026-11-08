// ─────────────────────────────────────────────────────────────────────────────
// Anchor Manager — Manages object anchors (image, table, shape, chart)
// Ref: BOOKMARK_ENGINE.md §9
// ─────────────────────────────────────────────────────────────────────────────

import type { Bookmark, BookmarkPosition } from './models/Bookmark';

export class AnchorManager {
  private anchors = new Map<string, Bookmark>();

  createAnchor(
    objectId: string,
    name: string,
    pageHint?: number,
    metadata: Record<string, any> = {}
  ): Bookmark {
    const anchor: Bookmark = {
      bookmarkId: `anchor-${objectId}`,
      name,
      bookmarkType: 'anchor',
      position: { objectId, pageHint },
      status: 'valid',
      metadata,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.anchors.set(anchor.bookmarkId, anchor);
    return anchor;
  }

  getAnchor(objectId: string): Bookmark | undefined {
    return this.anchors.get(`anchor-${objectId}`);
  }

  /**
   * Called when an object moves (layout recalculation).
   * Updates the page hint while keeping the objectId stable.
   */
  updateAnchorPosition(objectId: string, newPage: number): void {
    const anchor = this.anchors.get(`anchor-${objectId}`);
    if (anchor) {
      anchor.position.pageHint = newPage;
      anchor.updatedAt = Date.now();
    }
  }

  removeAnchor(objectId: string): void {
    this.anchors.delete(`anchor-${objectId}`);
  }

  getAllAnchors(): Bookmark[] {
    return Array.from(this.anchors.values());
  }
}
