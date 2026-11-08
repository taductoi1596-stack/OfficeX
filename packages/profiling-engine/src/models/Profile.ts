// ─────────────────────────────────────────────────────────────────────────────
// Profiling Engine — Core Data Models
// Ref: PROFILING_ENGINE.md §6
// ─────────────────────────────────────────────────────────────────────────────

export type TargetComponent =
  | 'cpu'
  | 'gpu'
  | 'memory'
  | 'layout'
  | 'render'
  | 'formula'
  | 'paint'
  | 'io';

export interface PerformanceMetric {
  metricId: string;
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'fps' | 'count' | 'percent';
  timestamp: number;
}

export interface FrameTiming {
  frameId: number;
  durationMs: number;
  layoutMs: number;
  renderMs: number;
  paintMs: number;
  timestamp: number;
}

export interface ProfilingSession {
  sessionId: string;
  targetComponent: TargetComponent;
  startTime: number;
  endTime?: number;
  metrics: PerformanceMetric[];
  samples: Record<string, number>;
  metadata: Record<string, any>;
}

export interface ProfilingReport {
  reportId: string;
  sessionId: string;
  targetComponent: TargetComponent;
  durationMs: number;
  summary: string;
  averageMetrics: Record<string, number>;
  hotPaths: Array<{ path: string; durationMs: number; calls: number }>;
  generatedAt: number;
}
