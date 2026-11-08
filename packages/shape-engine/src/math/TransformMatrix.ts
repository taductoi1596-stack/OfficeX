/**
 * Represents an Affine 2D Transformation Matrix:
 * [ a, c, e ]
 * [ b, d, f ]
 * [ 0, 0, 1 ]
 * 
 * Typically stored as an array: [a, b, c, d, e, f]
 */
export class TransformMatrix {
  public m: [number, number, number, number, number, number];

  constructor(a: number = 1, b: number = 0, c: number = 0, d: number = 1, e: number = 0, f: number = 0) {
    this.m = [a, b, c, d, e, f];
  }

  /**
   * Applies translation (x, y) to the current matrix.
   */
  public translate(tx: number, ty: number): TransformMatrix {
    this.m[4] += this.m[0] * tx + this.m[2] * ty;
    this.m[5] += this.m[1] * tx + this.m[3] * ty;
    return this;
  }

  /**
   * Applies scale (sx, sy) to the current matrix.
   */
  public scale(sx: number, sy: number): TransformMatrix {
    this.m[0] *= sx;
    this.m[1] *= sx;
    this.m[2] *= sy;
    this.m[3] *= sy;
    return this;
  }

  /**
   * Applies rotation (radians) to the current matrix.
   */
  public rotate(radians: number): TransformMatrix {
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const m11 = this.m[0] * cos + this.m[2] * sin;
    const m12 = this.m[1] * cos + this.m[3] * sin;
    const m21 = this.m[0] * -sin + this.m[2] * cos;
    const m22 = this.m[1] * -sin + this.m[3] * cos;
    
    this.m[0] = m11;
    this.m[1] = m12;
    this.m[2] = m21;
    this.m[3] = m22;
    return this;
  }

  /**
   * Applies this transformation matrix to a point (x, y).
   * Returns a new transformed point.
   */
  public transformPoint(x: number, y: number): { x: number, y: number } {
    return {
      x: x * this.m[0] + y * this.m[2] + this.m[4],
      y: x * this.m[1] + y * this.m[3] + this.m[5]
    };
  }
}
