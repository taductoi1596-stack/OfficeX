// ─────────────────────────────────────────────────────────────────────────────
// Error Tracker — collects runtime errors and exceptions
// Ref: DIAGNOSTICS_ENGINE.md §7, §8
// ─────────────────────────────────────────────────────────────────────────────

import type { DiagnosticRecord, Severity, DiagnosticComponent, DiagnosticEnvironment } from './models/Diagnostic';

function generateId(): string {
  return `diag-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export class ErrorTracker {
  private records: DiagnosticRecord[] = [];
  private envProvider: () => DiagnosticEnvironment;

  constructor(envProvider: () => DiagnosticEnvironment) {
    this.envProvider = envProvider;
  }

  // ─── Tracking ─────────────────────────────────────────────────────────────

  trackError(
    message: string,
    component: DiagnosticComponent,
    error?: Error,
    metadata?: Record<string, any>
  ): DiagnosticRecord {
    return this._record('error', component, 'runtime_error', message, error, metadata);
  }

  trackException(
    error: Error,
    component: DiagnosticComponent = 'unknown',
    metadata?: Record<string, any>
  ): DiagnosticRecord {
    return this._record('fatal', component, 'unhandled_exception', error.message, error, metadata);
  }

  trackWarning(
    message: string,
    component: DiagnosticComponent,
    metadata?: Record<string, any>
  ): DiagnosticRecord {
    return this._record('warning', component, 'warning', message, undefined, metadata);
  }

  // ─── Querying ─────────────────────────────────────────────────────────────

  getRecords(severity?: Severity): DiagnosticRecord[] {
    if (severity) {
      return this.records.filter((r) => r.severity === severity);
    }
    return [...this.records];
  }

  clear(): void {
    this.records = [];
  }

  // ─── Internal ─────────────────────────────────────────────────────────────

  private _record(
    severity: Severity,
    component: DiagnosticComponent,
    event: string,
    message: string,
    error?: Error,
    metadata?: Record<string, any>
  ): DiagnosticRecord {
    const record: DiagnosticRecord = {
      recordId: generateId(),
      timestamp: Date.now(),
      severity,
      component,
      event,
      message,
      stackTrace: error?.stack,
      environment: this.envProvider(),
      metadata,
      resolved: false,
    };
    this.records.push(record);
    
    // Limit to 1000 records
    if (this.records.length > 1000) {
      this.records.shift();
    }
    
    return record;
  }
}
