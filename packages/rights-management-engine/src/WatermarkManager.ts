// ─────────────────────────────────────────────────────────────────────────────
// Watermark Manager — Manages watermark configuration for protected documents
// Ref: RIGHTS_MANAGEMENT_ENGINE.md §13
// ─────────────────────────────────────────────────────────────────────────────

import type { WatermarkConfig } from './models/Rights';

export class WatermarkManager {
  private config: WatermarkConfig | null = null;

  setConfig(config: WatermarkConfig): void {
    this.config = config;
  }

  clearConfig(): void {
    this.config = null;
  }

  getConfig(): WatermarkConfig | null {
    return this.config;
  }

  isEnabled(): boolean {
    return this.config?.enabled ?? false;
  }

  /**
   * Generates the watermark text to be rendered on screen.
   * In a real implementation, userId would be injected from the auth system.
   */
  renderText(userId?: string): string {
    if (!this.config?.enabled) return '';

    const parts: string[] = [];

    if (this.config.text) {
      parts.push(this.config.text);
    }

    if (this.config.showIdentity && userId) {
      parts.push(userId);
    }

    if (this.config.showTimestamp) {
      parts.push(new Date().toLocaleString());
    }

    return parts.join(' · ');
  }
}
