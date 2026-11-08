// @officex/telemetry-engine — Public API
export type {
  TelemetryEvent,
  EventCategory,
  PrivacyLevel,
  ConsentConfig,
} from './models/Telemetry';

export { PrivacyManager } from './PrivacyManager';
export { EventAggregator } from './EventAggregator';
export { UploadManager } from './UploadManager';
export { TelemetryManager } from './TelemetryManager';
