// @officex/diagnostics-engine — Public API
export type {
  DiagnosticRecord,
  Severity,
  DiagnosticComponent,
  DiagnosticEnvironment,
  PerformanceWarning,
  HealthStatus,
} from './models/Diagnostic';

export { ErrorTracker } from './ErrorTracker';
export { HealthMonitor } from './HealthMonitor';
export type { HealthCheckFn } from './HealthMonitor';
export { DiagnosticsManager } from './DiagnosticsManager';
