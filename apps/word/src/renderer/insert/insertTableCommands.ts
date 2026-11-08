import { CommandDefinition } from '../CommandDispatcher';
import { InsertTableEngine } from './InsertTableEngine';

function cmd(id: string, name: string, handler: (api: any, payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class InsertTableCommandRegistry {
  static all(): CommandDefinition[] {
    return [

      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.TABLE', 'Insert Table', (api, p) => InsertTableEngine.Table(p)),
      cmd('WORD.INSERT.DRAW_TABLE', 'Draw Table', () => InsertTableEngine.DrawTable()),
      cmd('WORD.INSERT.CONVERT_TABLE', 'Convert Text', () => InsertTableEngine.ConvertText()),
      cmd('WORD.INSERT.QUICK_TABLE', 'Quick Tables', () => InsertTableEngine.QuickTable()),
      cmd('WORD.INSERT.EXCEL', 'Excel Spreadsheet', () => {}),


      // INSERT TABLE (extended types)
      cmd('WORD.INSERT.TABLE.GRID', 'Insert Grid Table', () => InsertTableEngine.Table({ type: 'grid' })),
      cmd('WORD.INSERT.TABLE.CUSTOM', 'Custom Table', () => InsertTableEngine.Table({ type: 'custom' })),
      cmd('WORD.INSERT.TABLE.DIALOG', 'Insert Table Dialog', () => InsertTableEngine.Table({ type: 'dialog' })),
      cmd('WORD.INSERT.TABLE.DEFAULT', 'Default Table', () => InsertTableEngine.Table({ type: 'default' })),
      cmd('WORD.INSERT.TABLE.EMPTY', 'Empty Table', () => InsertTableEngine.Table({ type: 'empty' })),
      cmd('WORD.INSERT.TABLE.HEADER', 'Table With Header', () => InsertTableEngine.Table({ type: 'header' })),
      cmd('WORD.INSERT.TABLE.FOOTER', 'Table With Footer', () => InsertTableEngine.Table({ type: 'footer' })),

      // DRAW TABLE
      cmd('WORD.INSERT.TABLE.DRAW', 'Draw Table', () => InsertTableEngine.DrawTable()),
      cmd('WORD.INSERT.TABLE.DRAW.PENCIL', 'Table Pencil', () => InsertTableEngine.DrawTable('pencil')),
      cmd('WORD.INSERT.TABLE.DRAW.ERASER', 'Table Eraser', () => InsertTableEngine.DrawTable('eraser')),
      cmd('WORD.INSERT.TABLE.DRAW.BORDER', 'Draw Borders', () => InsertTableEngine.DrawTable('border')),
      cmd('WORD.INSERT.TABLE.DRAW.SPLIT', 'Split Cells', () => InsertTableEngine.DrawTable('split')),
      cmd('WORD.INSERT.TABLE.DRAW.MERGE', 'Merge Cells', () => InsertTableEngine.DrawTable('merge')),

      // QUICK TABLES
      cmd('WORD.INSERT.TABLE.QUICK', 'Quick Tables', () => InsertTableEngine.QuickTable()),
      cmd('WORD.INSERT.TABLE.QUICK.CALENDAR', 'Calendar', () => InsertTableEngine.QuickTable('calendar')),
      cmd('WORD.INSERT.TABLE.QUICK.MATRIX', 'Matrix', () => InsertTableEngine.QuickTable('matrix')),
      cmd('WORD.INSERT.TABLE.QUICK.LIST', 'List', () => InsertTableEngine.QuickTable('list')),
      cmd('WORD.INSERT.TABLE.QUICK.REPORT', 'Report', () => InsertTableEngine.QuickTable('report')),
      cmd('WORD.INSERT.TABLE.QUICK.INVOICE', 'Invoice', () => InsertTableEngine.QuickTable('invoice')),
      cmd('WORD.INSERT.TABLE.QUICK.TIMELINE', 'Timeline', () => InsertTableEngine.QuickTable('timeline')),
      cmd('WORD.INSERT.TABLE.QUICK.CUSTOM', 'Custom Template', () => InsertTableEngine.QuickTable('custom')),

      // EXCEL TABLE
      cmd('WORD.INSERT.TABLE.EXCEL', 'Insert Excel Spreadsheet', () => InsertTableEngine.ExcelTable()),
      cmd('WORD.INSERT.TABLE.EXCEL.EMBED', 'Embedded Spreadsheet', () => InsertTableEngine.ExcelTable('embed')),
      cmd('WORD.INSERT.TABLE.EXCEL.LINK', 'Linked Spreadsheet', () => InsertTableEngine.ExcelTable('link')),
      cmd('WORD.INSERT.TABLE.EXCEL.NEW', 'New Spreadsheet', () => InsertTableEngine.ExcelTable('new')),
      cmd('WORD.INSERT.TABLE.EXCEL.OPEN', 'Open Spreadsheet', () => InsertTableEngine.ExcelTable('open')),

      // CONVERT
      cmd('WORD.INSERT.TABLE.CONVERT.TEXT', 'Convert Text To Table', () => InsertTableEngine.ConvertText()),
      cmd('WORD.INSERT.TABLE.CONVERT.CSV', 'CSV To Table', () => InsertTableEngine.ConvertText('csv')),
      cmd('WORD.INSERT.TABLE.CONVERT.TSV', 'TSV To Table', () => InsertTableEngine.ConvertText('tsv')),
      cmd('WORD.INSERT.TABLE.CONVERT.MARKDOWN', 'Markdown Table', () => InsertTableEngine.ConvertText('markdown')),
      cmd('WORD.INSERT.TABLE.CONVERT.HTML', 'HTML Table', () => InsertTableEngine.ConvertText('html')),

      // NESTED TABLE
      cmd('WORD.INSERT.TABLE.NESTED', 'Insert Nested Table', () => InsertTableEngine.NestedTable()),
      cmd('WORD.INSERT.TABLE.NESTED.ROW', 'Nested Table In Row', () => InsertTableEngine.NestedTable('row')),
      cmd('WORD.INSERT.TABLE.NESTED.CELL', 'Nested Table In Cell', () => InsertTableEngine.NestedTable('cell')),

      // TABLE LAYOUT
      cmd('WORD.INSERT.TABLE.LAYOUT.AUTOFIT', 'AutoFit', () => InsertTableEngine.AutoFit('autofit')),
      cmd('WORD.INSERT.TABLE.LAYOUT.WINDOW', 'Fit To Window', () => InsertTableEngine.AutoFit('window')),
      cmd('WORD.INSERT.TABLE.LAYOUT.CONTENT', 'Fit To Content', () => InsertTableEngine.AutoFit('content')),
      cmd('WORD.INSERT.TABLE.LAYOUT.FIXED', 'Fixed Width', () => InsertTableEngine.AutoFit('fixed')),
      cmd('WORD.INSERT.TABLE.LAYOUT.PREFERRED', 'Preferred Width', () => InsertTableEngine.AutoFit('preferred')),

      // TABLE STYLE
      cmd('WORD.INSERT.TABLE.STYLE', 'Apply Style', () => InsertTableEngine.TableStyle('grid')),
      cmd('WORD.INSERT.TABLE.STYLE.GRID', 'Grid Style', () => InsertTableEngine.TableStyle('grid')),
      cmd('WORD.INSERT.TABLE.STYLE.LIGHT', 'Light Style', () => InsertTableEngine.TableStyle('light')),
      cmd('WORD.INSERT.TABLE.STYLE.MEDIUM', 'Medium Style', () => InsertTableEngine.TableStyle('medium')),
      cmd('WORD.INSERT.TABLE.STYLE.DARK', 'Dark Style', () => InsertTableEngine.TableStyle('dark')),
      cmd('WORD.INSERT.TABLE.STYLE.CUSTOM', 'Custom Style', () => InsertTableEngine.TableStyle('custom')),

      // TABLE TEMPLATE
      cmd('WORD.INSERT.TABLE.TEMPLATE', 'Table Template', () => InsertTableEngine.TableTemplate()),
      cmd('WORD.INSERT.TABLE.TEMPLATE.SAVE', 'Save Template', () => InsertTableEngine.TableTemplate('save')),
      cmd('WORD.INSERT.TABLE.TEMPLATE.LOAD', 'Load Template', () => InsertTableEngine.TableTemplate('load')),
      cmd('WORD.INSERT.TABLE.TEMPLATE.DELETE', 'Delete Template', () => InsertTableEngine.TableTemplate('delete')),

      // FLOATING TABLE
      cmd('WORD.INSERT.TABLE.FLOAT', 'Floating Table', () => InsertTableEngine.FloatingTable()),
      cmd('WORD.INSERT.TABLE.FLOAT.WRAP', 'Wrap Around', () => InsertTableEngine.FloatingTable('wrap')),
      cmd('WORD.INSERT.TABLE.FLOAT.ANCHOR', 'Anchor', () => InsertTableEngine.FloatingTable('anchor')),
      cmd('WORD.INSERT.TABLE.FLOAT.LOCK', 'Lock Position', () => InsertTableEngine.FloatingTable('lock')),
    ];
  }
}
