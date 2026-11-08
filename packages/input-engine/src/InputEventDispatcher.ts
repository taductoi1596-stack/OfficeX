import { InputEvent, InputEventType } from './models/InputEvent';

type InputHandler = (event: InputEvent) => void;

// ─────────────────────────────────────────────────────────────────────────────
// Input Event Dispatcher
// Routes normalized InputEvents to registered handlers. Supports wildcard (*).
// ─────────────────────────────────────────────────────────────────────────────
export class InputEventDispatcher {
  private handlers: Map<string, Set<InputHandler>> = new Map();

  public on(type: InputEventType | '*', handler: InputHandler): void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
  }

  public off(type: InputEventType | '*', handler: InputHandler): void {
    this.handlers.get(type)?.delete(handler);
  }

  public dispatch(event: InputEvent): void {
    // Specific handlers
    this.handlers.get(event.type)?.forEach(h => h(event));
    // Wildcard handlers
    this.handlers.get('*')?.forEach(h => h(event));
  }
}
