// ─────────────────────────────────────────────────────────────────────────────
// Event Collector — Receives and buffers audit events from all platform engines
// Ref: AUDIT_ENGINE.md §4, §21
// ─────────────────────────────────────────────────────────────────────────────

import type { AuditRecord } from './models/AuditRecord';

export class EventCollector {
  private queue: AuditRecord[] = [];
  private readonly maxQueueSize = 1000;

  enqueue(record: AuditRecord): void {
    this.queue.push(record);

    // Drop oldest records if queue overflows
    if (this.queue.length > this.maxQueueSize) {
      this.queue.shift();
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Extracts up to `batchSize` records for durable persistence.
   */
  extractBatch(batchSize: number = 100): AuditRecord[] {
    return this.queue.splice(0, batchSize);
  }

  /**
   * Flush all security-critical records immediately (synchronous extraction).
   */
  flushAll(): AuditRecord[] {
    const all = [...this.queue];
    this.queue = [];
    return all;
  }

  clear(): void {
    this.queue = [];
  }
}
