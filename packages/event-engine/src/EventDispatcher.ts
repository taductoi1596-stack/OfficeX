import { OfficeEvent, EventPriority } from './models/OfficeEvent';

export type EventHandler = (event: OfficeEvent) => void | Promise<void>;

export interface Subscription {
  id: string;
  type: string | '*';
  handler: EventHandler;
  priority: EventPriority;
  filter?: (event: OfficeEvent) => boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Event Dispatcher
// Manages subscriptions and synchronously/asynchronously dispatches events.
// ─────────────────────────────────────────────────────────────────────────────
export class EventDispatcher {
  private subscriptions: Map<string, Set<Subscription>> = new Map();
  private subCounter = 0;

  public subscribe(
    type: string | '*',
    handler: EventHandler,
    options?: { priority?: EventPriority; filter?: (event: OfficeEvent) => boolean }
  ): () => void {
    const sub: Subscription = {
      id: `sub-${++this.subCounter}`,
      type,
      handler,
      priority: options?.priority || 'normal',
      filter: options?.filter,
    };

    if (!this.subscriptions.has(type)) {
      this.subscriptions.set(type, new Set());
    }
    this.subscriptions.get(type)!.add(sub);

    return () => this.unsubscribe(type, sub);
  }

  private unsubscribe(type: string, sub: Subscription) {
    this.subscriptions.get(type)?.delete(sub);
  }

  public dispatch(event: OfficeEvent): void {
    event.state = 'processing';
    const handlersToRun: Subscription[] = [];

    // Gather specific handlers
    this.subscriptions.get(event.type)?.forEach(sub => {
      if (!sub.filter || sub.filter(event)) handlersToRun.push(sub);
    });

    // Gather wildcard handlers
    this.subscriptions.get('*')?.forEach(sub => {
      if (!sub.filter || sub.filter(event)) handlersToRun.push(sub);
    });

    // Sort by priority logic could go here (e.g. Critical first)
    // For now, execute sequentially
    for (const sub of handlersToRun) {
      if (event.isPropagationStopped()) break;
      try {
        sub.handler(event);
      } catch (err) {
        console.error(`[EventDispatcher] Handler failed for event ${event.type}:`, err);
      }
    }

    if (event.state === 'processing') {
      event.state = 'completed';
    }
  }
}
