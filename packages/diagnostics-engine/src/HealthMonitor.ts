// ─────────────────────────────────────────────────────────────────────────────
// Health Monitor — executes self tests and monitors performance
// Ref: DIAGNOSTICS_ENGINE.md §10, §11, §16
// ─────────────────────────────────────────────────────────────────────────────

import type { HealthStatus, PerformanceWarning } from './models/Diagnostic';

export type HealthCheckFn = () => boolean | Promise<boolean>;

export class HealthMonitor {
  private checks: Map<string, HealthCheckFn> = new Map();
  private warnings: PerformanceWarning[] = [];
  private lastStatus: HealthStatus = {
    status: 'healthy',
    checks: {},
    lastChecked: 0,
  };

  // ─── Registration ─────────────────────────────────────────────────────────

  registerCheck(name: string, checkFn: HealthCheckFn): void {
    this.checks.set(name, checkFn);
  }

  // ─── Execution ────────────────────────────────────────────────────────────

  async runSelfTest(): Promise<HealthStatus> {
    const results: Record<string, boolean> = {};
    let allPassed = true;
    let anyPassed = false;

    for (const [name, checkFn] of this.checks.entries()) {
      try {
        const passed = await checkFn();
        results[name] = passed;
        if (!passed) allPassed = false;
        else anyPassed = true;
      } catch (err) {
        results[name] = false;
        allPassed = false;
      }
    }

    const status: HealthStatus['status'] = allPassed
      ? 'healthy'
      : anyPassed
        ? 'degraded'
        : 'failing';

    this.lastStatus = {
      status,
      checks: results,
      lastChecked: Date.now(),
    };

    return this.lastStatus;
  }

  // ─── Performance Monitoring ───────────────────────────────────────────────

  recordPerformanceMetric(metric: string, actual: number, threshold: number): void {
    if (actual > threshold) {
      this.warnings.push({
        warningId: `warn-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        metric,
        threshold,
        actual,
        timestamp: Date.now(),
      });
      // Keep last 100 warnings
      if (this.warnings.length > 100) {
        this.warnings.shift();
      }
    }
  }

  getWarnings(): PerformanceWarning[] {
    return [...this.warnings];
  }

  getLastStatus(): HealthStatus {
    return this.lastStatus;
  }
}
