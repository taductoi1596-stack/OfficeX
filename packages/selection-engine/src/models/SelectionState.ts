export type SelectionType = 'caret' | 'range' | 'multi' | 'object' | 'cell' | 'shape';

export interface SelectionAnchor {
  objectId: string;
  offset: number;
}

export interface SelectionFocus {
  objectId: string;
  offset: number;
}

export interface SelectionState {
  type: SelectionType;
  anchor: SelectionAnchor | null;
  focus: SelectionFocus | null;
  targetObjects: string[];
  isCollapsed: boolean;
  metadata: Record<string, any>;
}

export interface CaretState {
  visible: boolean;
  x: number;
  y: number;
  height: number;
  blinkRate: number;
}
