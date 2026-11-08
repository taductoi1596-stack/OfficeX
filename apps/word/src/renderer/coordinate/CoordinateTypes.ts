export type UnitType = 
  | 'pixel'
  | 'dip'
  | 'point'
  | 'twip'
  | 'emu'
  | 'mm'
  | 'cm'
  | 'inch'
  | 'pica';

export interface Point2D {
  x: number;
  y: number;
}

export interface Rect2D {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Matrix3x3 = [
  number, number, number,
  number, number, number,
  number, number, number
];
