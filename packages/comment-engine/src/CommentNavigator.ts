// ─────────────────────────────────────────────────────────────────────────────
// Comment Navigator — Utilities for navigating comment threads
// Ref: COMMENTS.md §12
// ─────────────────────────────────────────────────────────────────────────────

import type { Thread } from './models/Comment';

export class CommentNavigator {
  /**
   * Sorts threads chronologically based on their creation time.
   */
  static getSortedThreads(threads: Thread[]): Thread[] {
    return [...threads].sort((a, b) => a.createdAt - b.createdAt);
  }

  /**
   * Gets the next thread in chronological order after the provided thread ID.
   */
  static getNextThread(threads: Thread[], currentThreadId: string): Thread | undefined {
    const sorted = this.getSortedThreads(threads);
    const currentIndex = sorted.findIndex(t => t.threadId === currentThreadId);
    
    if (currentIndex >= 0 && currentIndex < sorted.length - 1) {
      return sorted[currentIndex + 1];
    }
    return undefined;
  }

  /**
   * Gets the previous thread in chronological order before the provided thread ID.
   */
  static getPreviousThread(threads: Thread[], currentThreadId: string): Thread | undefined {
    const sorted = this.getSortedThreads(threads);
    const currentIndex = sorted.findIndex(t => t.threadId === currentThreadId);
    
    if (currentIndex > 0) {
      return sorted[currentIndex - 1];
    }
    return undefined;
  }
}
