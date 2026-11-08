import { DocumentNode } from './DocumentNode';
import { EventDispatcher } from '../events/EventDispatcher';

export class DocumentRoot extends DocumentNode {
  public readonly type = 'Document';
  private dispatcher: EventDispatcher = new EventDispatcher();

  public getText(): string {
    return this.children.map(child => child.getText()).join('');
  }

  /**
   * Override notifyChanged. Since this is the root, 
   * bubbling stops here and we dispatch the global event.
   */
  protected notifyChanged(): void {
    this.dispatcher.dispatch('NodeChanged');
  }

  /**
   * Allows external engines (like LayoutEngine) to listen to DOM mutations.
   */
  public onChange(callback: () => void): void {
    this.dispatcher.subscribe('NodeChanged', callback);
  }
}
