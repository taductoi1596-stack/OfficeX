import { ShapeGeometry, ShapeType } from '../models/ShapeGeometry';

/**
 * A simple abstraction for a 2D rendering path.
 */
export interface PathCommand {
  type: 'moveTo' | 'lineTo' | 'bezierCurveTo' | 'arc' | 'closePath';
  args: number[];
}

export class GeometryBuilder {
  /**
   * Translates an abstract ShapeGeometry into an array of concrete Path2D drawing commands.
   * Note: This does NOT apply the TransformMatrix. The renderer should apply the matrix context first.
   */
  public buildPath(geometry: ShapeGeometry): PathCommand[] {
    const commands: PathCommand[] = [];
    const { width, height } = geometry;

    switch (geometry.type) {
      case ShapeType.Rectangle:
        // Start at top-left (0, 0), draw 4 lines
        commands.push({ type: 'moveTo', args: [0, 0] });
        commands.push({ type: 'lineTo', args: [width, 0] });
        commands.push({ type: 'lineTo', args: [width, height] });
        commands.push({ type: 'lineTo', args: [0, height] });
        commands.push({ type: 'closePath', args: [] });
        break;

      case ShapeType.Ellipse:
        const cx = width / 2;
        const cy = height / 2;
        // Arc: x, y, radius, startAngle, endAngle
        commands.push({ type: 'arc', args: [cx, cy, Math.max(cx, cy), 0, Math.PI * 2] });
        break;

      case ShapeType.Line:
        commands.push({ type: 'moveTo', args: [0, 0] });
        commands.push({ type: 'lineTo', args: [width, height] }); // Simplified line from 0,0 to w,h
        break;
        
      default:
        console.warn(`ShapeType ${geometry.type} is not supported by GeometryBuilder yet.`);
    }

    return commands;
  }
}
