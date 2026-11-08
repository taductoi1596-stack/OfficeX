// ─────────────────────────────────────────────────────────────────────────────
// Track Changes Manager — Extended central orchestrator
// Ref: TRACK_CHANGES_ENGINE.md §4, §5 + TRACK_CHANGES.md §6, §7
// ─────────────────────────────────────────────────────────────────────────────

import { ChangeRecorder } from './ChangeRecorder';
import { ReviewManager } from './ReviewManager';
import { CompareEngine } from './CompareEngine';
import { DisplayModeManager } from './DisplayModeManager';
import type { Revision, RevisionType } from './models/Revision';

export interface RevisionSummary {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  byAuthor: Record<string, number>;
  byType: Record<RevisionType, number>;
}

export class TrackChangesManager {
  readonly recorder = new ChangeRecorder();
  readonly review = new ReviewManager(this.recorder);
  readonly compare = new CompareEngine(this.recorder);
  readonly displayMode = new DisplayModeManager();

  private enabled = false;

  enable(): void {
    this.enabled = true;
  }

  disable(): void {
    this.enabled = false;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setCurrentUser(username: string): void {
    this.recorder.setAuthor(username);
  }

  // ─── Convenience Wrappers ─────────────────────────────────────────────────

  trackInsertion(targetObjectId: string, content: any): Revision | null {
    if (!this.enabled) return null;
    return this.recorder.recordInsertion(targetObjectId, content);
  }

  trackDeletion(targetObjectId: string, content: any): Revision | null {
    if (!this.enabled) return null;
    return this.recorder.recordDeletion(targetObjectId, content);
  }

  trackFormatting(targetObjectId: string, oldFormat: any, newFormat: any): Revision | null {
    if (!this.enabled) return null;
    return this.recorder.recordFormattingChange(targetObjectId, oldFormat, newFormat);
  }

  trackMove(sourceId: string, destinationId: string, content: any): Revision | null {
    if (!this.enabled) return null;
    return this.recorder.recordInsertion(destinationId, {
      ...content,
      revisionType: 'move-destination',
      sourceId
    });
  }

  // ─── Summary ──────────────────────────────────────────────────────────────

  getRevisionSummary(): RevisionSummary {
    const revisions = this.recorder.getRevisions();
    const byAuthor: Record<string, number> = {};
    const byType: Partial<Record<RevisionType, number>> = {};

    for (const rev of revisions) {
      byAuthor[rev.author] = (byAuthor[rev.author] || 0) + 1;
      byType[rev.revisionType] = (byType[rev.revisionType] || 0) + 1;
    }

    return {
      total: revisions.length,
      pending: revisions.filter(r => r.status === 'pending').length,
      accepted: revisions.filter(r => r.status === 'accepted').length,
      rejected: revisions.filter(r => r.status === 'rejected').length,
      byAuthor,
      byType: byType as Record<RevisionType, number>,
    };
  }
}
