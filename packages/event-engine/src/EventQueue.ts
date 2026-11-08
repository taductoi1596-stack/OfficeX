import { OfficeEvent, EventPriority } from './models/OfficeEvent';
import { EventDispatcher } from './EventDispatcher';

// ─────────────────────────────────────────────────────────────────────────────
// Event Queue
// Supports priority scheduling and delayed execution.
// ─────────────────────────────────────────────────────────────────────────────
export class EventQueue {
  private queue: OfficeEvent[] = [];
  private isProcessing = false;

  constructor(private dispatcher: EventDispatcher) {}

  public enqueue(event: OfficeEvent): void {
    this.queue.push(event);
    // Sort logic could go here based on Priority
    // For now, simple FIFO
    this.scheduleProcessing();
  }

  private scheduleProcessing() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    // Use microtask for immediate async execution
    queueMicrotask(() => this.processQueue());
  }

  private processQueue() {
    while (this.queue.length > 0) {
      const event = this.queue.shift();
      if (event) {
        this.dispatcher.dispatch(event);
      }
    }
    this.isProcessing = false;
  }
}
