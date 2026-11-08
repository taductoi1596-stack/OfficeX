// ─────────────────────────────────────────────────────────────────────────────
// Track Changes Engine — Core Data Models
// Ref: TRACK_CHANGES_ENGINE.md §6 + TRACK_CHANGES.md §3, §4, §5
// ─────────────────────────────────────────────────────────────────────────────

export type RevisionType =
  | 'insert'
  | 'delete'
  | 'format'
  | 'move'
  | 'formatting-change'
  | 'structure-change'
  | 'move-source'
  | 'move-destination';

export type RevisionStatus = 'pending' | 'accepted' | 'rejected';

export type DisplayMode = 'simple-markup' | 'all-markup' | 'no-markup' | 'original';

export interface Revision {
  revisionId: string;
  revisionType: RevisionType;
  author: string;
  timestamp: number;
  sessionId?: string; // Collaborative session ID
  /** ID of the object/range affected by the revision */
  targetObjectId: string;
  /** Value/state before the change */
  previousValue?: any;
  /** Value/state after the change */
  newValue?: any;
  /** @deprecated Use previousValue/newValue — kept for backward compat */
  previousState?: any;
  currentState?: any;
  status: RevisionStatus;
  dependencies: string[]; // E.g., linked move destination
  metadata: Record<string, any>;
}
