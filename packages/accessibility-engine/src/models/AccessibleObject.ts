export type SemanticRole = 
  | 'document' | 'page' | 'heading' | 'paragraph' | 'list' 
  | 'table' | 'cell' | 'image' | 'chart' | 'button' 
  | 'menu' | 'link' | 'textbox' | 'checkbox' | 'dialog';

export type AccessibleState = 'normal' | 'focused' | 'selected' | 'disabled' | 'hidden';

export interface AccessibleBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AccessibleObject {
  readonly id: string;
  name: string;
  description: string;
  role: SemanticRole;
  state: AccessibleState;
  bounds: AccessibleBounds;
  
  // Tree structure
  parentId: string | null;
  childrenIds: string[];
  
  metadata: Record<string, any>;
}

export const createAccessibleObject = (
  id: string, 
  role: SemanticRole, 
  name: string = ''
): AccessibleObject => ({
  id,
  name,
  description: '',
  role,
  state: 'normal',
  bounds: { x: 0, y: 0, width: 0, height: 0 },
  parentId: null,
  childrenIds: [],
  metadata: {}
});
