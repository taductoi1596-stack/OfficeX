export type HitTargetType = 
  | 'text' | 'shape' | 'image' | 'chart' | 'table' 
  | 'cell' | 'handle' | 'background' | 'unknown';

export interface HitPosition {
  x: number;
  y: number;
  localX: number;
  localY: number;
}

export interface HitResult {
  readonly targetId: string | null;
  readonly targetType: HitTargetType;
  readonly position: HitPosition;
  readonly layer: number;
  readonly zOrder: number;
  readonly handleType: string | null;
  readonly distance: number; // For snapping or proximity hits
  readonly metadata: Record<string, any>;
}

export class EmptyHitResult implements HitResult {
  public readonly targetId = null;
  public readonly targetType = 'background';
  public readonly position: HitPosition = { x: 0, y: 0, localX: 0, localY: 0 };
  public readonly layer = 0;
  public readonly zOrder = 0;
  public readonly handleType = null;
  public readonly distance = Infinity;
  public readonly metadata = {};
}
