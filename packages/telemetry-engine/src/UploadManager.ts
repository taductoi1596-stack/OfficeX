// ─────────────────────────────────────────────────────────────────────────────
// Upload Manager — Batches and transmits telemetry payloads to Cloud Backend
// Ref: TELEMETRY_ENGINE.md §20, §24
// ─────────────────────────────────────────────────────────────────────────────

import type { TelemetryEvent } from './models/Telemetry';
import type { EventAggregator } from './EventAggregator';

export class UploadManager {
  private aggregator: EventAggregator;
  private uploadTimer: ReturnType<typeof setInterval> | null = null;
  private isUploading = false;
  private endpointUrl = 'https://telemetry.officex.local/api/v1/collect';

  constructor(aggregator: EventAggregator) {
    this.aggregator = aggregator;
  }

  setEndpoint(url: string): void {
    this.endpointUrl = url;
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  startBackgroundUpload(intervalMs: number = 60_000): void {
    if (this.uploadTimer) clearInterval(this.uploadTimer);
    
    this.uploadTimer = setInterval(() => {
      this.triggerUpload().catch(() => { /* Ignore errors in background */ });
    }, intervalMs);
  }

  stopBackgroundUpload(): void {
    if (this.uploadTimer) {
      clearInterval(this.uploadTimer);
      this.uploadTimer = null;
    }
  }

  // ─── Upload Execution ─────────────────────────────────────────────────────

  async triggerUpload(): Promise<void> {
    if (this.isUploading) return;
    if (this.aggregator.getQueueSize() === 0) return;

    this.isUploading = true;

    try {
      const batch = this.aggregator.extractBatch(50);
      
      // Simulate network request
      await this.transmit(batch);
      
      // console.log(`[Telemetry] Uploaded batch of ${batch.length} events.`);
    } catch (err) {
      // Re-queue on failure (real implementation would handle retry limits)
      // console.warn('[Telemetry] Upload failed, events lost in this stub.');
    } finally {
      this.isUploading = false;
    }
  }

  private async transmit(batch: TelemetryEvent[]): Promise<void> {
    // Stub implementation: wait 100ms
    return new Promise((resolve) => setTimeout(resolve, 100));

    /*
    const response = await fetch(this.endpointUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: batch }),
    });

    if (!response.ok) {
      throw new Error(`Telemetry upload failed: ${response.status}`);
    }
    */
  }
}
