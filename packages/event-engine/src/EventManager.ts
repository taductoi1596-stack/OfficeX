import { OfficeEvent, BaseEvent, EventPriority } from './models/OfficeEvent';
import { EventDispatcher, EventHandler } from './EventDispatcher';
import { EventQueue } from './EventQueue';

// ─────────────────────────────────────────────────────────────────────────────
// Event Manager (Core Engine Facade)
// Enterprise-wide event bus for OfficeX.
// ─────────────────────────────────────────────────────────────────────────────
export class EventManager {
  private dispatcher: EventDispatcher;
  private queue: EventQueue;

  constructor() {
    this.dispatcher = new EventDispatcher();
    this.queue = new EventQueue(this.dispatcher);
  }

  /**
   * Dispatches an event immediately (synchronous).
   */
  public dispatch(event: OfficeEvent): void {
    this.dispatcher.dispatch(event);
  }

  /**
   * Dispatches an event asynchronously via the priority queue.
   */
  public enqueue(event: OfficeEvent): void {
    this.queue.enqueue(event);
  }

  /**
   * Helper to create and enqueue an event easily.
   */
  public emit<T>(type: string, payload: T, source: string = 'system'): void {
    const event = new BaseEvent<T>(type, payload, source);
    this.enqueue(event);
  }

  /**
   * Subscribe to an event type.
   */
  public on(
    type: string | '*',
    handler: EventHandler,
    options?: { priority?: EventPriority; filter?: (event: OfficeEvent) => boolean }
  ): () => void {
    return this.dispatcher.subscribe(type, handler, options);
  }
}
