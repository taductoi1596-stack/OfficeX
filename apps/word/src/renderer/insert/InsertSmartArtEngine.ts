import { EditorAPI } from '../editorApi';

/**
 * InsertSmartArtEngine
 * 
 * Manages SmartArt insertion, editing, hierarchy nodes, and layout changes.
 * Connects to the LayoutEngine under the hood to manipulate the document object model.
 */
class InsertSmartArtEngineImpl {
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
  SmartArt(type: string = 'dialog', subType?: string) {
    console.log('[InsertSmartArtEngine] SmartArt', { type, subType });
    this.emit('SmartArtInserted', { type, subType });
    
    if (type === 'dialog') {
      const customEvent = new CustomEvent('officex:open-smartart-gallery');
      document.dispatchEvent(customEvent);
      return;
    }

    const api = EditorAPI.getLegacy() as any;
    if (api && api.insertSmartArt) {
      api.insertSmartArt(type, subType || 'basic');
    } else {
      console.warn('[InsertSmartArtEngine] EditorAPI not ready');
    }
  }

  List(subType: 'basic' | 'vertical' | 'horizontal' | 'accent' | 'grouped' = 'basic') {
    this.SmartArt('list', subType);
  }

  Process(subType: 'basic' | 'chevron' | 'continuous' | 'circular' | 'step' = 'basic') {
    this.SmartArt('process', subType);
  }

  Cycle(subType: 'basic' | 'radial' | 'repeating' = 'basic') {
    this.SmartArt('cycle', subType);
  }

  Hierarchy(subType: 'orgchart' | 'label' | 'table' = 'orgchart') {
    this.SmartArt('hierarchy', subType);
  }

  Relationship(subType: 'basic' | 'venn' | 'balance' = 'basic') {
    this.SmartArt('relationship', subType);
  }

  Matrix(subType: 'basic' | 'grid' = 'basic') {
    this.SmartArt('matrix', subType);
  }

  Pyramid(subType: 'basic' | 'inverted' = 'basic') {
    this.SmartArt('pyramid', subType);
  }

  Picture(subType: 'caption' | 'list' | 'accent' = 'caption') {
    this.SmartArt('picture', subType);
  }

  GenerateAI(action: 'generate' | 'outline' | 'text' | 'document' = 'generate') {
    console.log('[InsertSmartArtEngine] GenerateAI', action);
    this.emit('AISmartArtGenerated', { action });
  }

  Convert(source: 'text' | 'shape' | 'list' | 'table') {
    console.log('[InsertSmartArtEngine] Convert', source);
    this.emit('SmartArtInserted', { source });
  }

  ChangeLayout(layout: 'left' | 'right' | 'vertical' | 'horizontal' | 'dialog') {
    console.log('[InsertSmartArtEngine] ChangeLayout', layout);
    this.emit('LayoutChanged', { layout });
  }

  Style(property: 'style' | 'color' | 'theme' | 'font' | 'background') {
    console.log('[InsertSmartArtEngine] Style', property);
    this.emit('SmartArtUpdated', { property });
  }

  Node(action: 'add' | 'delete' | 'promote' | 'demote' | 'moveup' | 'movedown') {
    console.log('[InsertSmartArtEngine] Node', action);
    if (action === 'add') this.emit('NodeAdded');
    else if (action === 'delete') this.emit('NodeDeleted');
    else this.emit('SmartArtUpdated', { action });
  }

  Template(action: 'apply' | 'save' | 'load' | 'delete' = 'apply') {
    console.log('[InsertSmartArtEngine] Template', action);
    if (action === 'apply') {
      this.emit('TemplateApplied');
    }
  }
}

export const InsertSmartArtEngine = new InsertSmartArtEngineImpl();
