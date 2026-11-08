export type CoordinateSpace = 'document' | 'layout' | 'render' | 'viewport' | 'screen' | 'printer' | 'pdf';
export type CoordinateUnit = 'px' | 'pt' | 'twip' | 'in' | 'mm' | 'cm' | 'emu' | 'dip';

export interface Coordinate {
  x: number;
  y: number;
  z?: number;
  unit: CoordinateUnit;
  space: CoordinateSpace;
  metadata?: Record<string, any>;
}

export interface TransformMatrix {
  a: number; b: number;
  c: number; d: number;
  tx: number; ty: number;
}
