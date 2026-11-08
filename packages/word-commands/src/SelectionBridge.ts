export type SavedSelection = {
  anchorId: string | null;
  anchorPath: number[];
  anchorOffset: number;
  focusId: string | null;
  focusPath: number[];
  focusOffset: number;
};

export class SelectionBridge {
  
  private static getNodePath(node: Node, root: HTMLElement): number[] {
    const path: number[] = [];
    let current = node;
    while (current && current !== root) {
      if (current.parentNode) {
        path.unshift(Array.prototype.indexOf.call(current.parentNode.childNodes, current));
        current = current.parentNode;
      } else {
        break;
      }
    }
    return path;
  }

  private static getNodeByPath(root: HTMLElement, path: number[]): Node | null {
    let current: Node = root;
    for (const index of path) {
      if (current.childNodes && current.childNodes.length > index) {
        current = current.childNodes[index];
      } else {
        return null;
      }
    }
    return current;
  }

  private static getBlockContainer(node: Node): HTMLElement | null {
    let current: Node | null = node;
    while (current && current !== document.body) {
      if (current.nodeType === 1) { // Element
        const el = current as HTMLElement;
        if (el.hasAttribute('data-id')) {
          return el;
        }
      }
      current = current.parentNode;
    }
    return null;
  }

  public static saveSelection(rootContainer: HTMLElement): SavedSelection | null {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || !sel.anchorNode || !sel.focusNode) return null;
    
    const anchorBlock = this.getBlockContainer(sel.anchorNode);
    const focusBlock = this.getBlockContainer(sel.focusNode);
    
    return {
      anchorId: anchorBlock ? anchorBlock.getAttribute('data-id') : null,
      anchorPath: anchorBlock ? this.getNodePath(sel.anchorNode, anchorBlock) : [],
      anchorOffset: sel.anchorOffset,
      focusId: focusBlock ? focusBlock.getAttribute('data-id') : null,
      focusPath: focusBlock ? this.getNodePath(sel.focusNode, focusBlock) : [],
      focusOffset: sel.focusOffset
    };
  }

  public static restoreSelection(rootContainer: HTMLElement, savedSel: SavedSelection): void {
    if (!savedSel) return;
    
    const sel = window.getSelection();
    if (!sel) return;

    let anchorNode: Node | null = null;
    let focusNode: Node | null = null;

    if (savedSel.anchorId) {
      const anchorBlock = rootContainer.querySelector(`[data-id="${savedSel.anchorId}"]`) as HTMLElement;
      if (anchorBlock) anchorNode = this.getNodeByPath(anchorBlock, savedSel.anchorPath);
    }
    if (savedSel.focusId) {
      const focusBlock = rootContainer.querySelector(`[data-id="${savedSel.focusId}"]`) as HTMLElement;
      if (focusBlock) focusNode = this.getNodeByPath(focusBlock, savedSel.focusPath);
    }

    if (anchorNode && focusNode) {
      try {
        sel.setBaseAndExtent(anchorNode, savedSel.anchorOffset, focusNode, savedSel.focusOffset);
      } catch (e) {
        console.warn('Failed to restore exact selection, falling back.', e);
        // Fallback: put caret at end of anchorBlock
        const anchorBlock = rootContainer.querySelector(`[data-id="${savedSel.anchorId}"]`);
        if (anchorBlock) {
          const range = document.createRange();
          range.selectNodeContents(anchorBlock);
          range.collapse(false);
          sel.removeAllRanges();
          sel.addRange(range);
        }
      }
    }
  }
}

