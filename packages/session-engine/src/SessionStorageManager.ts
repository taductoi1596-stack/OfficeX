// ─────────────────────────────────────────────────────────────────────────────
// Session Storage Manager — serialise / hydrate session to persistent storage
// Ref: SESSION_ENGINE.md §19, §23
// ─────────────────────────────────────────────────────────────────────────────

import type { Session } from './models/Session';

export type StorageBackend = 'localStorage' | 'memory';

export class SessionStorageManager {
  private readonly STORAGE_KEY = 'officex:session';
  private backend: StorageBackend;
  private memStore: Record<string, string> = {};

  constructor(backend: StorageBackend = 'memory') {
    this.backend = backend;
  }

  // ─── Write ────────────────────────────────────────────────────────────────

  save(session: Session): void {
    try {
      const payload = JSON.stringify({ ...session, savedAt: Date.now() });
      if (this.backend === 'localStorage' && typeof localStorage !== 'undefined') {
        localStorage.setItem(this.STORAGE_KEY, payload);
      } else {
        this.memStore[this.STORAGE_KEY] = payload;
      }
    } catch (err) {
      console.warn('[SessionStorage] Failed to save session:', err);
    }
  }

  // ─── Read ─────────────────────────────────────────────────────────────────

  load(): Session | null {
    try {
      let raw: string | null = null;
      if (this.backend === 'localStorage' && typeof localStorage !== 'undefined') {
        raw = localStorage.getItem(this.STORAGE_KEY);
      } else {
        raw = this.memStore[this.STORAGE_KEY] ?? null;
      }

      if (!raw) return null;

      const parsed = JSON.parse(raw) as Session;
      // Basic validation
      if (!parsed.sessionId || !parsed.openDocuments) return null;
      return parsed;
    } catch (err) {
      console.warn('[SessionStorage] Failed to load session:', err);
      return null;
    }
  }

  // ─── Clear ────────────────────────────────────────────────────────────────

  clear(): void {
    if (this.backend === 'localStorage' && typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    } else {
      delete this.memStore[this.STORAGE_KEY];
    }
  }

  hasSession(): boolean {
    return this.load() !== null;
  }
}
