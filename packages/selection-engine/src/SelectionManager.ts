import { SelectionState, SelectionType, SelectionAnchor, SelectionFocus } from './models/SelectionState';
import { SelectionEventDispatcher } from './SelectionEventDispatcher';
import { CaretManager } from './CaretManager';

export class SelectionManager {
  private currentState: SelectionState = {
    type: 'caret',
    anchor: null,
    focus: null,
    targetObjects: [],
    isCollapsed: true,
    metadata: {}
  };

  public readonly dispatcher = new SelectionEventDispatcher();
  public readonly caret = new CaretManager(this.dispatcher);

  public setSelection(
    type: SelectionType,
    anchor: SelectionAnchor | null,
    focus: SelectionFocus | null,
    targetObjects: string[] = []
  ) {
    const isCollapsed = anchor?.objectId === focus?.objectId && anchor?.offset === focus?.offset;

    this.currentState = {
      type,
      anchor,
      focus,
      targetObjects,
      isCollapsed,
      metadata: {}
    };

    this.dispatcher.emit('selection:changed', this.currentState);
  }

  public clearSelection() {
    this.currentState = {
      type: 'caret',
      anchor: null,
      focus: null,
      targetObjects: [],
      isCollapsed: true,
      metadata: {}
    };
    this.caret.hide();
    this.dispatcher.emit('selection:cleared', null);
  }

  public getState(): SelectionState {
    return { ...this.currentState };
  }
}
