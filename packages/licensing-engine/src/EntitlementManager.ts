// ─────────────────────────────────────────────────────────────────────────────
// Entitlement Manager — Evaluates access to specific features
// Ref: LICENSING_ENGINE.md §14
// ─────────────────────────────────────────────────────────────────────────────

import type { License } from './models/License';
import { ValidationManager } from './ValidationManager';

export class EntitlementManager {
  private validation: ValidationManager;
  private currentLicense: License | null = null;

  constructor(validation: ValidationManager) {
    this.validation = validation;
  }

  setLicense(license: License | null): void {
    this.currentLicense = license;
  }

  /**
   * Checks if a specific feature is enabled for the current license.
   */
  canUseFeature(featureId: string): boolean {
    const { valid } = this.validation.validateLicense(this.currentLicense);
    if (!valid || !this.currentLicense) return false;

    // 'enterprise' edition might bypass granular checks for certain basic features
    if (this.currentLicense.productEdition === 'enterprise') {
      // Some enterprise policies might still restrict things, but we assume
      // all core features are enabled by default.
      if (featureId.startsWith('core:')) return true;
    }

    const entitlement = this.currentLicense.entitlements.find((e) => e.featureId === featureId);
    
    if (!entitlement || !entitlement.enabled) {
      return false;
    }

    if (entitlement.expiration && Date.now() > entitlement.expiration) {
      return false;
    }

    return true;
  }

  /**
   * Checks if an AI token usage is within limits.
   */
  checkQuota(featureId: string, amount: number): boolean {
    const { valid } = this.validation.validateLicense(this.currentLicense);
    if (!valid || !this.currentLicense) return false;

    const entitlement = this.currentLicense.entitlements.find((e) => e.featureId === featureId);
    if (!entitlement || !entitlement.enabled) return false;

    // In a real implementation, usage would be tracked against entitlement.limit
    // Here we just check if a limit exists
    if (entitlement.limit !== undefined && amount > entitlement.limit) {
      return false; // Exceeds single-request limit or total limit stub
    }

    return true;
  }
}
