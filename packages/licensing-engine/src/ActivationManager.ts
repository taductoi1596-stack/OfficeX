// ─────────────────────────────────────────────────────────────────────────────
// Activation Manager — Handles product keys, online/offline activation and devices
// Ref: LICENSING_ENGINE.md §7-§10, §16
// ─────────────────────────────────────────────────────────────────────────────

import type { License, Device } from './models/License';

function generateId(): string {
  return `dev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export class ActivationManager {
  /**
   * Activates a license using a product key (online).
   */
  async activateOnline(productKey: string, ownerId: string): Promise<License> {
    // Stub implementation: simulates calling a backend activation service
    if (productKey === 'INVALID') {
      throw new Error('Invalid product key');
    }

    const license: License = {
      licenseId: `lic-${Date.now()}`,
      licenseType: 'subscription',
      productEdition: 'professional',
      ownerId,
      activationStatus: 'active',
      issuedAt: Date.now(),
      expiration: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year
      entitlements: [
        { featureId: 'core:edit', enabled: true },
        { featureId: 'export:pdf', enabled: true },
        { featureId: 'ai:assistant', enabled: true, limit: 10000 },
      ],
      registeredDevices: [],
      metadata: { activatedVia: 'online' },
      signature: 'dummy-crypto-signature',
    };

    return license;
  }

  /**
   * Registers the current device to the license.
   */
  registerDevice(license: License, deviceName: string): License {
    // Check if limit exceeded (e.g., limit 5 devices)
    if (license.registeredDevices.length >= 5) {
      throw new Error('Device limit reached for this license');
    }

    const device: Device = {
      deviceId: generateId(),
      name: deviceName,
      registeredAt: Date.now(),
      lastSeenAt: Date.now(),
      status: 'active',
    };

    license.registeredDevices.push(device);
    return license;
  }

  revokeDevice(license: License, deviceId: string): License {
    const device = license.registeredDevices.find((d) => d.deviceId === deviceId);
    if (device) {
      device.status = 'revoked';
    }
    return license;
  }
}
