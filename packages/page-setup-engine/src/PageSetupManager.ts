// ─────────────────────────────────────────────────────────────────────────────
// Page Setup Manager — Central orchestrator for the Page Setup Engine
// Ref: PAGE_SETUP_ENGINE.md §4, §5, §14
// ─────────────────────────────────────────────────────────────────────────────

import type { PageSetup, PaperSize, Orientation, Margins, ColumnSetup } from './models/PageSetup';
import { PaperManager } from './PaperManager';
import { MarginManager } from './MarginManager';
import { ColumnManager } from './ColumnManager';

const DEFAULT_SECTION = '__default__';

export class PageSetupManager {
  private paper = new PaperManager();
  private marginMgr = new MarginManager();
  private columnMgr = new ColumnManager();

  private sections = new Map<string, PageSetup>();

  constructor() {
    // Initialize with A4 portrait defaults
    this.sections.set(DEFAULT_SECTION, this.buildDefault(DEFAULT_SECTION));
  }

  private buildDefault(sectionId: string): PageSetup {
    const paperSize: PaperSize = 'A4';
    const orientation: Orientation = 'portrait';
    const dims = this.paper.getDimensions(paperSize, orientation);

    return {
      sectionId,
      paperSize,
      orientation,
      width: dims.width,
      height: dims.height,
      margins: this.marginMgr.getDefaultMargins(),
      columns: this.columnMgr.getDefaultColumns(),
      headerFooter: {
        headerDistance: 36,  // 0.5 inch
        footerDistance: 36,
        differentFirstPage: false,
        differentOddEven: false,
      }
    };
  }

  getPageSetup(sectionId: string = DEFAULT_SECTION): PageSetup {
    return this.sections.get(sectionId) ?? this.sections.get(DEFAULT_SECTION)!;
  }

  setOrientation(orientation: Orientation, sectionId: string = DEFAULT_SECTION): void {
    const setup = this.getPageSetup(sectionId);
    const dims = this.paper.getDimensions(setup.paperSize, orientation);
    const updated: PageSetup = { ...setup, orientation, width: dims.width, height: dims.height };
    this.sections.set(sectionId, updated);
  }

  setPaperSize(paperSize: PaperSize, sectionId: string = DEFAULT_SECTION): void {
    const setup = this.getPageSetup(sectionId);
    const dims = this.paper.getDimensions(paperSize, setup.orientation);
    const updated: PageSetup = { ...setup, paperSize, width: dims.width, height: dims.height };
    this.sections.set(sectionId, updated);
  }

  setMargins(margins: Partial<Margins>, sectionId: string = DEFAULT_SECTION): void {
    const setup = this.getPageSetup(sectionId);
    const updated: PageSetup = { ...setup, margins: { ...setup.margins, ...margins } };
    this.sections.set(sectionId, updated);
  }

  setColumns(columns: Partial<ColumnSetup>, sectionId: string = DEFAULT_SECTION): void {
    const setup = this.getPageSetup(sectionId);
    const updated: PageSetup = { ...setup, columns: { ...setup.columns, ...columns } };
    this.sections.set(sectionId, updated);
  }

  getPrintableArea(sectionId: string = DEFAULT_SECTION): { width: number, height: number } {
    const setup = this.getPageSetup(sectionId);
    return this.marginMgr.getPrintableArea(setup.width, setup.height, setup.margins);
  }

  getColumnWidths(sectionId: string = DEFAULT_SECTION): number[] {
    const printable = this.getPrintableArea(sectionId);
    const setup = this.getPageSetup(sectionId);
    return this.columnMgr.getColumnWidths(printable.width, setup.columns);
  }
}
