import { ShapeModel } from '../models/ShapeModel';

export class HitTestEngine {
  /**
   * Checks if a global point (x, y) intersects with a given Shape.
   * This handles matrix inversion to check the point against the shape's local bounds.
   */
  public hitTest(x: number, y: number, shape: ShapeModel): boolean {
    const m = shape.transform.m;

    // 1. Calculate inverse matrix determinant
    const det = m[0] * m[3] - m[1] * m[2];
    if (det === 0) return false; // Matrix is singular

    // 2. Compute inverse matrix elements
    const invA = m[3] / det;
    const invB = -m[1] / det;
    const invC = -m[2] / det;
    const invD = m[0] / det;
    const invE = (m[2] * m[5] - m[3] * m[4]) / det;
    const invF = (m[1] * m[4] - m[0] * m[5]) / det;

    // 3. Transform the global (x,y) pointer into the local coordinate space of the shape
    const localX = x * invA + y * invC + invE;
    const localY = x * invB + y * invD + invF;

    // 4. Perform simple AABB bounding box check in local space
    return (
      localX >= 0 &&
      localX <= shape.geometry.width &&
      localY >= 0 &&
      localY <= shape.geometry.height
    );
  }
}
