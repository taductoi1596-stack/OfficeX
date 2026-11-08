import { CommandDefinition } from '../CommandDispatcher';
import { InsertObjectEngine } from './InsertObjectEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class InsertObjectCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      // OBJECT
      cmd('WORD.INSERT.OBJECT', 'Insert Object', () => InsertObjectEngine.Object('dialog')),
      cmd('WORD.INSERT.OBJECT.DIALOG', 'Object Dialog', () => InsertObjectEngine.Object('dialog')),
      cmd('WORD.INSERT.OBJECT.EMBED', 'Embedded Object', () => InsertObjectEngine.Object('embed')),
      cmd('WORD.INSERT.OBJECT.LINK', 'Linked Object', () => InsertObjectEngine.Object('link')),
      cmd('WORD.INSERT.OBJECT.PACKAGE', 'Package Object', () => InsertObjectEngine.Object('package')),
      cmd('WORD.INSERT.OBJECT.FILE', 'Object From File', () => InsertObjectEngine.Object('file')),
      cmd('WORD.INSERT.OBJECT.CREATE', 'Create New Object', () => InsertObjectEngine.Object('create')),
      cmd('WORD.INSERT.OBJECT.CREATEFILE', 'Create From File', () => InsertObjectEngine.Object('createfile')),

      // OLE
      cmd('WORD.INSERT.OLE', 'OLE Object', () => InsertObjectEngine.OLE('dialog')),
      cmd('WORD.INSERT.OLE.EMBED', 'Embedded OLE', () => InsertObjectEngine.OLE('embed')),
      cmd('WORD.INSERT.OLE.LINK', 'Linked OLE', () => InsertObjectEngine.OLE('link')),
      cmd('WORD.INSERT.OLE.UPDATE', 'Update OLE', () => InsertObjectEngine.OLE('update')),
      cmd('WORD.INSERT.OLE.BREAKLINK', 'Break Link', () => InsertObjectEngine.OLE('breaklink')),
      cmd('WORD.INSERT.OLE.ACTIVATE', 'Activate Object', () => InsertObjectEngine.OLE('activate')),
      cmd('WORD.INSERT.OLE.DEACTIVATE', 'Deactivate Object', () => InsertObjectEngine.OLE('deactivate')),

      // OFFICE DOCUMENTS
      cmd('WORD.INSERT.OBJECT.WORD', 'Embedded Word Document', () => InsertObjectEngine.OfficeDocument('word')),
      cmd('WORD.INSERT.OBJECT.EXCEL', 'Embedded Excel Workbook', () => InsertObjectEngine.OfficeDocument('excel')),
      cmd('WORD.INSERT.OBJECT.POWERPOINT', 'Embedded PowerPoint', () => InsertObjectEngine.OfficeDocument('powerpoint')),
      cmd('WORD.INSERT.OBJECT.ACCESS', 'Embedded Access Database', () => InsertObjectEngine.OfficeDocument('access')),
      cmd('WORD.INSERT.OBJECT.VISIO', 'Embedded Visio Drawing', () => InsertObjectEngine.OfficeDocument('visio')),
      cmd('WORD.INSERT.OBJECT.PROJECT', 'Embedded Project File', () => InsertObjectEngine.OfficeDocument('project')),
      cmd('WORD.INSERT.OBJECT.ONENOTE', 'Embedded OneNote Page', () => InsertObjectEngine.OfficeDocument('onenote')),

      // DOCUMENTS
      cmd('WORD.INSERT.OBJECT.PDF', 'Embedded PDF', () => InsertObjectEngine.Document('pdf')),
      cmd('WORD.INSERT.OBJECT.TEXT', 'Embedded Text File', () => InsertObjectEngine.Document('text')),
      cmd('WORD.INSERT.OBJECT.HTML', 'Embedded HTML', () => InsertObjectEngine.Document('html')),
      cmd('WORD.INSERT.OBJECT.XML', 'Embedded XML', () => InsertObjectEngine.Document('xml')),
      cmd('WORD.INSERT.OBJECT.JSON', 'Embedded JSON', () => InsertObjectEngine.Document('json')),
      cmd('WORD.INSERT.OBJECT.MARKDOWN', 'Embedded Markdown', () => InsertObjectEngine.Document('markdown')),

      // CAD
      cmd('WORD.INSERT.OBJECT.DWG', 'AutoCAD Drawing', () => InsertObjectEngine.CAD('dwg')),
      cmd('WORD.INSERT.OBJECT.DXF', 'DXF Drawing', () => InsertObjectEngine.CAD('dxf')),
      cmd('WORD.INSERT.OBJECT.STEP', 'STEP Model', () => InsertObjectEngine.CAD('step')),
      cmd('WORD.INSERT.OBJECT.IGES', 'IGES Model', () => InsertObjectEngine.CAD('iges')),

      // ARCHIVE
      cmd('WORD.INSERT.OBJECT.ZIP', 'ZIP Package', () => InsertObjectEngine.Archive('zip')),
      cmd('WORD.INSERT.OBJECT.RAR', 'RAR Package', () => InsertObjectEngine.Archive('rar')),
      cmd('WORD.INSERT.OBJECT.TAR', 'TAR Package', () => InsertObjectEngine.Archive('tar')),
      cmd('WORD.INSERT.OBJECT.GZIP', 'GZip Package', () => InsertObjectEngine.Archive('gzip')),

      // ACTIVEX
      cmd('WORD.INSERT.ACTIVEX', 'Insert ActiveX', () => InsertObjectEngine.ActiveX('dialog')),
      cmd('WORD.INSERT.ACTIVEX.BUTTON', 'Command Button', () => InsertObjectEngine.ActiveX('button')),
      cmd('WORD.INSERT.ACTIVEX.TEXTBOX', 'TextBox Control', () => InsertObjectEngine.ActiveX('textbox')),
      cmd('WORD.INSERT.ACTIVEX.COMBOBOX', 'ComboBox', () => InsertObjectEngine.ActiveX('combobox')),
      cmd('WORD.INSERT.ACTIVEX.CHECKBOX', 'CheckBox', () => InsertObjectEngine.ActiveX('checkbox')),
      cmd('WORD.INSERT.ACTIVEX.LISTBOX', 'ListBox', () => InsertObjectEngine.ActiveX('listbox')),

      // LINKS
      cmd('WORD.OBJECT.LINK.UPDATE', 'Update Links', () => InsertObjectEngine.Link('update')),
      cmd('WORD.OBJECT.LINK.BREAK', 'Break Link', () => InsertObjectEngine.Link('break')),
      cmd('WORD.OBJECT.LINK.REFRESH', 'Refresh Link', () => InsertObjectEngine.Link('refresh')),
      cmd('WORD.OBJECT.LINK.REPAIR', 'Repair Link', () => InsertObjectEngine.Link('repair')),

      // OBJECT EDITING
      cmd('WORD.OBJECT.OPEN', 'Open Object', () => InsertObjectEngine.Edit('open')),
      cmd('WORD.OBJECT.EDIT', 'Edit Object', () => InsertObjectEngine.Edit('edit')),
      cmd('WORD.OBJECT.RENAME', 'Rename Object', () => InsertObjectEngine.Edit('rename')),
      cmd('WORD.OBJECT.REPLACE', 'Replace Object', () => InsertObjectEngine.Edit('replace')),
      cmd('WORD.OBJECT.DELETE', 'Delete Object', () => InsertObjectEngine.Edit('delete')),
      cmd('WORD.OBJECT.DUPLICATE', 'Duplicate Object', () => InsertObjectEngine.Edit('duplicate')),
      cmd('WORD.OBJECT.CONVERT', 'Convert Object', () => InsertObjectEngine.Edit('convert')),

      // DISPLAY
      cmd('WORD.OBJECT.ICON', 'Display As Icon', () => InsertObjectEngine.Display('icon')),
      cmd('WORD.OBJECT.PREVIEW', 'Preview Object', () => InsertObjectEngine.Display('preview')),
      cmd('WORD.OBJECT.THUMBNAIL', 'Thumbnail View', () => InsertObjectEngine.Display('thumbnail')),
      cmd('WORD.OBJECT.FULL', 'Full View', () => InsertObjectEngine.Display('full')),

      // SECURITY
      cmd('WORD.OBJECT.LOCK', 'Lock Object', () => InsertObjectEngine.Security('lock')),
      cmd('WORD.OBJECT.UNLOCK', 'Unlock Object', () => InsertObjectEngine.Security('unlock')),
      cmd('WORD.OBJECT.READONLY', 'Read Only', () => InsertObjectEngine.Security('readonly')),
      cmd('WORD.OBJECT.PERMISSION', 'Object Permission', () => InsertObjectEngine.Security('permission')),

      // AI
      cmd('WORD.OBJECT.AI.SUMMARIZE', 'Summarize Object', () => InsertObjectEngine.AI('summarize')),
      cmd('WORD.OBJECT.AI.EXTRACT', 'Extract Content', () => InsertObjectEngine.AI('extract')),
      cmd('WORD.OBJECT.AI.DESCRIBE', 'Describe Object', () => InsertObjectEngine.AI('describe')),
      cmd('WORD.OBJECT.AI.CONVERT', 'Convert Object', () => InsertObjectEngine.AI('convert')),
      cmd('WORD.OBJECT.AI.CLASSIFY', 'Classify Object', () => InsertObjectEngine.AI('classify')),
    ];
  }
}
