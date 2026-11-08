// ─────────────────────────────────────────────────────────────────────────────
// Journal Manager — maintains incremental edit deltas for document replay
// Ref: RECOVERY_ENGINE.md §11
// ─────────────────────────────────────────────────────────────────────────────

import type { JournalEntry } from './models/Recovery';

function generateId(): string {
  return `jrn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export class JournalManager {
  private journals: Map<string, JournalEntry[]> = new Map();
  private sequences: Map<string, number> = new Map();
  /** Maximum journal entries per document before compaction */
  private readonly MAX_ENTRIES = 1000;

  // ─── Append ───────────────────────────────────────────────────────────────

  append(documentId: string, delta: string): JournalEntry {
    const entries = this.journals.get(documentId) ?? [];
    const sequence = (this.sequences.get(documentId) ?? 0) + 1;

    const entry: JournalEntry = {
      entryId: generateId(),
      documentId,
      delta,
      timestamp: Date.now(),
      sequence,
    };

    entries.push(entry);
    this.journals.set(documentId, entries);
    this.sequences.set(documentId, sequence);

    // Auto-compact when too large
    if (entries.length > this.MAX_ENTRIES) {
      this.compact(documentId, Math.floor(this.MAX_ENTRIES / 2));
    }

    return entry;
  }

  // ─── Query ────────────────────────────────────────────────────────────────

  getEntries(documentId: string, fromSequence = 0): JournalEntry[] {
    const entries = this.journals.get(documentId) ?? [];
    return entries.filter((e) => e.sequence > fromSequence);
  }

  getLatestSequence(documentId: string): number {
    return this.sequences.get(documentId) ?? 0;
  }

  // ─── Compact ──────────────────────────────────────────────────────────────

  /**
   * Drop old journal entries, keeping only the newest `keepCount`.
   * Called automatically when the journal exceeds MAX_ENTRIES.
   */
  compact(documentId: string, keepCount: number): number {
    const entries = this.journals.get(documentId) ?? [];
    const removed = Math.max(0, entries.length - keepCount);
    this.journals.set(documentId, entries.slice(-keepCount));
    return removed;
  }

  // ─── Clear ────────────────────────────────────────────────────────────────

  clear(documentId: string): void {
    this.journals.delete(documentId);
    this.sequences.delete(documentId);
  }

  hasJournal(documentId: string): boolean {
    return (this.journals.get(documentId)?.length ?? 0) > 0;
  }
}
