export type StyleType = 'paragraph' | 'character' | 'linked' | 'table' | 'list';

export interface StyleDef {
  id: string;
  name: string;
  type: StyleType;
  basedOn?: string;
  nextStyle?: string;
  quickStyle?: boolean;
  category?: 'QuickStyles' | 'Builtin' | 'Custom' | 'Theme';
  isFavorite?: boolean;
  isPinned?: boolean;
  usageCount?: number;
  paraFmt?: Record<string, any>;
  runFmt?: Record<string, any>;
}

const BUILT_IN_STYLES: Record<string, StyleDef> = {
  Normal: {
    id: 'Normal',
    name: 'Normal',
    type: 'paragraph',
    quickStyle: true,
    paraFmt: {
      align: 'left',
      spaceBefore: 0,
      spaceAfter: 8,
      lineSpacing: 1.08
    },
    runFmt: {
      fontFamily: 'Calibri, sans-serif',
      fontSize: 11,
      color: '#000000',
    }
  },
  Heading1: {
    id: 'Heading1',
    name: 'Heading 1',
    type: 'linked',
    basedOn: 'Normal',
    nextStyle: 'Normal',
    quickStyle: true,
    paraFmt: {
      spaceBefore: 12,
      spaceAfter: 0,
      keepWithNext: true,
      keepLinesTogether: true
    },
    runFmt: {
      fontFamily: 'Calibri Light, sans-serif',
      fontSize: 16,
      color: '#2F5496',
      bold: true
    }
  },
  Heading2: {
    id: 'Heading2',
    name: 'Heading 2',
    type: 'linked',
    basedOn: 'Normal',
    nextStyle: 'Normal',
    quickStyle: true,
    paraFmt: {
      spaceBefore: 2,
      spaceAfter: 0,
      keepWithNext: true,
      keepLinesTogether: true
    },
    runFmt: {
      fontFamily: 'Calibri Light, sans-serif',
      fontSize: 13,
      color: '#2F5496',
      bold: true
    }
  },
  Title: {
    id: 'Title',
    name: 'Title',
    type: 'linked',
    basedOn: 'Normal',
    nextStyle: 'Normal',
    quickStyle: true,
    paraFmt: {
      spaceBefore: 0,
      spaceAfter: 0,
    },
    runFmt: {
      fontFamily: 'Calibri Light, sans-serif',
      fontSize: 28,
      color: '#000000'
    }
  },
  Subtitle: {
    id: 'Subtitle',
    name: 'Subtitle',
    type: 'linked',
    basedOn: 'Normal',
    nextStyle: 'Normal',
    quickStyle: true,
    paraFmt: {
      spaceBefore: 0,
      spaceAfter: 8,
    },
    runFmt: {
      fontFamily: 'Calibri Light, sans-serif',
      fontSize: 11,
      color: '#595959',
      italic: true
    }
  },
  Quote: {
    id: 'Quote',
    name: 'Quote',
    type: 'linked',
    basedOn: 'Normal',
    nextStyle: 'Normal',
    quickStyle: true,
    paraFmt: {
      align: 'center',
      spaceBefore: 10,
      spaceAfter: 10,
      leftIndent: 40,
      rightIndent: 40,
    },
    runFmt: {
      italic: true,
      color: '#595959',
    }
  }
};

class StyleEngineImpl {
  private styles: Record<string, StyleDef> = { ...BUILT_IN_STYLES };

  getStyle(id: string): StyleDef | undefined {
    return this.styles[id];
  }

  getStylesList(): StyleDef[] {
    return Object.values(this.styles);
  }

  getQuickStyles(): StyleDef[] {
    return Object.values(this.styles).filter(s => s.quickStyle);
  }

  // ── GALLERY HELPERS ───────────────────────────────────────────────────
  searchStyles(query: string): StyleDef[] {
    const q = query.toLowerCase();
    return Object.values(this.styles).filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
  }

  filterStyles(category?: string, isFavorite?: boolean, isPinned?: boolean): StyleDef[] {
    let list = Object.values(this.styles);
    if (category) list = list.filter(s => s.category === category);
    if (isFavorite) list = list.filter(s => s.isFavorite);
    if (isPinned) list = list.filter(s => s.isPinned);
    return list;
  }

  togglePin(id: string): void {
    if (this.styles[id]) {
      this.styles[id].isPinned = !this.styles[id].isPinned;
    }
  }

  toggleFavorite(id: string): void {
    if (this.styles[id]) {
      this.styles[id].isFavorite = !this.styles[id].isFavorite;
    }
  }

  incrementUsage(id: string): void {
    if (this.styles[id]) {
      this.styles[id].usageCount = (this.styles[id].usageCount || 0) + 1;
    }
  }

  // ── MANAGER HELPERS ───────────────────────────────────────────────────
  createStyle(def: StyleDef): void {
    if (!this.styles[def.id]) {
      this.styles[def.id] = def;
    }
  }

  updateStyle(id: string, updates: Partial<StyleDef>): void {
    if (this.styles[id]) {
      // Merge updates deep for paraFmt and runFmt
      const existing = this.styles[id];
      this.styles[id] = {
        ...existing,
        ...updates,
        paraFmt: updates.paraFmt ? { ...existing.paraFmt, ...updates.paraFmt } : existing.paraFmt,
        runFmt: updates.runFmt ? { ...existing.runFmt, ...updates.runFmt } : existing.runFmt,
      };
    }
  }

  deleteStyle(id: string): void {
    // Only delete custom styles
    if (this.styles[id] && this.styles[id].category === 'Custom') {
      delete this.styles[id];
    }
  }

  // ── CASCADE RESOLVERS ──────────────────────────────────────────────────
  // Resolve Paragraph Format: Direct > Style > Base Style > Defaults
  resolveParaFmt(directFmt: Record<string, any>): Record<string, any> {
    const styleId = directFmt?.styleId || 'Normal';
    const merged = this.getInheritedParaFmt(styleId);
    return { ...merged, ...directFmt };
  }

  // Resolve Run Format: Direct > Style > Base Style > Defaults
  resolveRunFmt(directFmt: Record<string, any>, paraStyleId?: string): Record<string, any> {
    // Character style check
    const runStyleId = directFmt?.styleId || paraStyleId || 'Normal';
    const merged = this.getInheritedRunFmt(runStyleId);
    return { ...merged, ...directFmt };
  }

  // ── PRIVATE HELPERS ────────────────────────────────────────────────────
  private getInheritedParaFmt(styleId: string): Record<string, any> {
    const style = this.styles[styleId];
    if (!style) return {};
    
    let baseFmt = {};
    if (style.basedOn && style.basedOn !== styleId) {
      baseFmt = this.getInheritedParaFmt(style.basedOn);
    }
    return { ...baseFmt, ...(style.paraFmt || {}) };
  }

  private getInheritedRunFmt(styleId: string): Record<string, any> {
    const style = this.styles[styleId];
    if (!style) return {};
    
    let baseFmt = {};
    if (style.basedOn && style.basedOn !== styleId) {
      baseFmt = this.getInheritedRunFmt(style.basedOn);
    }
    return { ...baseFmt, ...(style.runFmt || {}) };
  }
}

export const StyleEngine = new StyleEngineImpl();
