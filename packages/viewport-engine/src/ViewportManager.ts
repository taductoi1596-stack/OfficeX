import { ViewportState, createDefaultViewport } from './models/ViewportState';

export type ViewportChangeListener = (state: ViewportState) => void;

// ─────────────────────────────────────────────────────────────────────────────
// Viewport Manager (Core Engine Facade)
// Manages the visible region of a document and controls zoom/pan.
// ─────────────────────────────────────────────────────────────────────────────
export class ViewportManager {
  private state: ViewportState;
  private listeners: Set<ViewportChangeListener> = new Set();

  constructor() {
    this.state = createDefaultViewport();
  }

  public getState(): ViewportState {
    return { ...this.state };
  }

  public resize(width: number, height: number): void {
    if (this.state.viewportWidth === width && this.state.viewportHeight === height) return;
    this.state.viewportWidth = width;
    this.state.viewportHeight = height;
    this.recalculateVisibleRegion();
    this.notify();
  }

  public scroll(dx: number, dy: number): void {
    if (dx === 0 && dy === 0) return;
    this.state.scrollX += dx;
    this.state.scrollY += dy;
    this.recalculateVisibleRegion();
    this.notify();
  }

  public scrollTo(x: number, y: number): void {
    this.state.scrollX = x;
    this.state.scrollY = y;
    this.recalculateVisibleRegion();
    this.notify();
  }

  public setZoom(zoom: number): void {
    if (this.state.zoom === zoom) return;
    this.state.zoom = zoom;
    this.recalculateVisibleRegion();
    this.notify();
  }

  private recalculateVisibleRegion() {
    this.state.visibleRegion = {
      x: this.state.scrollX,
      y: this.state.scrollY,
      width: this.state.viewportWidth / this.state.zoom,
      height: this.state.viewportHeight / this.state.zoom,
    };
  }

  public onChange(listener: ViewportChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const frozenState = this.getState();
    for (const listener of this.listeners) {
      listener(frozenState);
    }
  }
}
