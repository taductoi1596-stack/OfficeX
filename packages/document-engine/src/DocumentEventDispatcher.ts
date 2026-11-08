export type DocumentEventType =
  | 'document:opened'
  | 'document:saved'
  | 'document:closed'
  | 'document:dirty-changed'
  | 'document:metadata-changed'
  | 'document:state-changed'
  | 'document:error';

export interface DocumentEvent {
  type: DocumentEventType;
  documentId: string;
  payload?: unknown;
}

type EventHandler = (event: DocumentEvent) => void;

/**
 * Lightweight, synchronous event bus scoped to a single document.
 * Engines (Layout, History, AI, Collaboration) subscribe here to react
 * to document lifecycle changes without tight coupling.
 */
export class DocumentEventDispatcher {
  private handlers: Map<DocumentEventType, EventHandler[]> = new Map();

  public on(type: DocumentEventType, handler: EventHandler): void {
    if (!this.handlers.has(type)) this.handlers.set(type, []);
    this.handlers.get(type)!.push(handler);
  }

  public off(type: DocumentEventType, handler: EventHandler): void {
    const list = this.handlers.get(type) ?? [];
    this.handlers.set(type, list.filter(h => h !== handler));
  }

  public emit(event: DocumentEvent): void {
    const list = this.handlers.get(event.type) ?? [];
    list.forEach(h => h(event));
  }
}
