// ─────────────────────────────────────────────────────────────────────────────
// Thread Manager — Handles comment threads (conversations)
// Ref: COMMENT_ENGINE.md §8, §9, §11
// ─────────────────────────────────────────────────────────────────────────────

import type { Thread, Comment, Anchor } from './models/Comment';

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

export class ThreadManager {
  private threads = new Map<string, Thread>();

  createThread(anchor: Anchor, firstCommentContent: string, author: string, mentions: string[] = []): Thread {
    const threadId = generateId('thr');
    
    const initialComment: Comment = {
      commentId: generateId('cmt'),
      threadId,
      author,
      timestamp: Date.now(),
      content: firstCommentContent,
      mentions,
      status: 'active',
      metadata: {}
    };

    const thread: Thread = {
      threadId,
      anchor,
      comments: [initialComment],
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.threads.set(threadId, thread);
    return thread;
  }

  addReply(threadId: string, content: string, author: string, mentions: string[] = []): Comment | null {
    const thread = this.threads.get(threadId);
    if (!thread) return null;

    const reply: Comment = {
      commentId: generateId('cmt'),
      threadId,
      author,
      timestamp: Date.now(),
      content,
      mentions,
      status: 'active',
      metadata: {}
    };

    thread.comments.push(reply);
    thread.updatedAt = Date.now();
    return reply;
  }

  resolveThread(threadId: string): boolean {
    const thread = this.threads.get(threadId);
    if (!thread) return false;
    
    thread.status = 'resolved';
    thread.comments.forEach(c => c.status = 'resolved');
    thread.updatedAt = Date.now();
    return true;
  }

  reopenThread(threadId: string): boolean {
    const thread = this.threads.get(threadId);
    if (!thread) return false;
    
    thread.status = 'active';
    thread.comments.forEach(c => c.status = 'active');
    thread.updatedAt = Date.now();
    return true;
  }

  getThread(threadId: string): Thread | undefined {
    return this.threads.get(threadId);
  }

  getAllThreads(): Thread[] {
    return Array.from(this.threads.values());
  }
}
