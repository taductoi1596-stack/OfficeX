import { DrawingCanvas } from './models/DrawingCanvas';
import { DrawingObject } from './models/DrawingObject';
import { SelectionManager } from './managers/SelectionManager';
import { InkManager } from './managers/InkManager';

export class DrawingManager {
  public canvas: DrawingCanvas;
  public selection: SelectionManager;
  public ink: InkManager;
  
  // Global registry of all objects across all layers for fast lookup O(1)
  private objectRegistry: Map<string, DrawingObject> = new Map();

  constructor() {
    this.canvas = new DrawingCanvas();
    this.selection = new SelectionManager(this.objectRegistry);
    this.ink = new InkManager();
  }

  public registerObject(obj: DrawingObject, layerId: string = 'layer_main'): void {
    this.objectRegistry.set(obj.id, obj);
    const layer = this.canvas.getLayer(layerId);
    if (layer) {
      layer.addObject(obj);
    }
  }

  public unregisterObject(id: string): void {
    this.objectRegistry.delete(id);
    for (const layer of this.canvas.getAllLayers()) {
      layer.removeObject(id);
    }
    this.selection.deselect(id);
  }
}
