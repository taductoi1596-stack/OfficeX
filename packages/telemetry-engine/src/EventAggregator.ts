// ─────────────────────────────────────────────────────────────────────────────
// Event Aggregator — Buffers and aggregates telemetry events locally
// Ref: TELEMETRY_ENGINE.md §4, §23
// ─────────────────────────────────────────────────────────────────────────────

import type { TelemetryEvent } from './models/Telemetry';

export class EventAggregator {
  private queue: TelemetryEvent[] = [];
  private readonly maxQueueSize = 500;

  // ─── Accumulation ─────────────────────────────────────────────────────────

  push(event: TelemetryEvent): void {
    this.queue.push(event);

    // Evict oldest if queue is full (to prevent memory leaks offline)
    if (this.queue.length > this.maxQueueSize) {
      this.queue.shift();
    }
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  // ─── Batch Retrieval ──────────────────────────────────────────────────────

  /**
   * Extracts up to `batchSize` events from the queue for uploading.
   */
  extractBatch(batchSize: number = 50): TelemetryEvent[] {
    return this.queue.splice(0, batchSize);
  }

  // ─── Persistence (Stub) ───────────────────────────────────────────────────

  /**
   * In a real implementation, this would save the queue to IndexedDB or local disk.
   */
  async persistOffline(): Promise<void> {
    // console.log(`[Telemetry] Persisted ${this.queue.length} events offline.`);
  }

  async loadOffline(): Promise<void> {
    // console.log(`[Telemetry] Loaded offline events.`);
  }

  clear(): void {
    this.queue = [];
  }
}
