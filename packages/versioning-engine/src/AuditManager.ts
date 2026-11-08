// ─────────────────────────────────────────────────────────────────────────────
// Audit Manager — tracks all versioning operations for enterprise compliance
// Ref: VERSIONING_ENGINE.md §5
// ─────────────────────────────────────────────────────────────────────────────

export type AuditAction =
  | 'version:created'
  | 'version:restored'
  | 'version:deleted'
  | 'version:labeled'
  | 'version:compared'
  | 'version:published'
  | 'version:archived';

export interface AuditEntry {
  entryId: string;
  action: AuditAction;
  versionId?: string;
  documentId: string;
  actor: string;
  timestamp: number;
  detail?: string;
}

export class AuditManager {
  private log: AuditEntry[] = [];

  record(
    action: AuditAction,
    documentId: string,
    actor: string,
    opts: { versionId?: string; detail?: string } = {}
  ): AuditEntry {
    const entry: AuditEntry = {
      entryId: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      action,
      documentId,
      actor,
      timestamp: Date.now(),
      ...opts,
    };
    this.log.push(entry);
    return entry;
  }

  getLog(documentId?: string): AuditEntry[] {
    if (documentId) {
      return this.log.filter((e) => e.documentId === documentId);
    }
    return [...this.log];
  }

  getByAction(action: AuditAction): AuditEntry[] {
    return this.log.filter((e) => e.action === action);
  }

  clear(documentId?: string): void {
    if (documentId) {
      this.log = this.log.filter((e) => e.documentId !== documentId);
    } else {
      this.log = [];
    }
  }

  exportLog(): AuditEntry[] {
    return this.getLog();
  }
}
