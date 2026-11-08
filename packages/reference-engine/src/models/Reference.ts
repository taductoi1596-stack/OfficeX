// ─────────────────────────────────────────────────────────────────────────────
// Reference Engine — Core Data Models
// Ref: REFERENCE_ENGINE.md §6
// ─────────────────────────────────────────────────────────────────────────────

export type ReferenceType =
  | 'toc'
  | 'caption'
  | 'citation'
  | 'bibliography'
  | 'cross-reference'
  | 'footnote'
  | 'endnote'
  | 'index';

export type ReferenceStatus = 'valid' | 'broken' | 'stale' | 'unresolved';

export interface Reference {
  referenceId: string;
  referenceType: ReferenceType;
  /** The source object making the reference (e.g. paragraph ID of a cross-ref) */
  sourceObjectId: string;
  /** The target object being referenced (e.g. heading ID, bookmark name) */
  targetObjectId?: string;
  displayFormat: string;
  status: ReferenceStatus;
  dependencies: string[]; // e.g. ['bookmark:heading1', 'pagination']
  metadata: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}
