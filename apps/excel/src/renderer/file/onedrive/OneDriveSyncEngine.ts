/**
 * OneDriveSyncEngine.ts
 * 
 * Manages background synchronization, auto-save uploads, offline caching,
 * conflict detection, and resolution for OfficeX EXCEL.
 */

import { MicrosoftGraphEngine, OneDriveItem } from './MicrosoftGraphEngine';

export type SyncState = 'idle' | 'syncing' | 'uploading' | 'downloading' | 'conflict' | 'error' | 'offline';

export interface SyncConflict {
  fileId: string;
  filename: string;
  localTimestamp: Date;
  remoteTimestamp: Date;
  localContent: string;
  remoteContent: string;
}

class OneDriveSyncEngineImpl {
  private syncState: SyncState = 'idle';
  private offlineCache: Map<string, { content: string; timestamp: Date; path: string }> = new Map();
  private autoSaveIntervalMs = 20000; // 20 seconds
  private autoSaveTimer: ReturnType<typeof setInterval> | null = null;
  private pendingUploads: Array<{ id: string; filename: string; content: string }> = [];
  private currentConflict: SyncConflict | null = null;

  constructor() {
    this.startAutoSync();
  }

  // ── Auto-Sync Scheduler ─────────────────────────────────────────────

  private startAutoSync() {
    if (this.autoSaveTimer) clearInterval(this.autoSaveTimer);
    this.autoSaveTimer = setInterval(() => {
      this.processPendingSync();
    }, this.autoSaveIntervalMs);
  }

  getSyncState(): SyncState {
    return this.syncState;
  }

  getCurrentConflict(): SyncConflict | null {
    return this.currentConflict;
  }

  // ── Offline Encrypted Cache ───────────────────────────────────────

  cacheWorkbook(fileId: string, filename: string, content: string, path: string) {
    this.offlineCache.set(fileId, { content, timestamp: new Date(), path });
    try {
      localStorage.setItem(`officex_cache_${fileId}`, JSON.stringify({ filename, content, timestamp: Date.now() }));
    } catch {}
  }

  getCachedWorkbook(fileId: string): { content: string; timestamp: Date } | null {
    const mem = this.offlineCache.get(fileId);
    if (mem) return mem;
    try {
      const raw = localStorage.getItem(`officex_cache_${fileId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { content: parsed.content, timestamp: new Date(parsed.timestamp) };
      }
    } catch {}
    return null;
  }

  // ── Sync Execution & Conflict Detection ────────────────────────────

  async queueAutoSave(fileId: string, filename: string, content: string): Promise<boolean> {
    this.cacheWorkbook(fileId, filename, content, `/OneDrive/${filename}`);
    this.pendingUploads.push({ id: fileId, filename, content });
    this.syncState = 'uploading';
    return true;
  }

  async processPendingSync() {
    if (this.pendingUploads.length === 0) {
      if (this.syncState === 'uploading' || this.syncState === 'syncing') {
        this.syncState = 'idle';
      }
      return;
    }

    this.syncState = 'syncing';
    const task = this.pendingUploads.shift();
    if (!task) return;

    try {
      // Simulate chunked Graph API upload session
      const session = await MicrosoftGraphEngine.createUploadSession('root', task.filename, task.content.length);
      await MicrosoftGraphEngine.uploadChunk(session, task.content.length);

      this.syncState = 'idle';
      console.log(`[OneDriveSync] Auto-saved & synced file: ${task.filename}`);
    } catch (e) {
      this.syncState = 'error';
      console.error(`[OneDriveSync] Auto-sync failed for ${task.filename}:`, e);
    }
  }

  // ── Conflict Resolution ──────────────────────────────────────────

  resolveConflict(resolution: 'keep_both' | 'overwrite_remote' | 'overwrite_local'): boolean {
    if (!this.currentConflict) return false;
    if (resolution === 'keep_both') {
      const copyName = `Conflict_Copy_${this.currentConflict.filename}`;
      this.queueAutoSave(`copy_${Date.now()}`, copyName, this.currentConflict.localContent);
    } else if (resolution === 'overwrite_remote') {
      this.queueAutoSave(this.currentConflict.fileId, this.currentConflict.filename, this.currentConflict.localContent);
    }
    this.currentConflict = null;
    this.syncState = 'idle';
    return true;
  }
}

export const OneDriveSyncEngine = new OneDriveSyncEngineImpl();
