// ─────────────────────────────────────────────────────────────────────────────
// Bookmark Engine — Core Data Models
// Ref: BOOKMARK_ENGINE.md §6
// ─────────────────────────────────────────────────────────────────────────────

export type BookmarkType =
  | 'user'           // Manually created by user
  | 'system'         // Created by application (TOC, headers, etc.)
  | 'hidden'         // Internal / invisible bookmarks
  | 'named-range'    // Excel named ranges
  | 'anchor'         // Object anchors (image, table, shape)
  | 'cross-ref-target' // Heading, figure, table reference targets
  | 'nav-marker';    // Reading position, review marker

export type BookmarkStatus = 'valid' | 'invalid' | 'broken' | 'orphaned';

export interface BookmarkPosition {
  /** Logical paragraph or object ID in the document model */
  objectId: string;
  /** Character offset within a text node (for text bookmarks) */
  charOffset?: number;
  /** Page number hint (may become stale, objectId is authoritative) */
  pageHint?: number;
}

export interface Bookmark {
  bookmarkId: string;
  name: string;
  bookmarkType: BookmarkType;
  position: BookmarkPosition;
  /** Optional range end position (for range bookmarks) */
  endPosition?: BookmarkPosition;
  status: BookmarkStatus;
  metadata: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}
