// ─────────────────────────────────────────────────────────────────────────────
// Privacy Manager — Enforces consent, filtering, and anonymization
// Ref: TELEMETRY_ENGINE.md §17, §26
// ─────────────────────────────────────────────────────────────────────────────

import type { ConsentConfig, TelemetryEvent } from './models/Telemetry';

export class PrivacyManager {
  private consent: ConsentConfig;

  constructor(initialConsent?: ConsentConfig) {
    this.consent = initialConsent ?? {
      telemetryEnabled: false,
      allowCrashReports: false,
      allowPerformanceMetrics: false,
      allowFeatureUsage: false,
      allowAiUsage: false,
    };
  }

  // ─── Configuration ────────────────────────────────────────────────────────

  updateConsent(config: Partial<ConsentConfig>): void {
    this.consent = { ...this.consent, ...config };
  }

  getConsent(): ConsentConfig {
    return { ...this.consent };
  }

  // ─── Event Filtering ──────────────────────────────────────────────────────

  /**
   * Evaluates whether an event should be recorded based on current consent.
   */
  shouldAllow(event: TelemetryEvent): boolean {
    if (!this.consent.telemetryEnabled) return false;

    switch (event.category) {
      case 'crash':
        return this.consent.allowCrashReports;
      case 'performance':
      case 'startup':
      case 'memory':
        return this.consent.allowPerformanceMetrics;
      case 'usage':
      case 'command':
      case 'plugin':
      case 'export':
        return this.consent.allowFeatureUsage;
      case 'ai':
        return this.consent.allowAiUsage;
      default:
        return false;
    }
  }

  /**
   * Sanitizes the event by removing explicitly PII-associated fields,
   * depending on enterprise strictness.
   */
  anonymize(event: TelemetryEvent): TelemetryEvent {
    // Deep clone to avoid mutating original
    const sanitized: TelemetryEvent = JSON.parse(JSON.stringify(event));

    // Remove file paths, user names, or doc content if accidentally included
    if (sanitized.metadata) {
      delete sanitized.metadata['filePath'];
      delete sanitized.metadata['userName'];
      delete sanitized.metadata['documentTitle'];
      delete sanitized.metadata['content'];
    }

    return sanitized;
  }
}
