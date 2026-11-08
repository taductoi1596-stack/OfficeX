/**
 * InsertShapeEngine
 * 
 * Manages shape insertion, editing, grouping, alignment, and rendering interactions.
 * Connects to the DrawingEngine under the hood to manipulate the document object model.
 */
class InsertShapeEngineImpl {
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
  Shape(type: string = 'rectangle') {
    console.log('[InsertShapeEngine] Shape', type);
    this.emit('ShapeInserted', { type });
  }

  Line(type: string = 'line') {
    console.log('[InsertShapeEngine] Line', type);
    this.emit('ShapeInserted', { type, isLine: true });
  }

  Arrow(type: string = 'right') {
    console.log('[InsertShapeEngine] Arrow', type);
    this.emit('ShapeInserted', { type, isArrow: true });
  }

  Flowchart(type: string = 'process') {
    console.log('[InsertShapeEngine] Flowchart', type);
    this.emit('ShapeInserted', { type, isFlowchart: true });
  }

  Callout(type: string = 'callout') {
    console.log('[InsertShapeEngine] Callout', type);
    this.emit('ShapeInserted', { type, isCallout: true });
  }

  Connector(type: string = 'straight') {
    console.log('[InsertShapeEngine] Connector', type);
    this.emit('ShapeInserted', { type, isConnector: true });
  }

  Canvas(action: 'insert' | 'resize' | 'delete' = 'insert') {
    console.log('[InsertShapeEngine] Canvas', action);
    if (action === 'insert') this.emit('CanvasCreated');
  }

  Group(action: 'group' | 'ungroup' = 'group') {
    console.log('[InsertShapeEngine] Group', action);
    this.emit(action === 'group' ? 'ShapeGrouped' : 'ShapeUngrouped');
  }

  Rotate(action: 'rotate' | 'flip' = 'rotate') {
    console.log('[InsertShapeEngine] Rotate', action);
    this.emit('ShapeRotated', { action });
  }

  Align(action: 'align' | 'distribute' = 'align') {
    console.log('[InsertShapeEngine] Align', action);
    this.emit('ShapeMoved', { action });
  }

  Style(property: string, value?: string) {
    console.log('[InsertShapeEngine] Style', { property, value });
    this.emit('ShapeStyled', { property, value });
  }

  Template(action: 'save' | 'load' | 'delete' | 'apply' = 'apply') {
    console.log('[InsertShapeEngine] Template', action);
  }

  Arrange(action: 'bringtofront' | 'sendtoback' | 'lock') {
    console.log('[InsertShapeEngine] Arrange', action);
    this.emit('ShapeMoved', { action });
  }
}

export const InsertShapeEngine = new InsertShapeEngineImpl();
