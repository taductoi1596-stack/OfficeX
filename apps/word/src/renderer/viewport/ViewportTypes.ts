export interface VisibleRange {
  start: number;
  end: number;
}

export interface Coordinate {
  x: number;
  y: number;
}

export type ViewMode = 'print' | 'web' | 'draft' | 'outline' | 'read' | 'focus';

export interface ViewportState {
  zoom: number;
  scrollLeft: number;
  scrollTop: number;
  vis: VisibleRange;
  viewMode: ViewMode;
  clientHeight: number;
  clientWidth: number;
}

export interface ScreenCaret {
  pageIdx: number;
  x: number;
  localY: number;
  height: number;
}
