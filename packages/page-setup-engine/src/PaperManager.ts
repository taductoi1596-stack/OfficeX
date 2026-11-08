// ─────────────────────────────────────────────────────────────────────────────
// Paper Manager — Manages paper sizes and orientations
// Ref: PAGE_SETUP_ENGINE.md §7, §8
// ─────────────────────────────────────────────────────────────────────────────

import type { PaperSize, Orientation } from './models/PageSetup';

// Dimensions in points (1 pt = 1/72 inch)
const PAPER_DIMENSIONS: Record<Exclude<PaperSize, 'Custom'>, { width: number, height: number }> = {
  'A4': { width: 595.28, height: 841.89 },
  'A3': { width: 841.89, height: 1190.55 },
  'Letter': { width: 612, height: 792 },
  'Legal': { width: 612, height: 1008 },
  'Tabloid': { width: 792, height: 1224 },
};

export class PaperManager {
  getDimensions(size: PaperSize, orientation: Orientation, customWidth?: number, customHeight?: number): { width: number, height: number } {
    let w = 0, h = 0;
    
    if (size === 'Custom') {
      w = customWidth ?? 595.28;
      h = customHeight ?? 841.89;
    } else {
      const dim = PAPER_DIMENSIONS[size];
      w = dim.width;
      h = dim.height;
    }

    if (orientation === 'landscape') {
      return { width: h, height: w };
    }
    
    return { width: w, height: h };
  }
}
