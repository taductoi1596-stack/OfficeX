// ─────────────────────────────────────────────────────────────────────────────
// Anchor Manager — Handles attachment of comments to document objects
// Ref: COMMENT_ENGINE.md §12, §13
// ─────────────────────────────────────────────────────────────────────────────

import type { Anchor, AnchorType } from './models/Comment';

function generateAnchorId(): string {
  return `anc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export class AnchorManager {
  private anchors = new Map<string, Anchor>();

  createAnchor(targetObjectId: string, anchorType: AnchorType = 'paragraph', rangeStart?: number, rangeEnd?: number): Anchor {
    const anchor: Anchor = {
      anchorId: generateAnchorId(),
      targetObjectId,
      anchorType,
      rangeStart,
      rangeEnd,
    };
    this.anchors.set(anchor.anchorId, anchor);
    return anchor;
  }

  getAnchor(anchorId: string): Anchor | undefined {
    return this.anchors.get(anchorId);
  }

  /**
   * Called by the Layout Engine when objects move, to update anchor positions if necessary.
   */
  updateAnchor(anchorId: string, updates: Partial<Anchor>): void {
    const anchor = this.anchors.get(anchorId);
    if (anchor) {
      Object.assign(anchor, updates);
    }
  }
}
