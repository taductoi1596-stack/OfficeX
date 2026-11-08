export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PageSize {
  width: number;
  height: number;
}

export interface PageModel {
  readonly id: string;
  pageNumber: number;
  size: PageSize;
  margins: Margins;
  
  // The content nodes allocated to this page
  contentIds: string[];
  
  // Headers & Footers
  headerId: string | null;
  footerId: string | null;

  // Layout characteristics
  columnCount: number;
  
  metadata: Record<string, any>;
}

export const createDefaultPage = (pageNumber: number = 1): PageModel => ({
  id: `pg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
  pageNumber,
  size: { width: 816, height: 1056 }, // Standard 8.5x11 inches in 96 DPI
  margins: { top: 96, right: 96, bottom: 96, left: 96 }, // 1 inch margins
  contentIds: [],
  headerId: null,
  footerId: null,
  columnCount: 1,
  metadata: {},
});
