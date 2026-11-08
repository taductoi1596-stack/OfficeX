// ─────────────────────────────────────────────────────────────────────────────
// Timing Analyzer — Measure execution time of critical paths
// Ref: PROFILING_ENGINE.md §7, §10-§15
// ─────────────────────────────────────────────────────────────────────────────

import type { FrameTiming } from './models/Profile';

export class TimingAnalyzer {
  private activeTimers: Map<string, number> = new Map();
  private hotPaths: Map<string, { duration: number; calls: number }> = new Map();
  private frames: FrameTiming[] = [];
  private frameCount = 0;

  // ─── Execution Timing ─────────────────────────────────────────────────────

  startTimer(id: string): void {
    if (typeof performance !== 'undefined') {
      this.activeTimers.set(id, performance.now());
    } else {
      this.activeTimers.set(id, Date.now());
    }
  }

  stopTimer(id: string): number {
    const start = this.activeTimers.get(id);
    if (start === undefined) return 0;
    
    this.activeTimers.delete(id);
    
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const duration = now - start;

    // Track for hot path analysis
    const existing = this.hotPaths.get(id) ?? { duration: 0, calls: 0 };
    this.hotPaths.set(id, {
      duration: existing.duration + duration,
      calls: existing.calls + 1,
    });

    return duration;
  }

  async measureAsync<T>(id: string, fn: () => Promise<T>): Promise<T> {
    this.startTimer(id);
    try {
      return await fn();
    } finally {
      this.stopTimer(id);
    }
  }

  measureSync<T>(id: string, fn: () => T): T {
    this.startTimer(id);
    try {
      return fn();
    } finally {
      this.stopTimer(id);
    }
  }

  // ─── Frame Timing ─────────────────────────────────────────────────────────

  recordFrame(layoutMs: number, renderMs: number, paintMs: number): void {
    const frame: FrameTiming = {
      frameId: ++this.frameCount,
      durationMs: layoutMs + renderMs + paintMs,
      layoutMs,
      renderMs,
      paintMs,
      timestamp: Date.now(),
    };

    this.frames.push(frame);
    if (this.frames.length > 600) { // Keep last ~10s at 60fps
      this.frames.shift();
    }
  }

  getFrameTimings(): FrameTiming[] {
    return [...this.frames];
  }

  getHotPaths() {
    return Array.from(this.hotPaths.entries())
      .map(([path, stats]) => ({ path, durationMs: stats.duration, calls: stats.calls }))
      .sort((a, b) => b.durationMs - a.durationMs);
  }

  clear(): void {
    this.activeTimers.clear();
    this.hotPaths.clear();
    this.frames = [];
    this.frameCount = 0;
  }
}
