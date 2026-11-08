type EventHandler = (payload: any) => void;

export class SelectionEventDispatcher {
  private listeners: Map<string, Set<EventHandler>> = new Map();

  on(event: string, handler: EventHandler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);
  }

  off(event: string, handler: EventHandler) {
    this.listeners.get(event)?.delete(handler);
  }

  emit(event: string, payload: any) {
    this.listeners.get(event)?.forEach(handler => handler(payload));
  }
}
