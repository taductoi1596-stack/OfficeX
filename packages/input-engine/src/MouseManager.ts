import { MouseInputEvent, WheelInputEvent, InputModifiers, InputPosition } from './models/InputEvent';
import { InputEventDispatcher } from './InputEventDispatcher';

let _seq = 0;

function makeModifiers(e: MouseEvent): InputModifiers {
  return { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey, meta: e.metaKey };
}

function makePosition(e: MouseEvent): InputPosition {
  return { x: e.clientX, y: e.clientY, pageX: e.pageX, pageY: e.pageY };
}

// ─────────────────────────────────────────────────────────────────────────────
// Mouse Manager (Section 8) + Wheel Manager (Section 13)
// ─────────────────────────────────────────────────────────────────────────────
export class MouseManager {
  private el: EventTarget;
  private clickTimer: any = null;
  private clickCount = 0;

  constructor(
    private dispatcher: InputEventDispatcher,
    target: EventTarget = window,
  ) {
    this.el = target;
    this.mount();
  }

  private mount() {
    this.el.addEventListener('mousemove', this.onMove as EventListener);
    this.el.addEventListener('mousedown', this.onDown as EventListener);
    this.el.addEventListener('mouseup', this.onUp as EventListener);
    this.el.addEventListener('click', this.onClick as EventListener);
    this.el.addEventListener('dblclick', this.onDblClick as EventListener);
    this.el.addEventListener('wheel', this.onWheel as EventListener, { passive: true });
  }

  public unmount() {
    this.el.removeEventListener('mousemove', this.onMove as EventListener);
    this.el.removeEventListener('mousedown', this.onDown as EventListener);
    this.el.removeEventListener('mouseup', this.onUp as EventListener);
    this.el.removeEventListener('click', this.onClick as EventListener);
    this.el.removeEventListener('dblclick', this.onDblClick as EventListener);
    this.el.removeEventListener('wheel', this.onWheel as EventListener);
  }

  private emit(e: MouseEvent, type: MouseInputEvent['type']): void {
    const ev: MouseInputEvent = {
      id: `ms-${++_seq}`,
      device: 'mouse',
      type,
      timestamp: Date.now(),
      position: makePosition(e),
      modifiers: makeModifiers(e),
      target: (e.target as HTMLElement)?.id ?? null,
      rawEvent: e,
      metadata: {},
      button: e.button as 0 | 1 | 2,
      buttons: e.buttons,
    };
    this.dispatcher.dispatch(ev);
  }

  private onMove = (e: MouseEvent) => this.emit(e, 'mousemove');
  private onDown = (e: MouseEvent) => this.emit(e, 'mousedown');
  private onUp = (e: MouseEvent) => this.emit(e, 'mouseup');

  private onClick = (e: MouseEvent) => {
    this.clickCount++;
    clearTimeout(this.clickTimer);
    this.clickTimer = setTimeout(() => {
      if (this.clickCount === 3) this.emit(e, 'tripleclick');
      else if (this.clickCount === 1) this.emit(e, 'click');
      this.clickCount = 0;
    }, 250);
  };

  private onDblClick = (e: MouseEvent) => {
    clearTimeout(this.clickTimer);
    this.clickCount = 0;
    this.emit(e, 'dblclick');
  };

  private onWheel = (e: WheelEvent) => {
    const ev: WheelInputEvent = {
      id: `wh-${++_seq}`,
      device: 'wheel',
      type: 'wheel',
      timestamp: Date.now(),
      position: makePosition(e),
      modifiers: { ctrl: e.ctrlKey, alt: e.altKey, shift: e.shiftKey, meta: e.metaKey },
      target: (e.target as HTMLElement)?.id ?? null,
      rawEvent: e,
      metadata: {},
      deltaX: e.deltaX,
      deltaY: e.deltaY,
      deltaZ: e.deltaZ,
      deltaMode: e.deltaMode,
    };
    this.dispatcher.dispatch(ev);
  };
}
