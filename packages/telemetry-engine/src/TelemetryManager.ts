// ─────────────────────────────────────────────────────────────────────────────
// Telemetry Manager — Central orchestrator for the Telemetry Engine
// Ref: TELEMETRY_ENGINE.md §4, §5
// ─────────────────────────────────────────────────────────────────────────────

import type { ConsentConfig, EventCategory, PrivacyLevel, TelemetryEvent } from './models/Telemetry';
import { PrivacyManager } from './PrivacyManager';
import { EventAggregator } from './EventAggregator';
import { UploadManager } from './UploadManager';

function generateId(): string {
  return `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// Fixed anonymous ID for the session/installation
const ANONYMOUS_ID = `anon-${Math.random().toString(36).slice(2, 10)}`;

export class TelemetryManager {
  readonly privacy: PrivacyManager;
  readonly aggregator: EventAggregator;
  readonly uploader: UploadManager;

  constructor(initialConsent?: ConsentConfig) {
    this.privacy = new PrivacyManager(initialConsent);
    this.aggregator = new EventAggregator();
    this.uploader = new UploadManager(this.aggregator);
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  start(uploadIntervalMs: number = 60_000): void {
    this.uploader.startBackgroundUpload(uploadIntervalMs);
  }

  stop(): void {
    this.uploader.stopBackgroundUpload();
  }

  // ─── Event Tracking ───────────────────────────────────────────────────────

  trackEvent(
    category: EventCategory,
    component: string,
    metrics: Record<string, number | string | boolean>,
    metadata?: Record<string, any>,
    privacyLevel: PrivacyLevel = 'internal'
  ): void {
    const rawEvent: TelemetryEvent = {
      eventId: generateId(),
      timestamp: Date.now(),
      category,
      component,
      metrics,
      anonymousId: ANONYMOUS_ID,
      metadata,
      privacyLevel,
    };

    // 1. Check if user/enterprise consent allows this event type
    if (!this.privacy.shouldAllow(rawEvent)) return;

    // 2. Anonymize/filter PII
    const safeEvent = this.privacy.anonymize(rawEvent);

    // 3. Queue for upload
    this.aggregator.push(safeEvent);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  trackStartupTime(durationMs: number): void {
    this.trackEvent('startup', 'core', { durationMs }, {}, 'public');
  }

  trackCrash(engineName: string, errorType: string): void {
    this.trackEvent('crash', engineName, { crashed: true }, { errorType }, 'public');
  }

  trackFeatureUsage(featureName: string): void {
    this.trackEvent('usage', 'feature', { activated: true }, { featureName }, 'internal');
  }

  // ─── Reporting (for local debug/inspection) ───────────────────────────────

  getQueuedEventsCount(): number {
    return this.aggregator.getQueueSize();
  }

  async forceUploadNow(): Promise<void> {
    await this.uploader.triggerUpload();
  }
}
