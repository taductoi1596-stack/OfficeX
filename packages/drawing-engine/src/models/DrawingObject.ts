export enum DrawingObjectType {
  Shape = 'shape',
  Image = 'image',
  Ink = 'ink',
  Text = 'text'
}

/**
 * The base interface for any object placed on the Drawing Canvas.
 * It mandates that every object must have a bounding box for Hit Testing and Selection.
 */
export interface DrawingObject {
  id: string;
  type: DrawingObjectType;
  
  // Logical Bounding Box
  x: number;
  y: number;
  width: number;
  height: number;
  
  // Custom payload data for the specific engine (e.g. ShapeModel, InkStroke)
  payload: any;
}
