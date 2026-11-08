export interface ViewportRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type ViewMode = 'print' | 'web' | 'draft' | 'outline' | 'read' | 'normal' | 'page-layout';

export interface ViewportState {
  readonly id: string;
  
  // Transform
  scrollX: number;
  scrollY: number;
  zoom: number;
  rotation: number;
  
  // Dimensions
  viewportWidth: number;
  viewportHeight: number;
  
  // Modes & State
  viewMode: ViewMode;
  isFrozen: boolean;
  freezeRow: number;
  freezeCol: number;
  
  // Computed (read-only theoretically, but managed by engine)
  visibleRegion: ViewportRegion;
}

export const createDefaultViewport = (): ViewportState => ({
  id: `vp-${Date.now()}`,
  scrollX: 0,
  scrollY: 0,
  zoom: 1, // 100%
  rotation: 0,
  viewportWidth: 0,
  viewportHeight: 0,
  viewMode: 'print',
  isFrozen: false,
  freezeRow: 0,
  freezeCol: 0,
  visibleRegion: { x: 0, y: 0, width: 0, height: 0 },
});
