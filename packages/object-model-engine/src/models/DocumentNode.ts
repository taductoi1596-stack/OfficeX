export abstract class DocumentNode {
  public id: string;
  public parent: DocumentNode | null = null;
  public children: DocumentNode[] = [];
  
  public abstract readonly type: string;

  constructor(id?: string) {
    // Generate UUID if not provided (simplified for boilerplate)
    this.id = id || Math.random().toString(36).substring(2, 10);
  }

  public appendChild(child: DocumentNode): void {
    child.parent = this;
    this.children.push(child);
    this.notifyChanged();
  }

  public removeChild(child: DocumentNode): void {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      child.parent = null;
      this.notifyChanged();
    }
  }

  public abstract getText(): string;

  /**
   * Bubbles a change event up to the root of the document.
   */
  protected notifyChanged(): void {
    if (this.parent) {
      this.parent.notifyChanged();
    }
  }
}
