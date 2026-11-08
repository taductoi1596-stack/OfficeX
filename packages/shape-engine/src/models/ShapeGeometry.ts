export enum ShapeType {
  Rectangle = 'rect',
  Ellipse = 'ellipse',
  Line = 'line',
  // Polygons, Freeform, AutoShapes...
}

/**
 * Defines the core geometric dimensions before any matrix transformations.
 * Shapes always start at logical (0, 0) relative to their own coordinate space.
 */
export interface ShapeGeometry {
  type: ShapeType;
  width: number;
  height: number;
  
  // Custom properties per shape type
  rx?: number; // for rounded rect
  ry?: number;
}
