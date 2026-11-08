export type ContextType = 
  | 'Text' | 'Paragraph' | 'Selection' | 'Image' | 'Shape' | 'Chart'
  | 'SmartArt' | 'Table' | 'Cell' | 'Row' | 'Column' | 'Equation'
  | 'Hyperlink' | 'Comment' | 'Header' | 'Footer' | 'Footnote'
  | 'Endnote' | 'Field' | 'Content Control' | 'OLE' | 'Canvas'
  | 'Page' | 'Margin' | 'Background' | 'Plugin' | 'AI' | 'Developer';

export interface ContextMenuItem {
  id: string;
  type: 'Item' | 'Divider' | 'SubMenu';
  label?: string;
  commandId?: string; // Links to CommandDispatcher
  shortcut?: string;
  icon?: any; // e.g. IconCut
  
  // For SubMenu
  children?: ContextMenuItem[];
}

export interface ContextMenuSchema {
  contextType: ContextType;
  items: ContextMenuItem[];
}

class ContextMenuRegistryImpl {
  private menus: Map<ContextType, ContextMenuSchema> = new Map();

  public register(schema: ContextMenuSchema) {
    this.menus.set(schema.contextType, schema);
  }

  public getMenu(contextType: ContextType): ContextMenuSchema | undefined {
    return this.menus.get(contextType);
  }

  public clear() {
    this.menus.clear();
  }
}

export const ContextMenuRegistry = new ContextMenuRegistryImpl();
