import { AccessibleObject, createAccessibleObject } from './models/AccessibleObject';

// ─────────────────────────────────────────────────────────────────────────────
// Accessibility Manager (Core Engine Facade)
// Bridges OfficeX to Operating System Accessibility APIs and Assistive Tech.
// ─────────────────────────────────────────────────────────────────────────────
export class AccessibilityManager {
  private accessibilityTree: Map<string, AccessibleObject> = new Map();
  private rootId: string;
  private currentFocusId: string | null = null;

  constructor(documentName: string = 'Document') {
    const root = createAccessibleObject('root', 'document', documentName);
    this.rootId = root.id;
    this.accessibilityTree.set(root.id, root);
  }

  /**
   * Registers a new accessible object in the A11y tree.
   */
  public registerObject(obj: AccessibleObject): void {
    this.accessibilityTree.set(obj.id, obj);
    
    // Link to parent
    if (obj.parentId) {
      const parent = this.accessibilityTree.get(obj.parentId);
      if (parent && !parent.childrenIds.includes(obj.id)) {
        parent.childrenIds.push(obj.id);
      }
    }
  }

  /**
   * Focuses an accessible object, triggering Screen Reader announcements.
   */
  public setFocus(id: string): void {
    if (!this.accessibilityTree.has(id)) return;
    
    // Unfocus previous
    if (this.currentFocusId) {
      const prev = this.accessibilityTree.get(this.currentFocusId);
      if (prev) prev.state = 'normal';
    }

    // Focus new
    const current = this.accessibilityTree.get(id);
    if (current) {
      current.state = 'focused';
      this.currentFocusId = id;
      this.announceLiveRegion(`Focused on ${current.role} ${current.name}`);
    }
  }

  /**
   * Speaks a message via ARIA Live Regions or OS Screen Reader API.
   */
  public announceLiveRegion(message: string): void {
    // In browser: this would create/update an aria-live region element
    // In Electron: this would use app.accessibilitySupport API
    console.log(`[AccessibilityEngine] 🗣️ Announcing: "${message}"`);
  }

  public getTree(): AccessibleObject[] {
    return Array.from(this.accessibilityTree.values());
  }
}
