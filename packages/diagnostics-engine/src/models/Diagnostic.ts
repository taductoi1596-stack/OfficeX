// ─────────────────────────────────────────────────────────────────────────────
// Diagnostics Engine — Core Data Models
// Ref: DIAGNOSTICS_ENGINE.md §6
// ─────────────────────────────────────────────────────────────────────────────

export type Severity = 'info' | 'warning' | 'error' | 'fatal';
export type DiagnosticComponent =
  | 'core'
  | 'rendering'
  | 'document'
  | 'io'
  | 'plugin'
  | 'ui'
  | 'unknown';

export interface DiagnosticEnvironment {
  os: string;
  appVersion: string;
  memoryUsage: number;
  uptime: number;
  userAgent?: string;
}

export interface DiagnosticRecord {
  recordId: string;
  timestamp: number;
  severity: Severity;
  component: DiagnosticComponent;
  event: string;
  message: string;
  stackTrace?: string;
  environment: DiagnosticEnvironment;
  metadata?: Record<string, any>;
  resolved: boolean;
}

export interface PerformanceWarning {
  warningId: string;
  metric: string;
  threshold: number;
  actual: number;
  timestamp: number;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'failing';
  checks: Record<string, boolean>;
  lastChecked: number;
}
