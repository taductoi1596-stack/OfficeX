// ─────────────────────────────────────────────────────────────────────────────
// Review Manager — Extended accept/reject workflow
// Ref: TRACK_CHANGES_ENGINE.md §11, §12 + TRACK_CHANGES.md §7
// ─────────────────────────────────────────────────────────────────────────────

import type { Revision, RevisionType } from './models/Revision';
import type { ChangeRecorder } from './ChangeRecorder';

export class ReviewManager {
  constructor(private recorder: ChangeRecorder) {}

  accept(revisionId: string): boolean {
    const rev = this.recorder.getRevision(revisionId);
    if (!rev || rev.status !== 'pending') return false;
    rev.status = 'accepted';
    return true;
  }

  reject(revisionId: string): boolean {
    const rev = this.recorder.getRevision(revisionId);
    if (!rev || rev.status !== 'pending') return false;
    rev.status = 'rejected';
    return true;
  }

  acceptAll(): void {
    this.recorder.getRevisions().forEach(rev => {
      if (rev.status === 'pending') rev.status = 'accepted';
    });
  }

  rejectAll(): void {
    this.recorder.getRevisions().forEach(rev => {
      if (rev.status === 'pending') rev.status = 'rejected';
    });
  }

  // ─── By Author ─────────────────────────────────────────────────────────────

  acceptByAuthor(author: string): void {
    this.recorder.getRevisions().forEach(rev => {
      if (rev.status === 'pending' && rev.author === author) rev.status = 'accepted';
    });
  }

  rejectByAuthor(author: string): void {
    this.recorder.getRevisions().forEach(rev => {
      if (rev.status === 'pending' && rev.author === author) rev.status = 'rejected';
    });
  }

  // ─── By Type ───────────────────────────────────────────────────────────────

  acceptByType(type: RevisionType): void {
    this.recorder.getRevisions().forEach(rev => {
      if (rev.status === 'pending' && rev.revisionType === type) rev.status = 'accepted';
    });
  }

  rejectByType(type: RevisionType): void {
    this.recorder.getRevisions().forEach(rev => {
      if (rev.status === 'pending' && rev.revisionType === type) rev.status = 'rejected';
    });
  }

  // ─── Navigation Helpers ────────────────────────────────────────────────────

  getPendingRevisions(): Revision[] {
    return this.recorder.getRevisions().filter(r => r.status === 'pending');
  }
}
