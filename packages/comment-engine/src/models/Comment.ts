// ─────────────────────────────────────────────────────────────────────────────
// Comment Engine — Core Data Models
// Ref: COMMENT_ENGINE.md §6 + COMMENTS.md §3, §7, §9
// ─────────────────────────────────────────────────────────────────────────────

export type CommentStatus = 'active' | 'resolved' | 'reopened' | 'archived';

export type AnchorType =
  | 'paragraph'
  | 'text-range'
  | 'table'
  | 'image'
  | 'shape'
  | 'chart'
  | 'cell'
  | 'cell-range'
  | 'slide'
  | 'bookmark'
  | 'hyperlink';

export interface Anchor {
  anchorId: string;
  targetObjectId: string; // ID of the paragraph, shape, etc.
  anchorType?: AnchorType;
  rangeStart?: number;    // Optional character offset
  rangeEnd?: number;
}

export interface Comment {
  commentId: string;
  threadId: string; // The parent thread ID
  author: string;
  timestamp: number;
  content: string; // Rich text or plain text content
  mentions: string[]; // List of user IDs mentioned
  status: CommentStatus;
  metadata: Record<string, any>;
}

export interface Thread {
  threadId: string;
  anchor: Anchor;
  comments: Comment[]; // Chronological list of comments/replies in this thread
  status: CommentStatus;
  createdAt: number;
  updatedAt: number;
}
