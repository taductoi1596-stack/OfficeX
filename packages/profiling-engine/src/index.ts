// @officex/profiling-engine — Public API
export type {
  TargetComponent,
  PerformanceMetric,
  FrameTiming,
  ProfilingSession,
  ProfilingReport,
} from './models/Profile';

export { TimingAnalyzer } from './TimingAnalyzer';
export { MetricsCollector } from './MetricsCollector';
export { ProfilerManager } from './ProfilerManager';
