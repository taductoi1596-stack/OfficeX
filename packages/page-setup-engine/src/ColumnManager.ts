// ─────────────────────────────────────────────────────────────────────────────
// Column Manager — Calculates column widths and spacing
// Ref: PAGE_SETUP_ENGINE.md §10
// ─────────────────────────────────────────────────────────────────────────────

import type { ColumnSetup } from './models/PageSetup';

export class ColumnManager {
  getDefaultColumns(): ColumnSetup {
    return {
      count: 1,
      spacing: 36, // 0.5 inch default spacing
      equalWidth: true
    };
  }

  getColumnWidths(printableWidth: number, setup: ColumnSetup): number[] {
    if (setup.count <= 1) return [printableWidth];
    
    // For now, only supports equal width calculation
    const totalSpacing = setup.spacing * (setup.count - 1);
    const widthPerColumn = Math.max(0, (printableWidth - totalSpacing) / setup.count);
    
    return Array(setup.count).fill(widthPerColumn);
  }
}
