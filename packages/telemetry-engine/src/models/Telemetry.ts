// ─────────────────────────────────────────────────────────────────────────────
// Telemetry Engine — Core Data Models
// Ref: TELEMETRY_ENGINE.md §6
// ─────────────────────────────────────────────────────────────────────────────

export type EventCategory =
  | 'usage'
  | 'performance'
  | 'crash'
  | 'startup'
  | 'memory'
  | 'command'
  | 'plugin'
  | 'export'
  | 'ai';

export type PrivacyLevel = 'public' | 'internal' | 'restricted';

export interface TelemetryEvent {
  eventId: string;
  timestamp: number;
  category: EventCategory;
  component: string;
  metrics: Record<string, number | string | boolean>;
  /** Unique anonymous identifier (rotated periodically) */
  anonymousId: string;
  metadata?: Record<string, any>;
  privacyLevel: PrivacyLevel;
}

export interface ConsentConfig {
  telemetryEnabled: boolean;
  allowCrashReports: boolean;
  allowPerformanceMetrics: boolean;
  allowFeatureUsage: boolean;
  allowAiUsage: boolean;
}
