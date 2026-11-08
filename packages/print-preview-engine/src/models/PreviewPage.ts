export type PageOrientation = 'portrait' | 'landscape';

export interface PrintMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface PreviewPage {
  readonly id: string;
  pageNumber: number;
  width: number;
  height: number;
  orientation: PageOrientation;
  margins: PrintMargins;
  printableArea: {
    x: number; y: number; width: number; height: number;
  };
  
  // Headers & Footers IDs resolved for this page
  headerId: string | null;
  footerId: string | null;
  
  // The actual layout content to be drawn on this preview page
  contentIds: string[];
  
  // Zoom applied just for the preview window (doesn't affect document)
  zoom: number;
  
  metadata: Record<string, any>;
}

export const createPreviewPage = (pageNumber: number): PreviewPage => ({
  id: `pv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
  pageNumber,
  width: 816, 
  height: 1056,
  orientation: 'portrait',
  margins: { top: 96, right: 96, bottom: 96, left: 96 },
  printableArea: { x: 96, y: 96, width: 624, height: 864 },
  headerId: null,
  footerId: null,
  contentIds: [],
  zoom: 1.0,
  metadata: {}
});
