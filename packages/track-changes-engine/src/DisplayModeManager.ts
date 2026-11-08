// ─────────────────────────────────────────────────────────────────────────────
// Display Mode Manager — Controls which revisions are visible in the UI
// Ref: TRACK_CHANGES.md §6
// ─────────────────────────────────────────────────────────────────────────────

import type { Revision, DisplayMode } from './models/Revision';

export class DisplayModeManager {
  private currentMode: DisplayMode = 'all-markup';

  setMode(mode: DisplayMode): void {
    this.currentMode = mode;
  }

  getMode(): DisplayMode {
    return this.currentMode;
  }

  /**
   * Filters a list of revisions for display based on the current mode.
   *
   * - all-markup:    Show all pending/accepted/rejected revisions with markup
   * - simple-markup: Show only pending revisions (simplest view)
   * - no-markup:     Show nothing (accepted content only, no revision marks)
   * - original:      Show rejected content / original state (no accepted changes)
   */
  filterRevisionsForDisplay(revisions: Revision[]): Revision[] {
    switch (this.currentMode) {
      case 'all-markup':
        return revisions; // show everything

      case 'simple-markup':
        return revisions.filter(r => r.status === 'pending');

      case 'no-markup':
        return []; // hide all markup, render accepted state

      case 'original':
        return revisions.filter(r => r.status === 'rejected'); // show what was removed

      default:
        return revisions;
    }
  }
}
