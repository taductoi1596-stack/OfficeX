// ─────────────────────────────────────────────────────────────────────────────
// Compare Engine — Simulates comparing two document states
// Ref: TRACK_CHANGES_ENGINE.md §13
// ─────────────────────────────────────────────────────────────────────────────

import type { ChangeRecorder } from './ChangeRecorder';

export class CompareEngine {
  constructor(private recorder: ChangeRecorder) {}

  /**
   * Compares two simple states (e.g. text strings) and records the diff as revisions.
   * This is a simplified mock. A real engine uses Myers diff or similar algorithms.
   */
  compareAndRecord(targetObjectId: string, originalText: string, modifiedText: string): void {
    if (originalText === modifiedText) return;

    // Extremely simplified logic: just record a full replace for demonstration
    this.recorder.recordDeletion(targetObjectId, originalText);
    this.recorder.recordInsertion(targetObjectId, modifiedText);
  }
}
