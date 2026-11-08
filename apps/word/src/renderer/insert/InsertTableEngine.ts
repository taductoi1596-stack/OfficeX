import { EditorAPI } from '../editorApi';

/**
 * InsertTableEngine
 * 
 * Manages all table insertion, nested tables, quick tables, excel spreadsheets,
 * and layout (autofit/fixed).
 * Enforces Document Model manipulation without touching the UI directly.
 */
class InsertTableEngineImpl {
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
  Table(options?: { type?: 'grid' | 'custom' | 'dialog' | 'default' | 'empty' | 'header' | 'footer'; rows?: number; cols?: number }) {
    console.log('[InsertTableEngine] Table', options);
    if (options?.rows && options?.cols) {
      EditorAPI.getLegacy()?.insertTable(options.rows, options.cols);
    }
    this.emit('TableInserted', options);
  }

  DrawTable(tool: 'pencil' | 'eraser' | 'border' | 'split' | 'merge' | 'start' = 'start') {
    console.log('[InsertTableEngine] DrawTable', tool);
    if (tool === 'pencil') {
      EditorAPI.getLegacy()?.setDrawTableMode(true);
    }
    this.emit('DrawTableActivated', { tool });
  }

  QuickTable(template: 'calendar' | 'matrix' | 'list' | 'report' | 'invoice' | 'timeline' | 'custom' | 'start' = 'start') {
    console.log('[InsertTableEngine] QuickTable', template);
    if (template !== 'start') {
      EditorAPI.getLegacy()?.insertQuickTable(template);
    }
    this.emit('QuickTableInserted', { template });
  }

  ExcelTable(type: 'embed' | 'link' | 'new' | 'open' | 'start' = 'start') {
    console.log('[InsertTableEngine] ExcelTable', type);
    if (type !== 'start') {
      EditorAPI.getLegacy()?.insertExcelTable(type);
    }
    this.emit('ExcelTableActivated', { type });
  }

  ConvertText(format: 'csv' | 'tsv' | 'markdown' | 'html' | 'start' = 'start') {
    console.log('[InsertTableEngine] ConvertText', format);
    if (format !== 'start') {
      EditorAPI.getLegacy()?.convertTableToText(format);
    }
    this.emit('TableConverted', { format });
  }

  NestedTable(target: 'row' | 'cell' | 'start' = 'start') {
    console.log('[InsertTableEngine] NestedTable', target);
    this.emit('NestedTableInserted', { target });
  }

  TableTemplate(action: 'save' | 'load' | 'delete' | 'apply' = 'apply', style?: string) {
    console.log('[InsertTableEngine] TableTemplate', { action, style });
    this.emit('TableTemplateApplied', { action, style });
  }

  AutoFit(mode: 'autofit' | 'window' | 'content' | 'fixed' | 'preferred') {
    console.log('[InsertTableEngine] AutoFit', mode);
    this.emit('AutoFitChanged', { mode });
  }

  TableStyle(style: 'grid' | 'light' | 'medium' | 'dark' | 'custom') {
    console.log('[InsertTableEngine] TableStyle', style);
    this.emit('TableStyleApplied', { style });
  }

  FloatingTable(mode: 'wrap' | 'anchor' | 'lock' | 'start' = 'start') {
    console.log('[InsertTableEngine] FloatingTable', mode);
    this.emit('FloatingTableConfigured', { mode });
  }
}

export const InsertTableEngine = new InsertTableEngineImpl();
