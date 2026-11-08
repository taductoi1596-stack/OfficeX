import { IMECompositionEvent } from './models/InputEvent';
import { InputEventDispatcher } from './InputEventDispatcher';

// ─────────────────────────────────────────────────────────────────────────────
// IME Manager (Section 11)
// Normalizes composition events for CJK and other complex text input.
// ─────────────────────────────────────────────────────────────────────────────
export class IMEManager {
  private el: EventTarget;

  constructor(
    private dispatcher: InputEventDispatcher,
    target: EventTarget = window,
  ) {
    this.el = target;
    this.mount();
  }

  private mount() {
    this.el.addEventListener('compositionstart', this.onStart as EventListener);
    this.el.addEventListener('compositionupdate', this.onUpdate as EventListener);
    this.el.addEventListener('compositionend', this.onEnd as EventListener);
  }

  public unmount() {
    this.el.removeEventListener('compositionstart', this.onStart as EventListener);
    this.el.removeEventListener('compositionupdate', this.onUpdate as EventListener);
    this.el.removeEventListener('compositionend', this.onEnd as EventListener);
  }

  private emit(e: CompositionEvent, type: IMECompositionEvent['type']) {
    const ev: IMECompositionEvent = {
      type,
      data: e.data || '',
      timestamp: Date.now(),
    };
    // Note: dispatching as a generic InputEvent wrapper if needed, 
    // or as a specialized event. We'll cast to any for the dispatcher.
    this.dispatcher.dispatch(ev as any);
  }

  private onStart = (e: CompositionEvent) => this.emit(e, 'compositionstart');
  private onUpdate = (e: CompositionEvent) => this.emit(e, 'compositionupdate');
  private onEnd = (e: CompositionEvent) => this.emit(e, 'compositionend');
}
