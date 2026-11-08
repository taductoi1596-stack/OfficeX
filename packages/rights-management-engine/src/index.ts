// @officex/rights-management-engine — Public API
export type {
  DocumentPermission,
  WatermarkConfig,
  EncryptionInfo,
  DocumentRights,
} from './models/Rights';

export { PermissionEvaluator } from './PermissionEvaluator';
export { ProtectionManager } from './ProtectionManager';
export { EncryptionManager } from './EncryptionManager';
export { WatermarkManager } from './WatermarkManager';
export { RightsManager } from './RightsManager';
