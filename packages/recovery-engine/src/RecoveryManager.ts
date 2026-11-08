// ─────────────────────────────────────────────────────────────────────────────
// Recovery Manager — Central orchestrator for the Recovery Engine
// Ref: RECOVERY_ENGINE.md §4, §5, §9, §12-§15
// ─────────────────────────────────────────────────────────────────────────────

import type {
  RecoverySession,
  RecoverySnapshot,
  RecoveryQueueItem,
  RecoveryStatus,
} from './models/Recovery';
import { AutoSaveManager } from './AutoSaveManager';
import { JournalManager } from './JournalManager';

function generateId(): string {
  return `rec-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Recovery Manager ─────────────────────────────────────────────────────────

export class RecoveryManager {
  readonly autoSave: AutoSaveManager;
  readonly journal: JournalManager;

  private sessions: Map<string, RecoverySession> = new Map();
  private queue: RecoveryQueueItem[] = [];
  private safeMode: boolean = false;

  constructor() {
    this.journal = new JournalManager();

    // Auto-save callback: create a recovery snapshot
    this.autoSave = new AutoSaveManager(async (documentId, content) => {
      this._createSnapshot(documentId, content);
    });
  }

  // ─── Session Lifecycle ────────────────────────────────────────────────────

  startRecovery(documentId: string, documentTitle: string, filePath?: string): RecoverySession {
    const existing = this.sessions.get(documentId);
    if (existing) return existing;

    const session: RecoverySession = {
      recoveryId: generateId(),
      documentId,
      documentTitle,
      snapshots: [],
      journal: [],
      status: 'idle',
      lastSavedAt: Date.now(),
      createdAt: Date.now(),
      metadata: {
        filePath,
        isCrashRecovery: false,
        safeMode: this.safeMode,
      },
    };

    this.sessions.set(documentId, session);
    return session;
  }

  stopRecovery(documentId: string): void {
    this.autoSave.unregister(documentId);
    this.journal.clear(documentId);
    // Keep session data until explicit cleanup (for post-close recovery)
  }

  cleanupRecovery(documentId: string): void {
    this.sessions.delete(documentId);
    this.journal.clear(documentId);
    this.autoSave.unregister(documentId);
  }

  // ─── Snapshot ─────────────────────────────────────────────────────────────

  private _createSnapshot(documentId: string, content: string): RecoverySnapshot | null {
    const session = this.sessions.get(documentId);
    if (!session) return null;

    const snapshot: RecoverySnapshot = {
      snapshotId: generateId(),
      documentId,
      content,
      timestamp: Date.now(),
      journalSequence: this.journal.getLatestSequence(documentId),
      metadata: {
        sizeBytes: new TextEncoder().encode(content).length,
        appVersion: '1.0.0',
      },
    };

    // Keep last 10 snapshots per document
    session.snapshots = [...session.snapshots, snapshot].slice(-10);
    session.lastSavedAt = Date.now();
    session.status = 'saving';

    return snapshot;
  }

  createManualSnapshot(documentId: string, content: string): RecoverySnapshot | null {
    return this._createSnapshot(documentId, content);
  }

  getLatestSnapshot(documentId: string): RecoverySnapshot | null {
    const session = this.sessions.get(documentId);
    return session?.snapshots.at(-1) ?? null;
  }

  // ─── Crash Recovery ───────────────────────────────────────────────────────

  markCrashRecovery(documentId: string): void {
    const session = this.sessions.get(documentId);
    if (session) {
      session.metadata.isCrashRecovery = true;
      session.status = 'pending';
    }
  }

  getPendingRecoverySessions(): RecoverySession[] {
    return [...this.sessions.values()].filter(
      (s) => s.status === 'pending' || s.metadata.isCrashRecovery
    );
  }

  recoverSession(documentId: string): RecoverySnapshot | null {
    const session = this.sessions.get(documentId);
    if (!session) return null;

    const snapshot = session.snapshots.at(-1) ?? null;
    if (snapshot) {
      session.status = 'recovering';
    }
    return snapshot;
  }

  completeRecovery(documentId: string): void {
    const session = this.sessions.get(documentId);
    if (session) session.status = 'completed';
  }

  // ─── Recovery Queue ───────────────────────────────────────────────────────

  enqueue(documentId: string, priority: RecoveryQueueItem['priority'] = 'normal'): void {
    const existing = this.queue.find((q) => q.jobId === documentId);
    if (existing) return;

    this.queue.push({
      jobId: generateId(),
      documentId,
      priority,
      retries: 0,
      maxRetries: 3,
      addedAt: Date.now(),
    });

    this.queue.sort((a, b) => {
      const order = { high: 0, normal: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });
  }

  dequeue(): RecoveryQueueItem | null {
    return this.queue.shift() ?? null;
  }

  getQueue(): RecoveryQueueItem[] {
    return [...this.queue];
  }

  // ─── Safe Mode ────────────────────────────────────────────────────────────

  enterSafeMode(): void {
    this.safeMode = true;
    console.warn('[RecoveryEngine] Safe Mode activated.');
  }

  exitSafeMode(): void {
    this.safeMode = false;
  }

  isSafeMode(): boolean {
    return this.safeMode;
  }

  // ─── Document Repair (stub) ───────────────────────────────────────────────

  repairDocument(content: string): { repaired: boolean; content: string; issues: string[] } {
    const issues: string[] = [];

    // Minimal repair: detect obviously malformed content
    if (!content || content.trim().length === 0) {
      issues.push('Document content is empty');
      return { repaired: false, content, issues };
    }

    if (content.includes('</') && !content.includes('>')) {
      issues.push('Broken XML: unclosed tags detected');
      // Real impl: delegate to OpenXML repair pipeline
    }

    return {
      repaired: issues.length === 0,
      content,
      issues,
    };
  }

  // ─── Diagnostics ──────────────────────────────────────────────────────────

  getStats(): {
    activeSessions: number;
    pendingRecovery: number;
    queueLength: number;
    safeMode: boolean;
  } {
    return {
      activeSessions: this.sessions.size,
      pendingRecovery: this.getPendingRecoverySessions().length,
      queueLength: this.queue.length,
      safeMode: this.safeMode,
    };
  }

  getAllSessions(): RecoverySession[] {
    return [...this.sessions.values()];
  }

  dispose(): void {
    this.autoSave.dispose();
  }
}
