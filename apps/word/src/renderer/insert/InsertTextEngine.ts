/**
 * InsertTextEngine
 * 
 * Manages text-related insertion interactions (Text Box, WordArt, Date, DropCap, AI Text, etc.).
 * Connects to the TextEngine and FieldEngine under the hood to manipulate the document object model.
 */
class InsertTextEngineImpl {
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
  TextBox(subType: 'simple' | 'sidebar' | 'quote' | 'caption' | 'vertical' | 'horizontal' | 'custom' = 'simple') {
    console.log('[InsertTextEngine] TextBox', subType);
    this.emit('TextBoxInserted', { subType });
  }

  RichText(format: 'html' | 'markdown' | 'unicode' = 'html') {
    console.log('[InsertTextEngine] RichText', format);
    this.emit('RichTextInserted', { format });
  }

  PlainText(source: 'file' | 'clipboard' = 'clipboard') {
    console.log('[InsertTextEngine] PlainText', source);
    this.emit('PlainTextInserted', { source });
  }

  WordArt(subType: 'classic' | 'modern' | 'outline' | 'gradient' | 'shadow' | 'glow' = 'classic') {
    console.log('[InsertTextEngine] WordArt', subType);
    this.emit('WordArtInserted', { subType });
  }

  DropCap(style: 'none' | 'dropped' | 'margin' = 'dropped') {
    console.log('[InsertTextEngine] DropCap', style);
    this.emit('DropCapInserted', { style });
  }

  Signature(type: 'digital' | 'image' | 'handwriting' | 'dialog' = 'dialog') {
    console.log('[InsertTextEngine] Signature', type);
    this.emit('SignatureInserted', { type });
  }

  DateTime(type: 'date' | 'time' | 'datetime' | 'autoupdate' = 'datetime') {
    console.log('[InsertTextEngine] DateTime', type);
    this.emit('DateInserted', { type });
  }

  QuickPart(action: 'dialog' | 'property' | 'field' | 'buildingblock' | 'autotext' | 'save' = 'dialog') {
    console.log('[InsertTextEngine] QuickPart', action);
    if (action === 'autotext') this.emit('AutoTextInserted');
    else this.emit('QuickPartInserted', { action });
  }

  Field(type: string = 'dialog') {
    console.log('[InsertTextEngine] Field', type);
    this.emit('FieldInserted', { type });
  }

  Property(type: string = 'title') {
    console.log('[InsertTextEngine] Property', type);
    this.emit('PropertyInserted', { type });
  }

  Object(type: 'dialog' | 'ole' | 'embedded' | 'linked' = 'dialog') {
    console.log('[InsertTextEngine] Object', type);
    this.emit('ObjectInserted', { type });
  }

  BuildingBlock(type: 'header' | 'footer' | 'cover' | 'text' = 'text') {
    console.log('[InsertTextEngine] BuildingBlock', type);
    this.emit('BuildingBlockInserted', { type });
  }

  AIText(action: 'generate' | 'summarize' | 'rewrite' | 'explain' | 'translate' | 'continue' = 'generate') {
    console.log('[InsertTextEngine] AIText', action);
    this.emit('AITextGenerated', { action });
  }

  Snippet(type: 'code' | 'email' | 'letter' | 'report' | 'dialog' = 'dialog') {
    console.log('[InsertTextEngine] Snippet', type);
    this.emit('SnippetInserted', { type });
  }
}

export const InsertTextEngine = new InsertTextEngineImpl();
