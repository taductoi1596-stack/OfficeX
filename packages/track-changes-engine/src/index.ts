// @officex/track-changes-engine — Public API
export type {
  Revision,
  RevisionType,
  RevisionStatus,
  DisplayMode,
} from './models/Revision';

export type { RevisionSummary } from './TrackChangesManager';

export { ChangeRecorder } from './ChangeRecorder';
export { ReviewManager } from './ReviewManager';
export { CompareEngine } from './CompareEngine';
export { DisplayModeManager } from './DisplayModeManager';
export { TrackChangesManager } from './TrackChangesManager';
