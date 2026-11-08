// ─────────────────────────────────────────────────────────────────────────────
// License Manager — Central orchestrator for the Licensing Engine
// Ref: LICENSING_ENGINE.md §4, §5
// ─────────────────────────────────────────────────────────────────────────────

import type { License } from './models/License';
import { ValidationManager } from './ValidationManager';
import { EntitlementManager } from './EntitlementManager';
import { ActivationManager } from './ActivationManager';

export class LicenseManager {
  readonly validation: ValidationManager;
  readonly entitlements: EntitlementManager;
  readonly activation: ActivationManager;

  private currentLicense: License | null = null;

  constructor() {
    this.validation = new ValidationManager();
    this.entitlements = new EntitlementManager(this.validation);
    this.activation = new ActivationManager();
  }

  // ─── Lifecycle ────────────────────────────────────────────────────────────

  loadLicense(licenseData: string): void {
    try {
      const license: License = JSON.parse(licenseData);
      const { valid, reason } = this.validation.validateLicense(license);
      
      if (valid) {
        this.currentLicense = license;
        this.entitlements.setLicense(license);
      } else {
        console.warn(`[Licensing] Invalid license loaded: ${reason}`);
      }
    } catch (err) {
      console.error('[Licensing] Failed to parse license data', err);
    }
  }

  getLicense(): License | null {
    return this.currentLicense;
  }

  // ─── High-Level Operations ────────────────────────────────────────────────

  async activateAndRegister(productKey: string, ownerId: string, deviceName: string): Promise<License> {
    const newLicense = await this.activation.activateOnline(productKey, ownerId);
    const registeredLicense = this.activation.registerDevice(newLicense, deviceName);
    
    this.currentLicense = registeredLicense;
    this.entitlements.setLicense(registeredLicense);

    // Provide a way to persist this
    return registeredLicense;
  }

  hasFeature(featureId: string): boolean {
    return this.entitlements.canUseFeature(featureId);
  }

  clearLicense(): void {
    this.currentLicense = null;
    this.entitlements.setLicense(null);
  }
}
