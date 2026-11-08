// ─────────────────────────────────────────────────────────────────────────────
// Profiler Manager — Orchestrates Profiling Engine and manages sessions
// Ref: PROFILING_ENGINE.md §4, §5, §6
// ─────────────────────────────────────────────────────────────────────────────

import type { ProfilingSession, TargetComponent, ProfilingReport } from './models/Profile';
import { TimingAnalyzer } from './TimingAnalyzer';
import { MetricsCollector } from './MetricsCollector';

function generateId(): string {
  return `prof-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export class ProfilerManager {
  readonly timing: TimingAnalyzer;
  readonly metrics: MetricsCollector;
  
  private currentSession: ProfilingSession | null = null;
  private reports: ProfilingReport[] = [];

  constructor() {
    this.timing = new TimingAnalyzer();
    this.metrics = new MetricsCollector();
  }

  // ─── Session Management ───────────────────────────────────────────────────

  startSession(target: TargetComponent, metadata: Record<string, any> = {}): string {
    if (this.currentSession) {
      this.stopSession(); // Automatically stop previous
    }

    this.timing.clear();
    this.metrics.clear();

    this.currentSession = {
      sessionId: generateId(),
      targetComponent: target,
      startTime: Date.now(),
      metrics: [],
      samples: {},
      metadata,
    };

    return this.currentSession.sessionId;
  }

  stopSession(): ProfilingReport | null {
    if (!this.currentSession) return null;

    const session = this.currentSession;
    session.endTime = Date.now();
    session.metrics = this.metrics.getMetrics();

    // Generate Report
    const report: ProfilingReport = {
      reportId: `rep-${session.sessionId}`,
      sessionId: session.sessionId,
      targetComponent: session.targetComponent,
      durationMs: session.endTime - session.startTime,
      summary: `Profiled ${session.targetComponent} for ${session.endTime - session.startTime}ms`,
      averageMetrics: {
        memory: this.metrics.getAverage('heap_used'),
        frameDuration: this.timing.getFrameTimings().reduce((acc, f) => acc + f.durationMs, 0) 
                       / (this.timing.getFrameTimings().length || 1),
      },
      hotPaths: this.timing.getHotPaths(),
      generatedAt: Date.now(),
    };

    this.reports.push(report);
    this.currentSession = null;

    // Keep last 20 reports
    if (this.reports.length > 20) {
      this.reports.shift();
    }

    return report;
  }

  getCurrentSession(): ProfilingSession | null {
    return this.currentSession;
  }

  getReports(): ProfilingReport[] {
    return [...this.reports];
  }

  clearReports(): void {
    this.reports = [];
  }
}
