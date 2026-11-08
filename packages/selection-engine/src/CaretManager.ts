import { CaretState } from './models/SelectionState';
import { SelectionEventDispatcher } from './SelectionEventDispatcher';

export class CaretManager {
  private state: CaretState = {
    visible: false,
    x: 0,
    y: 0,
    height: 16,
    blinkRate: 500
  };

  private blinkInterval: any = null;

  constructor(private dispatcher: SelectionEventDispatcher) {}

  public setPosition(x: number, y: number, height: number) {
    this.state.x = x;
    this.state.y = y;
    this.state.height = height;
    this.show();
    this.dispatcher.emit('caret:moved', { ...this.state });
  }

  public show() {
    this.state.visible = true;
    this.resetBlink();
    this.dispatcher.emit('caret:visibility', { visible: true });
  }

  public hide() {
    this.state.visible = false;
    if (this.blinkInterval) clearInterval(this.blinkInterval);
    this.dispatcher.emit('caret:visibility', { visible: false });
  }

  private resetBlink() {
    if (this.blinkInterval) clearInterval(this.blinkInterval);
    this.blinkInterval = setInterval(() => {
      this.state.visible = !this.state.visible;
      this.dispatcher.emit('caret:visibility', { visible: this.state.visible });
    }, this.state.blinkRate);
  }

  public getState(): CaretState {
    return { ...this.state };
  }
}
