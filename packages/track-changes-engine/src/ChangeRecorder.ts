// ─────────────────────────────────────────────────────────────────────────────
// Change Recorder — Records document edits as revisions
// Ref: TRACK_CHANGES_ENGINE.md §7, §8, §9, §10
// ─────────────────────────────────────────────────────────────────────────────

import type { Revision } from './models/Revision';

function generateId(): string {
  return `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export class ChangeRecorder {
  private revisions = new Map<string, Revision>();
  private currentAuthor: string = 'Anonymous';

  setAuthor(author: string): void {
    this.currentAuthor = author;
  }

  // ─── Recording APIs ───────────────────────────────────────────────────────

  recordInsertion(targetObjectId: string, content: any): Revision {
    return this.createRevision('insert', targetObjectId, undefined, content);
  }

  recordDeletion(targetObjectId: string, content: any): Revision {
    return this.createRevision('delete', targetObjectId, content, undefined);
  }

  recordFormattingChange(targetObjectId: string, oldFormat: any, newFormat: any): Revision {
    return this.createRevision('format', targetObjectId, oldFormat, newFormat);
  }

  recordMove(sourceObjectId: string, targetObjectId: string, content: any): [Revision, Revision] {
    const delRev = this.createRevision('delete', sourceObjectId, content, undefined);
    const insRev = this.createRevision('insert', targetObjectId, undefined, content);
    
    // Link them together
    delRev.dependencies.push(`move-target:${insRev.revisionId}`);
    insRev.dependencies.push(`move-source:${delRev.revisionId}`);
    
    return [delRev, insRev];
  }

  // ─── Store Access ─────────────────────────────────────────────────────────

  getRevisions(): Revision[] {
    return Array.from(this.revisions.values());
  }

  getRevision(id: string): Revision | undefined {
    return this.revisions.get(id);
  }

  // ─── Private Helper ───────────────────────────────────────────────────────

  private createRevision(
    type: Revision['revisionType'],
    targetObjectId: string,
    previousState?: any,
    currentState?: any
  ): Revision {
    const rev: Revision = {
      revisionId: generateId(),
      revisionType: type,
      author: this.currentAuthor,
      timestamp: Date.now(),
      targetObjectId,
      previousState,
      currentState,
      status: 'pending',
      dependencies: [],
      metadata: {},
    };
    this.revisions.set(rev.revisionId, rev);
    return rev;
  }
}
