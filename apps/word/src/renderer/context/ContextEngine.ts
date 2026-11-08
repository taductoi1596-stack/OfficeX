/**
 * ContextEngine
 * 
 * Manages Dynamic Context Menus, Selection Analysis, and Mini Toolbar.
 * Connects to Ribbon Sync, History Engine, Document Engine.
 */
import { registerDefaultContextMenus } from './defaultMenus';
import { ContextType } from './ContextMenuRegistry';

class ContextEngineImpl {
  private events: Record<string, Function[]> = {};
  public activeContextType: ContextType = 'Text';

  initialize() {
    registerDefaultContextMenus();
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
  Open(contextType: ContextType = 'Text') {
    console.log('[ContextEngine] Open', contextType);
    this.activeContextType = contextType;
    this.emit('ContextOpened', { type: contextType });
  }

  Close() {
    console.log('[ContextEngine] Close');
    this.emit('ContextClosed');
  }

  Build(contextType: string) {
    console.log('[ContextEngine] Build', contextType);
    this.emit('MenuBuilt', { type: contextType });
  }

  Clipboard(action: string) {
    console.log('[ContextEngine] Clipboard', action);
  }

  TextFormat(action: string) {
    console.log('[ContextEngine] TextFormat', action);
  }

  Link(action: string) {
    console.log('[ContextEngine] Link', action);
  }

  Image(action: string) {
    console.log('[ContextEngine] Image', action);
  }

  Table(action: string) {
    console.log('[ContextEngine] Table', action);
  }

  Shape(action: string) {
    console.log('[ContextEngine] Shape', action);
  }

  Chart(action: string) {
    console.log('[ContextEngine] Chart', action);
  }

  SmartArt(action: string) {
    console.log('[ContextEngine] SmartArt', action);
  }

  HeaderFooter(action: string) {
    console.log('[ContextEngine] HeaderFooter', action);
  }

  Review(action: string) {
    console.log('[ContextEngine] Review', action);
  }

  Bookmark(action: string) {
    console.log('[ContextEngine] Bookmark', action);
  }

  Object(action: string) {
    console.log('[ContextEngine] Object', action);
  }

  Page(action: string) {
    console.log('[ContextEngine] Page', action);
  }

  Window(action: string) {
    console.log('[ContextEngine] Window', action);
  }

  AI(action: string) {
    console.log('[ContextEngine] AI', action);
    this.emit('AIInvoked', { action });
  }

  Developer(action: string) {
    console.log('[ContextEngine] Developer', action);
  }

  Plugin(action: string) {
    console.log('[ContextEngine] Plugin', action);
    this.emit('PluginInvoked', { action });
  }
}

export const ContextEngine = new ContextEngineImpl();
