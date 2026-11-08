import { HitResult } from './models/HitResult';
import { GeometryResolver } from './resolvers/GeometryResolver';

// ─────────────────────────────────────────────────────────────────────────────
// HitTest Manager (Core Engine Facade)
// ─────────────────────────────────────────────────────────────────────────────
export class HitTestManager {
  private geometryResolver: GeometryResolver;

  constructor() {
    this.geometryResolver = new GeometryResolver();
  }

  /**
   * Determine what object is located at a specific (x, y) coordinate.
   * @param x Document X coordinate
   * @param y Document Y coordinate
   * @param layoutTree The active layout tree for coordinate resolution
   */
  public hitTest(x: number, y: number, layoutTree: any): HitResult {
    // Pipeline: Handle Detector -> Layer Resolver -> Object Picker -> Text HitTester
    return this.geometryResolver.resolvePoint(x, y, layoutTree);
  }
}
