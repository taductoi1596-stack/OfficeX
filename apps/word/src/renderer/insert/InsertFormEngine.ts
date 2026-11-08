/**
 * InsertFormEngine
 * 
 * Manages insertions for Content Controls, Legacy Forms, and Data Bindings.
 * Connects to FormEngine, ValidationEngine, and XMLMappingEngine under the hood.
 */
class InsertFormEngineImpl {
  private events: Record<string, Function[]> = {};

  initialize() {
    // Engine boot sequence
  }

  dispose() {
    this.events = {};
  }

  on(event: string, callback: Function) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
    return () => {
      this.events[event] = this.events[event].filter(cb => cb !== callback);
    };
  }

  private emit(event: string, payload?: any) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(payload));
    }
  }

  // APIs from spec
  Form(action: string = 'dialog') {
    console.log('[InsertFormEngine] Form', action);
    if (action === 'new' || action === 'template') this.emit('FormCreated', { action });
  }

  ContentControl(type: string) {
    console.log('[InsertFormEngine] Content Control', type);
    this.emit('FieldInserted', { type });
  }

  Legacy(type: string) {
    console.log('[InsertFormEngine] Legacy Form', type);
    this.emit('FieldInserted', { type: 'legacy_' + type });
  }

  Input(type: string) {
    console.log('[InsertFormEngine] Input', type);
    this.emit('FieldInserted', { type });
  }

  Select(type: string) {
    console.log('[InsertFormEngine] Select', type);
    this.emit('FieldInserted', { type });
  }

  DateTime(type: string) {
    console.log('[InsertFormEngine] DateTime', type);
    this.emit('FieldInserted', { type });
  }

  Signature(type: string) {
    console.log('[InsertFormEngine] Signature', type);
    this.emit('FieldInserted', { type });
  }

  Validation(action: string) {
    console.log('[InsertFormEngine] Validation', action);
    this.emit('ValidationAdded', { action });
  }

  DataBinding(action: string) {
    console.log('[InsertFormEngine] Data Binding', action);
    this.emit('DataBound', { action });
  }

  Protection(action: 'protect' | 'unprotect' | 'lock' | 'unlock') {
    console.log('[InsertFormEngine] Protection', action);
    if (action === 'protect' || action === 'lock') this.emit('FormProtected', { action });
    if (action === 'unprotect' || action === 'unlock') this.emit('FormUnprotected', { action });
  }

  Template(action: 'save' | 'load' | 'delete') {
    console.log('[InsertFormEngine] Template', action);
    if (action === 'delete') this.emit('FormDeleted');
  }

  AI(action: 'generate' | 'survey' | 'application' | 'registration' | 'validate') {
    console.log('[InsertFormEngine] AI', action);
    this.emit('AIFormGenerated', { action });
  }
}

export const InsertFormEngine = new InsertFormEngineImpl();
