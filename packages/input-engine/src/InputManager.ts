import { InputEventDispatcher } from './InputEventDispatcher';
import { KeyboardManager } from './KeyboardManager';
import { MouseManager } from './MouseManager';
import { IMEManager } from './IMEManager';

// ─────────────────────────────────────────────────────────────────────────────
// Input Manager (Core Engine Facade)
// Initializes all sub-managers and provides a unified entry point.
// ─────────────────────────────────────────────────────────────────────────────
export class InputManager {
  public dispatcher: InputEventDispatcher;
  public keyboard: KeyboardManager;
  public mouse: MouseManager;
  public ime: IMEManager;

  constructor(target: EventTarget = window) {
    this.dispatcher = new InputEventDispatcher();
    this.keyboard = new KeyboardManager(this.dispatcher, target);
    this.mouse = new MouseManager(this.dispatcher, target);
    this.ime = new IMEManager(this.dispatcher, target);
  }

  public destroy() {
    this.keyboard.unmount();
    this.mouse.unmount();
    this.ime.unmount();
  }
}
