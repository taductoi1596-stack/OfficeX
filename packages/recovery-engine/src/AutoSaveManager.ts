// ─────────────────────────────────────────────────────────────────────────────
// Auto Save Manager — periodic / incremental background saves
// Ref: RECOVERY_ENGINE.md §7
// ─────────────────────────────────────────────────────────────────────────────

import type { AutoSaveMode } from './models/Recovery';

export interface AutoSaveOptions {
  mode: AutoSaveMode;
  /** Interval in ms for 'periodic' mode (default 3 min) */
  intervalMs?: number;
  /** Throttle in ms for 'incremental' mode (default 5 s) */
  throttleMs?: number;
}

type ContentProvider = () => string;
type SaveCallback = (documentId: string, content: string) => void | Promise<void>;

export class AutoSaveManager {
  private timers: Map<string, ReturnType<typeof setInterval>> = new Map();
  private lastContent: Map<string, string> = new Map();
  private saveCallback: SaveCallback;

  constructor(saveCallback: SaveCallback) {
    this.saveCallback = saveCallback;
  }

  // ─── Register ─────────────────────────────────────────────────────────────

  register(
    documentId: string,
    getContent: ContentProvider,
    opts: AutoSaveOptions = { mode: 'periodic', intervalMs: 180_000 }
  ): void {
    this.unregister(documentId);

    const interval = opts.mode === 'incremental'
      ? (opts.throttleMs ?? 5_000)
      : (opts.intervalMs ?? 180_000);

    const timer = setInterval(async () => {
      try {
        const content = getContent();
        const prev = this.lastContent.get(documentId);

        // Skip if unchanged (incremental mode)
        if (opts.mode === 'incremental' && prev === content) return;

        this.lastContent.set(documentId, content);
        await this.saveCallback(documentId, content);
      } catch (err) {
        console.warn(`[AutoSave] Failed for ${documentId}:`, err);
      }
    }, interval);

    this.timers.set(documentId, timer);
  }

  // ─── Trigger manual save ──────────────────────────────────────────────────

  async triggerNow(documentId: string, getContent: ContentProvider): Promise<void> {
    const content = getContent();
    this.lastContent.set(documentId, content);
    await this.saveCallback(documentId, content);
  }

  // ─── Unregister ───────────────────────────────────────────────────────────

  unregister(documentId: string): void {
    const timer = this.timers.get(documentId);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(documentId);
    }
    this.lastContent.delete(documentId);
  }

  getTrackedDocuments(): string[] {
    return [...this.timers.keys()];
  }

  dispose(): void {
    for (const [id] of this.timers) {
      this.unregister(id);
    }
  }
}
