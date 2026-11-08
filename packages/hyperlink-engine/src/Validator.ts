// ─────────────────────────────────────────────────────────────────────────────
// Validator — Validates hyperlink targets for URI syntax and security
// Ref: HYPERLINK_ENGINE.md §13, §19
// ─────────────────────────────────────────────────────────────────────────────

import type { Hyperlink, LinkStatus } from './models/Hyperlink';

/** Protocols permitted for navigation without confirmation */
const SAFE_PROTOCOLS = ['https:', 'http:', 'mailto:', 'file:'];

/** Protocols that are blocked entirely */
const BLOCKED_PROTOCOLS = ['javascript:', 'data:', 'vbscript:'];

export class Validator {
  private cache = new Map<string, LinkStatus>();

  validate(hyperlink: Hyperlink): LinkStatus {
    const cached = this.cache.get(hyperlink.target);
    if (cached) return cached;

    const status = this.evaluateTarget(hyperlink);
    this.cache.set(hyperlink.target, status);
    return status;
  }

  private evaluateTarget(hyperlink: Hyperlink): LinkStatus {
    const { linkType, target } = hyperlink;

    if (!target || target.trim() === '') return 'invalid';

    if (linkType === 'url' || linkType === 'external') {
      return this.validateUrl(target);
    }

    if (linkType === 'email') {
      return this.validateEmail(target);
    }

    // bookmark, cross-ref, internal: assume valid unless empty
    return 'valid';
  }

  private validateUrl(target: string): LinkStatus {
    try {
      const url = new URL(target);

      if (BLOCKED_PROTOCOLS.includes(url.protocol)) {
        return 'unsafe';
      }

      if (!SAFE_PROTOCOLS.includes(url.protocol)) {
        // Unsupported but not necessarily unsafe — mark invalid
        return 'invalid';
      }

      return 'valid';
    } catch {
      return 'invalid';
    }
  }

  private validateEmail(target: string): LinkStatus {
    const raw = target.startsWith('mailto:') ? target.slice(7) : target;
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+/;
    return emailRegex.test(raw) ? 'valid' : 'invalid';
  }

  invalidateCache(): void {
    this.cache.clear();
  }
}
