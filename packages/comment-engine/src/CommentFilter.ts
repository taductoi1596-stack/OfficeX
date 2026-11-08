// ─────────────────────────────────────────────────────────────────────────────
// Comment Filter — Utilities for filtering comment threads
// Ref: COMMENTS.md §11
// ─────────────────────────────────────────────────────────────────────────────

import type { Thread, CommentStatus, AnchorType } from './models/Comment';

export interface FilterCriteria {
  author?: string;
  status?: CommentStatus;
  mentionedUser?: string;
  anchorType?: AnchorType;
  unresolvedOnly?: boolean;
  dateFrom?: number;
  dateTo?: number;
}

export class CommentFilter {
  static filterThreads(threads: Thread[], criteria: FilterCriteria): Thread[] {
    return threads.filter(thread => {
      // Unresolved only
      if (criteria.unresolvedOnly && (thread.status === 'resolved' || thread.status === 'archived')) {
        return false;
      }

      // Status match
      if (criteria.status && thread.status !== criteria.status) {
        return false;
      }

      // Anchor type match
      if (criteria.anchorType && thread.anchor.anchorType !== criteria.anchorType) {
        return false;
      }

      // Deep inspection (comments inside the thread)
      let authorMatch = !criteria.author;
      let mentionMatch = !criteria.mentionedUser;
      let dateMatch = (!criteria.dateFrom && !criteria.dateTo);

      if (!authorMatch || !mentionMatch || !dateMatch) {
        let foundAuthor = false;
        let foundMention = false;
        let foundDate = false;

        for (const comment of thread.comments) {
          if (!authorMatch && comment.author === criteria.author) foundAuthor = true;
          if (!mentionMatch && comment.mentions.includes(criteria.mentionedUser!)) foundMention = true;
          
          if (!dateMatch) {
            const afterFrom = !criteria.dateFrom || comment.timestamp >= criteria.dateFrom;
            const beforeTo = !criteria.dateTo || comment.timestamp <= criteria.dateTo;
            if (afterFrom && beforeTo) foundDate = true;
          }
        }

        if (criteria.author && !foundAuthor) return false;
        if (criteria.mentionedUser && !foundMention) return false;
        if ((criteria.dateFrom || criteria.dateTo) && !foundDate) return false;
      }

      return true;
    });
  }
}
