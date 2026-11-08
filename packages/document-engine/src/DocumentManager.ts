import { Document, DocumentMetadata } from './models/Document';
import { DocumentStateMachine } from './DocumentStateMachine';
import { DocumentEventDispatcher } from './DocumentEventDispatcher';

/**
 * DocumentManager is the main public API of the Document Engine.
 *
 * It orchestrates the full lifecycle:
 *   create → open → edit → save → close → dispose
 *
 * It is intentionally decoupled from file I/O — a SaveHandler function
 * is injected at construction time, keeping the engine platform-agnostic
 * (Electron reads from disk; Browser reads from File API / cloud).
 */
export type SaveHandler = (doc: Document, content: unknown) => Promise<void>;
export type LoadHandler = (filePath: string) => Promise<unknown>;

export class DocumentManager {
  private documents: Map<string, Document> = new Map();
  private machines: Map<string, DocumentStateMachine> = new Map();
  private dispatchers: Map<string, DocumentEventDispatcher> = new Map();

  private saveHandler: SaveHandler;
  private loadHandler: LoadHandler;

  constructor(saveHandler: SaveHandler, loadHandler: LoadHandler) {
    this.saveHandler = saveHandler;
    this.loadHandler = loadHandler;
  }

  /** Create a new blank document. */
  public create(title = 'Untitled Document'): Document {
    const id = this.generateId();
    const now = new Date();

    const metadata: DocumentMetadata = {
      title,
      author: 'Unknown',
      version: '1.0.0',
      createdAt: now,
      modifiedAt: now,
    };

    const doc: Document = {
      id,
      state: 'new',
      isDirty: false,
      metadata,
      filePath: null,
    };

    const machine = new DocumentStateMachine('new');
    const dispatcher = new DocumentEventDispatcher();

    this.documents.set(id, doc);
    this.machines.set(id, machine);
    this.dispatchers.set(id, dispatcher);

    return doc;
  }

  /** Open a document from a file path. */
  public async open(filePath: string): Promise<Document> {
    const doc = this.create();
    const machine = this.machines.get(doc.id)!;
    const dispatcher = this.dispatchers.get(doc.id)!;

    doc.filePath = filePath;

    try {
      machine.transition('opening');
      doc.state = 'opening';

      machine.transition('loading');
      doc.state = 'loading';

      // Platform-agnostic load — the handler does the real I/O
      await this.loadHandler(filePath);

      machine.transition('ready');
      doc.state = 'ready';
      doc.isDirty = false;

      dispatcher.emit({ type: 'document:opened', documentId: doc.id });
    } catch (err) {
      machine.transition('error');
      doc.state = 'error';
      dispatcher.emit({ type: 'document:error', documentId: doc.id, payload: err });
      throw err;
    }

    return doc;
  }

  /** Save an open document. */
  public async save(id: string, content: unknown): Promise<void> {
    const doc = this.requireDoc(id);
    const machine = this.requireMachine(id);
    const dispatcher = this.dispatchers.get(id)!;

    machine.transition('saving');
    doc.state = 'saving';

    try {
      await this.saveHandler(doc, content);
      doc.isDirty = false;
      doc.metadata.modifiedAt = new Date();

      machine.transition('ready');
      doc.state = 'ready';

      dispatcher.emit({ type: 'document:saved', documentId: id });
      dispatcher.emit({ type: 'document:dirty-changed', documentId: id, payload: false });
    } catch (err) {
      machine.transition('error');
      doc.state = 'error';
      dispatcher.emit({ type: 'document:error', documentId: id, payload: err });
      throw err;
    }
  }

  /** Mark a document as dirty (has unsaved changes). */
  public markDirty(id: string): void {
    const doc = this.requireDoc(id);
    if (!doc.isDirty) {
      doc.isDirty = true;
      this.dispatchers.get(id)!.emit({
        type: 'document:dirty-changed',
        documentId: id,
        payload: true,
      });
    }
    // Transition to editing if currently ready
    const machine = this.requireMachine(id);
    if (machine.canTransitionTo('editing')) {
      machine.transition('editing');
      doc.state = 'editing';
    }
  }

  /** Close and dispose a document. */
  public close(id: string): void {
    const doc = this.requireDoc(id);
    const machine = this.requireMachine(id);
    const dispatcher = this.dispatchers.get(id)!;

    machine.transition('closing');
    doc.state = 'closing';

    machine.transition('closed');
    doc.state = 'closed';

    dispatcher.emit({ type: 'document:closed', documentId: id });

    // Cleanup
    this.documents.delete(id);
    this.machines.delete(id);
    this.dispatchers.delete(id);
  }

  /** Subscribe to events on a document. */
  public events(id: string): DocumentEventDispatcher {
    return this.dispatchers.get(id)
      ?? (() => { throw new Error(`DocumentManager: Document '${id}' not found.`); })();
  }

  public get(id: string): Document | undefined {
    return this.documents.get(id);
  }

  public getAll(): Document[] {
    return Array.from(this.documents.values());
  }

  private requireDoc(id: string): Document {
    const doc = this.documents.get(id);
    if (!doc) throw new Error(`DocumentManager: Document '${id}' not found.`);
    return doc;
  }

  private requireMachine(id: string): DocumentStateMachine {
    return this.machines.get(id)!;
  }

  private generateId(): string {
    return `doc-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }
}
