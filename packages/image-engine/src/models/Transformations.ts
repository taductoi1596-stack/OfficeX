export enum TransformType {
  Crop = 'Crop',
  Rotate = 'Rotate',
  Scale = 'Scale'
}

export interface ITransform {
  type: TransformType;
}

export interface CropTransform extends ITransform {
  type: TransformType.Crop;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RotateTransform extends ITransform {
  type: TransformType.Rotate;
  angleInDegrees: number; // 90, 180, 270...
}

export interface ScaleTransform extends ITransform {
  type: TransformType.Scale;
  scaleX: number; // e.g. 1.5 for 150%
  scaleY: number; // e.g. 0.5 for 50%
}

export type TransformAction = CropTransform | RotateTransform | ScaleTransform;
