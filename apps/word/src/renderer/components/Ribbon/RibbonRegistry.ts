export type ControlType = 
  | 'Button' | 'ToggleButton' | 'SplitButton' | 'DropDown' | 'ComboBox' 
  | 'Gallery' | 'ColorPicker' | 'FontPicker' | 'Menu' | 'MenuButton' 
  | 'Spinner' | 'CheckBox' | 'RadioButton' | 'Separator' | 'Label' 
  | 'DialogLauncher';

export interface RibbonControl {
  id: string;
  type: ControlType;
  commandId?: string; // Links to CommandDispatcher
  label?: string;
  tooltip?: string;
  description?: string;
  icon?: any; // e.g. IconHome
  largeIcon?: any;
  smallIcon?: any;
  shortcut?: string;
  keyTip?: string;
  
  // Dynamic properties computed via command states
  visible?: boolean;
  enabled?: boolean;

  // Dropdowns/Galleries items
  items?: any[];

  // Optional contextual logic
  context?: string;
}

export interface RibbonGroup {
  id: string;
  label: string;
  controls: RibbonControl[];
  dialogLauncherCommandId?: string;
}

export interface RibbonTab {
  id: string;
  label: string;
  keyTip?: string;
  groups: RibbonGroup[];
  context?: string; // If contextual
}

class RibbonRegistryImpl {
  private tabs: Map<string, RibbonTab> = new Map();
  private orderedTabs: string[] = [];

  public registerTab(tab: RibbonTab) {
    if (!this.tabs.has(tab.id)) {
      this.orderedTabs.push(tab.id);
    }
    this.tabs.set(tab.id, tab);
  }

  public getTabs(): RibbonTab[] {
    return this.orderedTabs.map(id => this.tabs.get(id)!);
  }

  public getTab(id: string): RibbonTab | undefined {
    return this.tabs.get(id);
  }

  public clear() {
    this.tabs.clear();
    this.orderedTabs = [];
  }
}

export const RibbonRegistry = new RibbonRegistryImpl();
