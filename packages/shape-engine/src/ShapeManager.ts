import { ShapeModel } from './models/ShapeModel';
import { GeometryBuilder, PathCommand } from './engines/GeometryBuilder';
import { HitTestEngine } from './engines/HitTestEngine';

export class ShapeManager {
  private shapes: Map<string, ShapeModel> = new Map();
  private geometryBuilder: GeometryBuilder;
  private hitTestEngine: HitTestEngine;

  constructor() {
    this.geometryBuilder = new GeometryBuilder();
    this.hitTestEngine = new HitTestEngine();
  }

  public addShape(shape: ShapeModel): void {
    this.shapes.set(shape.id, shape);
  }

  public getShape(id: string): ShapeModel | undefined {
    return this.shapes.get(id);
  }

  public getAllShapes(): ShapeModel[] {
    return Array.from(this.shapes.values());
  }

  /**
   * Returns the vector commands needed to draw this shape.
   */
  public buildGeometry(shapeId: string): PathCommand[] {
    const shape = this.shapes.get(shapeId);
    if (!shape) return [];
    return this.geometryBuilder.buildPath(shape.geometry);
  }

  /**
   * Finds the topmost shape that intersects with the given coordinate.
   * Evaluates shapes in reverse order (assuming last added is on top).
   */
  public hitTest(x: number, y: number): ShapeModel | undefined {
    const shapesArray = this.getAllShapes();
    for (let i = shapesArray.length - 1; i >= 0; i--) {
      const shape = shapesArray[i];
      if (this.hitTestEngine.hitTest(x, y, shape)) {
        return shape;
      }
    }
    return undefined;
  }
}
