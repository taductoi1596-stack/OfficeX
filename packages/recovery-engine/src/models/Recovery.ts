// ─────────────────────────────────────────────────────────────────────────────
// Recovery Engine — Core Data Models
// Ref: RECOVERY_ENGINE.md §6, §7-§11
// ─────────────────────────────────────────────────────────────────────────────

// ─── Recovery Status ──────────────────────────────────────────────────────────

export type RecoveryStatus =
  | 'idle'
  | 'saving'
  | 'pending'
  | 'recovering'
  | 'repaired'
  | 'failed'
  | 'completed';

// ─── Auto Save Mode ───────────────────────────────────────────────────────────

export type AutoSaveMode =
  | 'periodic'    // Fixed interval
  | 'incremental' // On document change (throttled)
  | 'manual'      // Triggered explicitly
  | 'cloud';      // Delegated to cloud sync

// ─── Journal Entry ────────────────────────────────────────────────────────────

export interface JournalEntry {
  entryId: string;
  documentId: string;
  /** Serialized incremental change */
  delta: string;
  timestamp: number;
  sequence: number;
}

// ─── Recovery Snapshot ────────────────────────────────────────────────────────

export interface RecoverySnapshot {
  snapshotId: string;
  documentId: string;
  /** Full serialized document content at this checkpoint */
  content: string;
  timestamp: number;
  /** Sequence number of last applied journal entry */
  journalSequence: number;
  metadata: {
    sizeBytes: number;
    appVersion: string;
  };
}

// ─── Recovery Session ─────────────────────────────────────────────────────────

export interface RecoverySession {
  recoveryId: string;
  documentId: string;
  documentTitle: string;
  snapshots: RecoverySnapshot[];
  journal: JournalEntry[];
  status: RecoveryStatus;
  lastSavedAt: number;
  createdAt: number;
  metadata: {
    filePath?: string;
    isCrashRecovery: boolean;
    safeMode: boolean;
  };
}

// ─── Recovery Queue Item ──────────────────────────────────────────────────────

export interface RecoveryQueueItem {
  jobId: string;
  documentId: string;
  priority: 'high' | 'normal' | 'low';
  retries: number;
  maxRetries: number;
  addedAt: number;
  lastAttemptAt?: number;
  error?: string;
}
