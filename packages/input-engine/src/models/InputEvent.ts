// ─────────────────────────────────────────────────────────────────────────────
// Input Event Model (Section 6 of INPUT_ENGINE.md)
// Every hardware event is normalized into this structure before dispatch.
// ─────────────────────────────────────────────────────────────────────────────

export type InputDevice =
  | 'keyboard'
  | 'mouse'
  | 'touch'
  | 'stylus'
  | 'pen'
  | 'wheel'
  | 'gamepad'
  | 'unknown';

export type InputEventType =
  // Keyboard
  | 'keydown' | 'keyup' | 'keypress' | 'character'
  // Mouse
  | 'mousemove' | 'mousedown' | 'mouseup' | 'click' | 'dblclick' | 'tripleclick'
  | 'mouseenter' | 'mouseleave' | 'drag' | 'dragstart' | 'dragend' | 'drop' | 'hover'
  // Wheel
  | 'wheel' | 'wheelzoom' | 'wheelpan'
  // Touch
  | 'touchstart' | 'touchmove' | 'touchend' | 'touchcancel'
  | 'longpress' | 'doubletap' | 'pinch' | 'rotate' | 'swipe'
  // Stylus / Pen
  | 'pendown' | 'penmove' | 'penup' | 'penhover'
  // IME
  | 'compositionstart' | 'compositionupdate' | 'compositionend'
  // Gesture
  | 'gesture';

export interface InputModifiers {
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  meta: boolean;
}

export interface InputPosition {
  x: number;
  y: number;
  pageX?: number;
  pageY?: number;
}

export interface InputEvent {
  readonly id: string;
  readonly device: InputDevice;
  readonly type: InputEventType;
  readonly timestamp: number;
  readonly position: InputPosition | null;
  readonly modifiers: InputModifiers;
  readonly target: string | null;   // DOM element id or engine object id
  readonly rawEvent: unknown;       // Original browser/OS event
  readonly metadata: Record<string, any>;
}

// Keyboard-specific extension
export interface KeyboardInputEvent extends InputEvent {
  readonly device: 'keyboard';
  readonly key: string;
  readonly code: string;
  readonly repeat: boolean;
}

// Mouse-specific extension
export interface MouseInputEvent extends InputEvent {
  readonly device: 'mouse';
  readonly button: 0 | 1 | 2;
  readonly buttons: number;
}

// Wheel-specific extension
export interface WheelInputEvent extends InputEvent {
  readonly device: 'wheel';
  readonly deltaX: number;
  readonly deltaY: number;
  readonly deltaZ: number;
  readonly deltaMode: number;
}

// Stylus-specific extension
export interface StylusInputEvent extends InputEvent {
  readonly device: 'stylus' | 'pen';
  readonly pressure: number;
  readonly tiltX: number;
  readonly tiltY: number;
  readonly twist: number;
}

// IME composition event
export interface IMECompositionEvent {
  readonly type: 'compositionstart' | 'compositionupdate' | 'compositionend';
  readonly data: string;
  readonly timestamp: number;
}
