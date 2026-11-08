// ─────────────────────────────────────────────────────────────────────────────
// Diagnostics Manager — Central orchestrator for the Diagnostics Engine
// Ref: DIAGNOSTICS_ENGINE.md §4, §5, §14
// ─────────────────────────────────────────────────────────────────────────────

import type { DiagnosticEnvironment, DiagnosticRecord, HealthStatus } from './models/Diagnostic';
import { ErrorTracker } from './ErrorTracker';
import { HealthMonitor } from './HealthMonitor';

export class DiagnosticsManager {
  readonly errors: ErrorTracker;
  readonly health: HealthMonitor;

  constructor() {
    const envProvider = (): DiagnosticEnvironment => ({
      os: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
      appVersion: '1.0.0',
      memoryUsage: (typeof performance !== 'undefined' && (performance as any).memory)
        ? (performance as any).memory.usedJSHeapSize
        : 0,
      uptime: typeof performance !== 'undefined' ? performance.now() : 0,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    });

    this.errors = new ErrorTracker(envProvider);
    this.health = new HealthMonitor();

    // Register basic built-in health checks
    this.health.registerCheck('environment_ready', () => true);
    this.health.registerCheck('memory_usage', () => {
      const mem = envProvider().memoryUsage;
      // Fail if using > 2GB (simplistic check)
      return mem < 2 * 1024 * 1024 * 1024;
    });
  }

  // ─── Reporting ────────────────────────────────────────────────────────────

  generateReport(): {
    timestamp: number;
    health: HealthStatus;
    recentErrors: DiagnosticRecord[];
    performanceWarnings: any[];
    environment: DiagnosticEnvironment;
  } {
    return {
      timestamp: Date.now(),
      health: this.health.getLastStatus(),
      recentErrors: this.errors.getRecords('error').slice(-50), // Last 50 errors
      performanceWarnings: this.health.getWarnings().slice(-50),
      environment: {
        os: typeof navigator !== 'undefined' ? navigator.platform : 'unknown',
        appVersion: '1.0.0',
        memoryUsage: 0,
        uptime: typeof performance !== 'undefined' ? performance.now() : 0,
      },
    };
  }
}
