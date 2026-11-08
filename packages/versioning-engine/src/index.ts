// @officex/versioning-engine — Public API
export type {
  DocumentVersion,
  VersionType,
  AuditInfo,
  VersionDiff,
  MergeResult,
  MergeStatus,
} from './models/Version';

export { SnapshotManager } from './SnapshotManager';
export { CompareEngine } from './CompareEngine';
export { AuditManager } from './AuditManager';
export type { AuditAction, AuditEntry } from './AuditManager';
export { VersionManager } from './VersionManager';
export type { CreateVersionOptions } from './VersionManager';
