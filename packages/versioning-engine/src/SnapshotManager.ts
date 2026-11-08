// ─────────────────────────────────────────────────────────────────────────────
// Snapshot Manager — creates and restores document snapshots
// Ref: VERSIONING_ENGINE.md §5
// ─────────────────────────────────────────────────────────────────────────────

import type { DocumentVersion, VersionType, AuditInfo } from './models/Version';

function generateId(): string {
  return `ver-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export class SnapshotManager {
  /** In-memory version store keyed by documentId → sorted versions */
  private store: Map<string, DocumentVersion[]> = new Map();

  // ─── Create ───────────────────────────────────────────────────────────────

  create(
    documentId: string,
    content: string,
    opts: {
      type?: VersionType;
      author?: string;
      label?: string;
      changeSummary?: string;
      tags?: string[];
    } = {}
  ): DocumentVersion {
    const versions = this.store.get(documentId) ?? [];
    const parent = versions.at(-1) ?? null;

    const audit: AuditInfo = {
      createdBy: opts.author ?? 'unknown',
      createdAt: Date.now(),
      checksum: this._checksum(content),
    };

    const version: DocumentVersion = {
      versionId: generateId(),
      documentId,
      parentVersionId: parent?.versionId ?? null,
      type: opts.type ?? 'auto',
      label: opts.label,
      changeSummary: opts.changeSummary,
      content,
      timestamp: Date.now(),
      author: opts.author ?? 'unknown',
      audit,
      metadata: {
        appVersion: '1.0.0',
        sizeBytes: new TextEncoder().encode(content).length,
        tags: opts.tags,
      },
    };

    versions.push(version);
    this.store.set(documentId, versions);

    return version;
  }

  // ─── Restore ──────────────────────────────────────────────────────────────

  restore(versionId: string): DocumentVersion | null {
    for (const versions of this.store.values()) {
      const found = versions.find((v) => v.versionId === versionId);
      if (found) return found;
    }
    return null;
  }

  // ─── Query ────────────────────────────────────────────────────────────────

  getHistory(documentId: string): DocumentVersion[] {
    return [...(this.store.get(documentId) ?? [])].reverse(); // newest first
  }

  getLatest(documentId: string): DocumentVersion | null {
    const versions = this.store.get(documentId) ?? [];
    return versions.at(-1) ?? null;
  }

  getById(versionId: string): DocumentVersion | null {
    return this.restore(versionId);
  }

  // ─── Prune ────────────────────────────────────────────────────────────────

  pruneAuto(documentId: string, keepCount: number): number {
    const versions = this.store.get(documentId) ?? [];
    const autoVersions = versions.filter((v) => v.type === 'auto');
    const toDelete = autoVersions.slice(0, Math.max(0, autoVersions.length - keepCount));

    const deleteIds = new Set(toDelete.map((v) => v.versionId));
    const pruned = versions.filter((v) => !deleteIds.has(v.versionId));
    this.store.set(documentId, pruned);

    return toDelete.length;
  }

  clear(documentId: string): void {
    this.store.delete(documentId);
  }

  // ─── Internals ────────────────────────────────────────────────────────────

  private _checksum(content: string): string {
    // Simple length-based checksum (real impl would use SHA-256)
    return `ck-${content.length}-${content.charCodeAt(0) ?? 0}`;
  }
}
