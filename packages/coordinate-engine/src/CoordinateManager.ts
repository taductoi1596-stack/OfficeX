import { Coordinate, CoordinateSpace, TransformMatrix } from './models/Coordinate';
import { UnitConverter } from './utils/UnitConverter';

// ─────────────────────────────────────────────────────────────────────────────
// Coordinate Manager (Core Engine Facade)
// Central spatial transformation subsystem.
// ─────────────────────────────────────────────────────────────────────────────
export class CoordinateManager {
  /**
   * Transforms a coordinate from one space to another.
   * This is a placeholder for complex matrix resolution logic.
   */
  public transform(
    coord: Coordinate,
    targetSpace: CoordinateSpace,
    activeViewport?: { scrollX: number, scrollY: number, zoom: number }
  ): Coordinate {
    if (coord.space === targetSpace) return { ...coord };

    let x = coord.x;
    let y = coord.y;

    // Example transformation logic: Document -> Viewport
    if (coord.space === 'document' && targetSpace === 'viewport' && activeViewport) {
      x = (x - activeViewport.scrollX) * activeViewport.zoom;
      y = (y - activeViewport.scrollY) * activeViewport.zoom;
    }

    // Example: Viewport -> Document
    if (coord.space === 'viewport' && targetSpace === 'document' && activeViewport) {
      x = (x / activeViewport.zoom) + activeViewport.scrollX;
      y = (y / activeViewport.zoom) + activeViewport.scrollY;
    }

    return {
      x,
      y,
      unit: coord.unit,
      space: targetSpace,
      metadata: coord.metadata
    };
  }

  /**
   * Convert scalar units
   */
  public convertUnit = UnitConverter.convert.bind(UnitConverter);
}
