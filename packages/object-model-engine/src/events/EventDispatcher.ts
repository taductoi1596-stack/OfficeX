type EventCallback = () => void;

export class EventDispatcher {
  private listeners: Map<string, EventCallback[]> = new Map();

  public subscribe(eventType: string, callback: EventCallback): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
  }

  public dispatch(eventType: string): void {
    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      callbacks.forEach(cb => cb());
    }
  }
}
