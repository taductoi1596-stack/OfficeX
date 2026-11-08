// ─────────────────────────────────────────────────────────────────────────────
// Margin Manager — Calculates margins and printable areas
// Ref: PAGE_SETUP_ENGINE.md §9, §11
// ─────────────────────────────────────────────────────────────────────────────

import type { Margins } from './models/PageSetup';

export class MarginManager {
  getDefaultMargins(): Margins {
    // Default 1-inch margins (72 points)
    return {
      top: 72,
      right: 72,
      bottom: 72,
      left: 72,
      gutter: 0
    };
  }

  getPrintableArea(width: number, height: number, margins: Margins): { width: number, height: number } {
    const leftMargin = margins.left + (margins.gutter || 0);
    const rightMargin = margins.right;
    const topMargin = margins.top;
    const bottomMargin = margins.bottom;

    return {
      width: Math.max(0, width - leftMargin - rightMargin),
      height: Math.max(0, height - topMargin - bottomMargin)
    };
  }
}
