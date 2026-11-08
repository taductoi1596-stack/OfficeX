// ─────────────────────────────────────────────────────────────────────────────
// Validation Manager — Validates license integrity, expiration, and signatures
// Ref: LICENSING_ENGINE.md §15, §24
// ─────────────────────────────────────────────────────────────────────────────

import type { License } from './models/License';

export class ValidationManager {
  /**
   * Validates if the license is currently active and structurally intact.
   */
  validateLicense(license: License | null): { valid: boolean; reason?: string } {
    if (!license) {
      return { valid: false, reason: 'No license provided' };
    }

    if (license.activationStatus !== 'active') {
      return { valid: false, reason: `License status is ${license.activationStatus}` };
    }

    // Check expiration
    if (license.expiration !== null && Date.now() > license.expiration) {
      return { valid: false, reason: 'License has expired' };
    }

    // Verify cryptographic signature (stub implementation)
    if (!this.verifySignature(license)) {
      return { valid: false, reason: 'License signature is invalid or tampered' };
    }

    return { valid: true };
  }

  /**
   * Cryptographically verifies the license integrity.
   * In a real implementation, this uses public key cryptography (e.g. RSA or ECDSA).
   */
  private verifySignature(_license: License): boolean {
    // Stub: Assume all non-empty signatures are valid for now
    return !!_license.signature;
  }
}
