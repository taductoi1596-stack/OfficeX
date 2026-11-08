// ─────────────────────────────────────────────────────────────────────────────
// Version Manager — Central orchestrator for the Versioning Engine
// Ref: VERSIONING_ENGINE.md §4, §5
// ─────────────────────────────────────────────────────────────────────────────

import type { DocumentVersion, VersionType, VersionDiff, MergeResult } from './models/Version';
import { SnapshotManager } from './SnapshotManager';
import { CompareEngine } from './CompareEngine';
import { AuditManager } from './AuditManager';

export interface CreateVersionOptions {
  type?: VersionType;
  author?: string;
  label?: string;
  changeSummary?: string;
  tags?: string[];
}

export class VersionManager {
  readonly snapshots: SnapshotManager;
  readonly compare: CompareEngine;
  readonly audit: AuditManager;

  /** Auto-version interval in milliseconds (0 = disabled) */
  autoVersionIntervalMs: number = 0;
  private autoTimers: Map<string, ReturnType<typeof setInterval>> = new Map();

  constructor() {
    this.snapshots = new SnapshotManager();
    this.compare = new CompareEngine();
    this.audit = new AuditManager();
  }

  // ─── Version Creation ─────────────────────────────────────────────────────

  createVersion(
    documentId: string,
    content: string,
    opts: CreateVersionOptions = {}
  ): DocumentVersion {
    const version = this.snapshots.create(documentId, content, opts);

    this.audit.record('version:created', documentId, opts.author ?? 'system', {
      versionId: version.versionId,
      detail: opts.label ?? opts.changeSummary ?? 'Auto-saved',
    });

    return version;
  }

  // ─── Auto Versioning ──────────────────────────────────────────────────────

  startAutoVersioning(
    documentId: string,
    getContent: () => string,
    author: string = 'system',
    intervalMs: number = 300_000 // 5 minutes default
  ): void {
    this.stopAutoVersioning(documentId);

    const timer = setInterval(() => {
      const content = getContent();
      const latest = this.snapshots.getLatest(documentId);

      // Only create if content changed
      if (!latest || !this.compare.isIdentical(latest.content, content)) {
        this.createVersion(documentId, content, {
          type: 'auto',
          author,
          changeSummary: 'Auto-saved version',
        });
      }
    }, intervalMs);

    this.autoTimers.set(documentId, timer);
  }

  stopAutoVersioning(documentId: string): void {
    const timer = this.autoTimers.get(documentId);
    if (timer) {
      clearInterval(timer);
      this.autoTimers.delete(documentId);
    }
  }

  // ─── Restore ──────────────────────────────────────────────────────────────

  restoreVersion(versionId: string, actor: string = 'user'): DocumentVersion | null {
    const version = this.snapshots.restore(versionId);

    if (version) {
      this.audit.record('version:restored', version.documentId, actor, {
        versionId,
        detail: `Restored to version "${version.label ?? versionId}"`,
      });
    }

    return version;
  }

  // ─── Labeling ─────────────────────────────────────────────────────────────

  labelVersion(versionId: string, label: string, actor: string = 'user'): boolean {
    const version = this.snapshots.getById(versionId);
    if (!version) return false;

    // Mutate label (versions are logically immutable but labels are metadata)
    (version as any).label = label;

    this.audit.record('version:labeled', version.documentId, actor, {
      versionId,
      detail: `Labeled as "${label}"`,
    });

    return true;
  }

  // ─── Comparison ───────────────────────────────────────────────────────────

  compareVersions(fromVersionId: string, toVersionId: string, actor: string = 'user'): VersionDiff | null {
    const from = this.snapshots.getById(fromVersionId);
    const to = this.snapshots.getById(toVersionId);

    if (!from || !to) return null;

    const diff = this.compare.diff(
      fromVersionId,
      from.content,
      toVersionId,
      to.content
    );

    this.audit.record('version:compared', from.documentId, actor, {
      versionId: fromVersionId,
      detail: `Compared ${fromVersionId} → ${toVersionId}: ${diff.summary}`,
    });

    return diff;
  }

  // ─── Merge (stub — real impl needs 3-way merge algorithm) ─────────────────

  mergeVersions(
    baseVersionId: string,
    incomingVersionId: string,
    _actor: string = 'user'
  ): MergeResult {
    const base = this.snapshots.getById(baseVersionId);
    const incoming = this.snapshots.getById(incomingVersionId);

    if (!base || !incoming) {
      return { status: 'failed', conflicts: ['One or more versions not found'], timestamp: Date.now() };
    }

    // Simple identity merge: if identical no conflict
    if (this.compare.isIdentical(base.content, incoming.content)) {
      return { status: 'success', mergedVersionId: base.versionId, conflicts: [], timestamp: Date.now() };
    }

    // Otherwise flag as conflict (real 3-way merge delegated to Collaboration Engine)
    return {
      status: 'conflict',
      conflicts: ['Content differs — manual resolution required'],
      timestamp: Date.now(),
    };
  }

  // ─── History & Queries ────────────────────────────────────────────────────

  getHistory(documentId: string): DocumentVersion[] {
    return this.snapshots.getHistory(documentId);
  }

  getLatestVersion(documentId: string): DocumentVersion | null {
    return this.snapshots.getLatest(documentId);
  }

  getVersionCount(documentId: string): number {
    return this.snapshots.getHistory(documentId).length;
  }

  // ─── Maintenance ──────────────────────────────────────────────────────────

  pruneAutoVersions(documentId: string, keepCount: number = 20): number {
    return this.snapshots.pruneAuto(documentId, keepCount);
  }

  clearHistory(documentId: string): void {
    this.snapshots.clear(documentId);
    this.audit.clear(documentId);
  }

  dispose(): void {
    for (const [docId] of this.autoTimers) {
      this.stopAutoVersioning(docId);
    }
  }
}
