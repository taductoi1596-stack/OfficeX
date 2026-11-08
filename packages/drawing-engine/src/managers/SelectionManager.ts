import { DrawingObject } from '../models/DrawingObject';

export class SelectionManager {
  // Set of selected object IDs
  private selectedIds: Set<string> = new Set();
  
  // Reference to all objects to calculate bounds
  private allObjects: Map<string, DrawingObject>;

  constructor(objectsRegistry: Map<string, DrawingObject>) {
    this.allObjects = objectsRegistry;
  }

  public select(id: string, multi: boolean = false): void {
    if (!multi) {
      this.selectedIds.clear();
    }
    this.selectedIds.add(id);
  }

  public deselect(id: string): void {
    this.selectedIds.delete(id);
  }

  public clearSelection(): void {
    this.selectedIds.clear();
  }

  public getSelectedIds(): string[] {
    return Array.from(this.selectedIds);
  }

  /**
   * Calculates the global bounding box containing all selected objects.
   * Useful for drawing the blue selection rectangle and multi-resizing.
   */
  public getSelectionBounds(): { x: number, y: number, width: number, height: number } | null {
    if (this.selectedIds.size === 0) return null;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const id of this.selectedIds) {
      const obj = this.allObjects.get(id);
      if (obj) {
        minX = Math.min(minX, obj.x);
        minY = Math.min(minY, obj.y);
        maxX = Math.max(maxX, obj.x + obj.width);
        maxY = Math.max(maxY, obj.y + obj.height);
      }
    }

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
}
