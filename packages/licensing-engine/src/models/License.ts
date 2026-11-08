// ─────────────────────────────────────────────────────────────────────────────
// Licensing Engine — Core Data Models
// Ref: LICENSING_ENGINE.md §6
// ─────────────────────────────────────────────────────────────────────────────

export type LicenseType = 'subscription' | 'perpetual' | 'trial' | 'free';
export type ProductEdition = 'personal' | 'professional' | 'enterprise' | 'education';
export type ActivationStatus = 'active' | 'expired' | 'revoked' | 'pending' | 'invalid';

export interface Entitlement {
  featureId: string;
  enabled: boolean;
  limit?: number; // e.g. Max devices, max AI tokens
  expiration?: number;
}

export interface Device {
  deviceId: string;
  name: string;
  registeredAt: number;
  lastSeenAt: number;
  status: 'active' | 'revoked';
}

export interface License {
  licenseId: string;
  licenseType: LicenseType;
  productEdition: ProductEdition;
  ownerId: string;
  organizationId?: string;
  activationStatus: ActivationStatus;
  issuedAt: number;
  expiration: number | null; // null = perpetual
  entitlements: Entitlement[];
  registeredDevices: Device[];
  metadata: Record<string, any>;
  signature: string; // Used for offline validation
}
