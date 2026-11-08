// ─────────────────────────────────────────────────────────────────────────────
// Metrics Collector — Collects and aggregates system/resource metrics
// Ref: PROFILING_ENGINE.md §16, §18
// ─────────────────────────────────────────────────────────────────────────────

import type { PerformanceMetric } from './models/Profile';

export class MetricsCollector {
  private metrics: PerformanceMetric[] = [];

  recordMetric(
    name: string,
    value: number,
    unit: PerformanceMetric['unit'] = 'count'
  ): void {
    const metric: PerformanceMetric = {
      metricId: `met-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      value,
      unit,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);
  }

  recordMemoryUsage(): void {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const usedJSHeapSize = (performance as any).memory.usedJSHeapSize;
      this.recordMetric('heap_used', usedJSHeapSize, 'bytes');
    }
  }

  getMetrics(nameFilter?: string): PerformanceMetric[] {
    if (nameFilter) {
      return this.metrics.filter((m) => m.name === nameFilter);
    }
    return [...this.metrics];
  }

  getAverage(nameFilter: string): number {
    const filtered = this.getMetrics(nameFilter);
    if (filtered.length === 0) return 0;
    
    const sum = filtered.reduce((acc, m) => acc + m.value, 0);
    return sum / filtered.length;
  }

  clear(): void {
    this.metrics = [];
  }
}
