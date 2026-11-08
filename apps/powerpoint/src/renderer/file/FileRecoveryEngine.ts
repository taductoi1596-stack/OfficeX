/**
 * FileRecoveryEngine.ts
 *
 * Enterprise Recovery Engine for OfficeX PPT.
 * Handles auto-save checkpoints, crash recovery, and version history.
 */

export interface RecoveryPoint {
  id: string;
  PresentationId: string;
  PresentationName: string;
  content: string;
  timestamp: Date;
  type: 'autosave' | 'manual' | 'crash';
  size: number;
}

export interface VersionEntry {
  id: string;
  PresentationId: string;
  label: string;
  content: string;
  timestamp: Date;
  author: string;
  comment?: string;
  size: number;
}

class FileRecoveryEngineImpl {
  private recoveryPoints: Map<string, RecoveryPoint[]> = new Map();
  private versions: Map<string, VersionEntry[]> = new Map();
  private maxRecoveryPoints = 10;
  private maxVersions = 50;

  // ── Recovery Points ─────────────────────────────────────────────────

  saveRecoveryPoint(PresentationId: string, PresentationName: string, content: string, type: RecoveryPoint['type'] = 'autosave'): RecoveryPoint {
    const point: RecoveryPoint = {
      id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      PresentationId,
      PresentationName,
      content,
      timestamp: new Date(),
      type,
      size: new Blob([content]).size,
    };

    const existing = this.recoveryPoints.get(PresentationId) ?? [];
    const updated = [point, ...existing].slice(0, this.maxRecoveryPoints);
    this.recoveryPoints.set(PresentationId, updated);

    // Persist to localStorage for crash recovery
    try {
      localStorage.setItem(`officex_recovery_${PresentationId}`, JSON.stringify(updated.map(p => ({
        ...p,
        timestamp: p.timestamp.toISOString()
      }))));
    } catch {
      // Storage quota exceeded – silently ignore
    }

    return point;
  }

  getRecoveryPoints(PresentationId: string): RecoveryPoint[] {
    // Try localStorage first (survives page reload)
    try {
      const raw = localStorage.getItem(`officex_recovery_${PresentationId}`);
      if (raw) {
        const parsed = JSON.parse(raw) as any[];
        return parsed.map(p => ({ ...p, timestamp: new Date(p.timestamp) }));
      }
    } catch {}
    return this.recoveryPoints.get(PresentationId) ?? [];
  }

  getAllRecoveryPoints(): RecoveryPoint[] {
    const all: RecoveryPoint[] = [];
    this.recoveryPoints.forEach(points => all.push(...points));
    // Sort newest first
    return all.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  deleteRecoveryPoint(id: string) {
    this.recoveryPoints.forEach((points, docId) => {
      const filtered = points.filter(p => p.id !== id);
      this.recoveryPoints.set(docId, filtered);
    });
  }

  clearRecoveryPoints(PresentationId: string) {
    this.recoveryPoints.delete(PresentationId);
    try { localStorage.removeItem(`officex_recovery_${PresentationId}`); } catch {}
  }

  // ── Version History ─────────────────────────────────────────────────

  createVersion(PresentationId: string, content: string, label?: string, comment?: string): VersionEntry {
    const existing = this.versions.get(PresentationId) ?? [];
    const versionNum = existing.length + 1;
    const version: VersionEntry = {
      id: `ver_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      PresentationId,
      label: label ?? `Version ${versionNum}`,
      content,
      timestamp: new Date(),
      author: 'User',
      comment,
      size: new Blob([content]).size,
    };

    const updated = [version, ...existing].slice(0, this.maxVersions);
    this.versions.set(PresentationId, updated);
    return version;
  }

  getVersions(PresentationId: string): VersionEntry[] {
    return this.versions.get(PresentationId) ?? [];
  }

  getVersion(versionId: string): VersionEntry | null {
    for (const versions of this.versions.values()) {
      const v = versions.find(v => v.id === versionId);
      if (v) return v;
    }
    return null;
  }

  deleteVersion(versionId: string) {
    this.versions.forEach((versions, docId) => {
      this.versions.set(docId, versions.filter(v => v.id !== versionId));
    });
  }

  // ── Crash Detection ─────────────────────────────────────────────────

  markPresentationOpen(PresentationId: string) {
    try {
      localStorage.setItem(`officex_open_${PresentationId}`, Date.now().toString());
    } catch {}
  }

  markPresentationClosed(PresentationId: string) {
    try {
      localStorage.removeItem(`officex_open_${PresentationId}`);
    } catch {}
  }

  getUnrecoveredPresentations(): string[] {
    const openDocs: string[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('officex_open_')) {
          openDocs.push(key.replace('officex_open_', ''));
        }
      }
    } catch {}
    return openDocs;
  }

  hasRecoveryData(PresentationId: string): boolean {
    return this.getRecoveryPoints(PresentationId).length > 0;
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }
}

export const FileRecoveryEngine = new FileRecoveryEngineImpl();
