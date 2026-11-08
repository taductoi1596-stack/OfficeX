// ─────────────────────────────────────────────────────────────────────────────
// Comment Manager — Central orchestrator for the Comment Engine
// Ref: COMMENT_ENGINE.md §4, §5 + COMMENTS.md §10, §11, §12
// ─────────────────────────────────────────────────────────────────────────────

import { ThreadManager } from './ThreadManager';
import { MentionManager } from './MentionManager';
import { AnchorManager } from './AnchorManager';
import { CommentFilter, type FilterCriteria } from './CommentFilter';
import { CommentNavigator } from './CommentNavigator';
import type { Thread, Comment, AnchorType } from './models/Comment';

export class CommentManager {
  readonly threads = new ThreadManager();
  readonly mentions = new MentionManager();
  readonly anchors = new AnchorManager();

  private currentUser: string = 'Anonymous';

  setCurrentUser(username: string): void {
    this.currentUser = username;
  }

  // ─── High-Level APIs ──────────────────────────────────────────────────────

  addComment(targetObjectId: string, content: string, anchorType: AnchorType = 'paragraph', rangeStart?: number, rangeEnd?: number): Thread {
    const anchor = this.anchors.createAnchor(targetObjectId, anchorType, rangeStart, rangeEnd);
    const mentionsList = this.mentions.extractMentions(content);
    
    const thread = this.threads.createThread(anchor, content, this.currentUser, mentionsList);
    
    this.mentions.notifyMentions(mentionsList, thread.threadId, this.currentUser);
    
    return thread;
  }

  replyToThread(threadId: string, content: string): Comment | null {
    const mentionsList = this.mentions.extractMentions(content);
    const reply = this.threads.addReply(threadId, content, this.currentUser, mentionsList);
    
    if (reply) {
      this.mentions.notifyMentions(mentionsList, threadId, this.currentUser);
    }
    
    return reply;
  }

  // ─── Status Management ────────────────────────────────────────────────────

  resolveThread(threadId: string): boolean {
    return this.threads.resolveThread(threadId);
  }

  reopenThread(threadId: string): boolean {
    const thread = this.threads.getThread(threadId);
    if (!thread || (thread.status !== 'resolved' && thread.status !== 'archived')) return false;
    thread.status = 'reopened';
    thread.updatedAt = Date.now();
    return true;
  }

  archiveThread(threadId: string): boolean {
    const thread = this.threads.getThread(threadId);
    if (!thread) return false;
    thread.status = 'archived';
    thread.updatedAt = Date.now();
    return true;
  }

  // ─── Queries & Navigation ─────────────────────────────────────────────────

  getThreadsForObject(targetObjectId: string): Thread[] {
    return this.threads.getAllThreads().filter(t => t.anchor.targetObjectId === targetObjectId);
  }

  filterThreads(criteria: FilterCriteria): Thread[] {
    return CommentFilter.filterThreads(this.threads.getAllThreads(), criteria);
  }

  getNextThread(currentThreadId: string): Thread | undefined {
    return CommentNavigator.getNextThread(this.threads.getAllThreads(), currentThreadId);
  }

  getPreviousThread(currentThreadId: string): Thread | undefined {
    return CommentNavigator.getPreviousThread(this.threads.getAllThreads(), currentThreadId);
  }
}
