import { ShapeGeometry } from './ShapeGeometry';
import { ShapeStyle } from './ShapeStyle';
import { TransformMatrix } from '../math/TransformMatrix';

export class ShapeModel {
  public id: string;
  public geometry: ShapeGeometry;
  public style: ShapeStyle;
  
  // This single matrix holds all position (x, y), rotation, and scale data.
  public transform: TransformMatrix;

  constructor(id: string, geometry: ShapeGeometry, style: ShapeStyle = {}) {
    this.id = id;
    this.geometry = geometry;
    this.style = style;
    this.transform = new TransformMatrix(); // Default is Identity matrix
  }
}
