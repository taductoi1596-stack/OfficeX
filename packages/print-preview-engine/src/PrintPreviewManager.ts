import { PreviewPage, createPreviewPage } from './models/PreviewPage';

// ─────────────────────────────────────────────────────────────────────────────
// Print Preview Manager (Core Engine Facade)
// Responsible for transforming final pages into interactive WYSIWYG preview.
// ─────────────────────────────────────────────────────────────────────────────
export class PrintPreviewManager {
  private previewPages: PreviewPage[] = [];
  private currentZoom: number = 1.0;

  constructor() {
    this.previewPages = [];
  }

  /**
   * Generates a print preview from the Pagination Engine's output.
   * @param paginatedPages - Output from Pagination Engine
   */
  public generatePreview(paginatedPages: any[]): void {
    // In reality, this reads PageModel[] from PaginationEngine and Printer Capabilities
    this.previewPages = paginatedPages.map((page, idx) => {
      const p = createPreviewPage(idx + 1);
      p.zoom = this.currentZoom;
      // Copy over layout IDs
      p.contentIds = page.contentIds || [];
      return p;
    });
  }

  public setZoom(zoom: number): void {
    this.currentZoom = zoom;
    for (const page of this.previewPages) {
      page.zoom = zoom;
    }
  }

  public getPreviewPages(): PreviewPage[] {
    return this.previewPages;
  }
}
