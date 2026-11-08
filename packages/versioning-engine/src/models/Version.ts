// ─────────────────────────────────────────────────────────────────────────────
// Versioning Engine — Core Data Models
// Ref: VERSIONING_ENGINE.md §6, §7, §8
// ─────────────────────────────────────────────────────────────────────────────

// ─── Version Type ─────────────────────────────────────────────────────────────

export type VersionType =
  | 'auto'       // System-generated checkpoint
  | 'manual'     // User explicitly saved version
  | 'named'      // User gave a label/name
  | 'published'  // Marked as official/published
  | 'shared'     // Shared with collaborators
  | 'archived';  // Long-term archival

// ─── Audit Info ───────────────────────────────────────────────────────────────

export interface AuditInfo {
  createdBy: string;
  createdAt: number;
  /** IP or device identifier for enterprise audit */
  sourceDevice?: string;
  /** Cloud sync source */
  cloudSource?: string;
  /** Digital signature or checksum */
  checksum?: string;
}

// ─── Document Version ─────────────────────────────────────────────────────────

export interface DocumentVersion {
  versionId: string;
  documentId: string;
  /** ID of the version this was derived from (null = root) */
  parentVersionId: string | null;
  type: VersionType;
  /** Human-readable label e.g. "Final Draft", "v2.1" */
  label?: string;
  /** Short description of what changed */
  changeSummary?: string;
  /** Serialized document snapshot (content) */
  content: string;
  /** Storage location (local path, cloud URI, etc.) */
  storageLocation?: string;
  timestamp: number;
  author: string;
  audit: AuditInfo;
  metadata: {
    appVersion: string;
    sizeBytes: number;
    tags?: string[];
  };
}

// ─── Version Diff ─────────────────────────────────────────────────────────────

export interface VersionDiff {
  fromVersionId: string;
  toVersionId: string;
  additions: number;
  deletions: number;
  modifications: number;
  /** Human-readable summary of diff */
  summary: string;
  timestamp: number;
}

// ─── Merge Result ─────────────────────────────────────────────────────────────

export type MergeStatus = 'success' | 'conflict' | 'failed';

export interface MergeResult {
  status: MergeStatus;
  mergedVersionId?: string;
  conflicts: string[];
  timestamp: number;
}
