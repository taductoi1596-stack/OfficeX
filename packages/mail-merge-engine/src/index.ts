// @officex/mail-merge-engine — Public API
export type { MergeJob, MergeStatus, MergeRecord, FilterOption, SortOption } from './models/MergeJob';

// Providers
export type { DataProvider } from './providers/DataProvider';
export { CSVProvider } from './providers/CSVProvider';
export { JSONProvider } from './providers/JSONProvider';

export { FieldResolver } from './FieldResolver';
export { BatchProcessor } from './BatchProcessor';
export { MergeManager } from './MergeManager';
