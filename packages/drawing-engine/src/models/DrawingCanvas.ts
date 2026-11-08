import { DrawingLayer } from './DrawingLayer';

/**
 * Represents the viewport camera and the container for all drawing layers.
 */
export class DrawingCanvas {
  private layers: DrawingLayer[] = [];
  
  // Camera Viewport State
  public zoom: number = 1.0;
  public panX: number = 0;
  public panY: number = 0;

  constructor() {
    // Initialize default layers (bottom to top)
    this.layers.push(new DrawingLayer('layer_background', 'Background'));
    this.layers.push(new DrawingLayer('layer_main', 'Main Drawing'));
    this.layers.push(new DrawingLayer('layer_ink', 'Ink'));
    this.layers.push(new DrawingLayer('layer_selection', 'Selection Overlay'));
  }

  public getLayer(id: string): DrawingLayer | undefined {
    return this.layers.find(l => l.id === id);
  }

  public getAllLayers(): DrawingLayer[] {
    return this.layers;
  }

  /**
   * Transforms a physical screen coordinate (e.g. from mouse event)
   * into the logical space of the infinite canvas.
   */
  public screenToCanvas(screenX: number, screenY: number): { x: number, y: number } {
    return {
      x: (screenX - this.panX) / this.zoom,
      y: (screenY - this.panY) / this.zoom
    };
  }

  /**
   * Transforms a logical canvas coordinate to screen coordinate (for rendering).
   */
  public canvasToScreen(canvasX: number, canvasY: number): { x: number, y: number } {
    return {
      x: canvasX * this.zoom + this.panX,
      y: canvasY * this.zoom + this.panY
    };
  }
}
