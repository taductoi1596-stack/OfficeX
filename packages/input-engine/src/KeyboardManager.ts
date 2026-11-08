import { KeyboardInputEvent, InputModifiers } from './models/InputEvent';
import { InputEventDispatcher } from './InputEventDispatcher';

let _seq = 0;

function makeModifiers(e: KeyboardEvent): InputModifiers {
  return { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey, meta: e.metaKey };
}

// ─────────────────────────────────────────────────────────────────────────────
// Keyboard Manager (Section 7)
// Listens to DOM keyboard events and normalizes them to KeyboardInputEvent.
// ─────────────────────────────────────────────────────────────────────────────
export class KeyboardManager {
  private el: EventTarget;

  constructor(
    private dispatcher: InputEventDispatcher,
    target: EventTarget = window,
  ) {
    this.el = target;
    this.mount();
  }

  private mount() {
    this.el.addEventListener('keydown', this.onKeyDown as EventListener);
    this.el.addEventListener('keyup', this.onKeyUp as EventListener);
  }

  public unmount() {
    this.el.removeEventListener('keydown', this.onKeyDown as EventListener);
    this.el.removeEventListener('keyup', this.onKeyUp as EventListener);
  }

  private onKeyDown = (e: KeyboardEvent) => {
    const ev: KeyboardInputEvent = {
      id: `kb-${++_seq}`,
      device: 'keyboard',
      type: 'keydown',
      timestamp: Date.now(),
      position: null,
      modifiers: makeModifiers(e),
      target: (e.target as HTMLElement)?.id ?? null,
      rawEvent: e,
      metadata: {},
      key: e.key,
      code: e.code,
      repeat: e.repeat,
    };
    this.dispatcher.dispatch(ev);
  };

  private onKeyUp = (e: KeyboardEvent) => {
    const ev: KeyboardInputEvent = {
      id: `kb-${++_seq}`,
      device: 'keyboard',
      type: 'keyup',
      timestamp: Date.now(),
      position: null,
      modifiers: makeModifiers(e),
      target: (e.target as HTMLElement)?.id ?? null,
      rawEvent: e,
      metadata: {},
      key: e.key,
      code: e.code,
      repeat: e.repeat,
    };
    this.dispatcher.dispatch(ev);
  };
}
