// ─────────────────────────────────────────────────────────────────────────────
// Page Setup Engine — Core Data Models
// Ref: PAGE_SETUP_ENGINE.md §6
// ─────────────────────────────────────────────────────────────────────────────

export type PaperSize = 'A4' | 'A3' | 'Letter' | 'Legal' | 'Tabloid' | 'Custom';
export type Orientation = 'portrait' | 'landscape';

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
  gutter?: number;
}

export interface ColumnSetup {
  count: number;
  spacing: number;
  equalWidth: boolean;
}

export interface HeaderFooterConfig {
  headerDistance: number;
  footerDistance: number;
  differentFirstPage: boolean;
  differentOddEven: boolean;
}

export interface Background {
  color?: string; // hex
  imageUrl?: string;
  watermarkText?: string;
}

export interface PageSetup {
  sectionId: string;
  paperSize: PaperSize;
  width: number;  // in points (1/72 inch)
  height: number; // in points
  orientation: Orientation;
  margins: Margins;
  columns: ColumnSetup;
  headerFooter: HeaderFooterConfig;
  background?: Background;
}
