import { CommandDefinition } from '../CommandDispatcher';
import { ContextEngine } from './ContextEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class ContextCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      // ROOT MENU
      cmd('WORD.CONTEXT.OPEN', 'Open Context Menu', (payload) => ContextEngine.Open(payload?.type)),
      cmd('WORD.CONTEXT.CLOSE', 'Close Context Menu', () => ContextEngine.Close()),
      cmd('WORD.CONTEXT.MINITOOLBAR', 'Mini Toolbar', () => ContextEngine.Build('minitoolbar')),
      cmd('WORD.CONTEXT.CUSTOMIZE', 'Customize Context Menu', () => ContextEngine.Build('customize')),

      // CLIPBOARD
      cmd('WORD.CONTEXT.CUT', 'Cut', () => ContextEngine.Clipboard('cut')),
      cmd('WORD.CONTEXT.COPY', 'Copy', () => ContextEngine.Clipboard('copy')),
      cmd('WORD.CONTEXT.PASTE', 'Paste', () => ContextEngine.Clipboard('paste')),
      cmd('WORD.CONTEXT.PASTE.SPECIAL', 'Paste Special', () => ContextEngine.Clipboard('pastespecial')),
      cmd('WORD.CONTEXT.PASTE.KEEPFORMAT', 'Keep Formatting', () => ContextEngine.Clipboard('keepformat')),
      cmd('WORD.CONTEXT.PASTE.MATCH', 'Match Destination Formatting', () => ContextEngine.Clipboard('matchformat')),
      cmd('WORD.CONTEXT.COPYFORMAT', 'Copy Formatting', () => ContextEngine.Clipboard('copyformat')),
      cmd('WORD.CONTEXT.CLEARFORMAT', 'Clear Formatting', () => ContextEngine.Clipboard('clearformat')),

      // TEXT
      cmd('WORD.CONTEXT.FONT', 'Font', () => ContextEngine.TextFormat('font')),
      cmd('WORD.CONTEXT.PARAGRAPH', 'Paragraph', () => ContextEngine.TextFormat('paragraph')),
      cmd('WORD.CONTEXT.STYLE', 'Styles', () => ContextEngine.TextFormat('style')),
      cmd('WORD.CONTEXT.BULLET', 'Bullets', () => ContextEngine.TextFormat('bullet')),
      cmd('WORD.CONTEXT.NUMBERING', 'Numbering', () => ContextEngine.TextFormat('numbering')),
      cmd('WORD.CONTEXT.ALIGN', 'Alignment', () => ContextEngine.TextFormat('align')),
      cmd('WORD.CONTEXT.LINE', 'Line Spacing', () => ContextEngine.TextFormat('line')),
      cmd('WORD.CONTEXT.HIGHLIGHT', 'Highlight', () => ContextEngine.TextFormat('highlight')),

      // LINK
      cmd('WORD.CONTEXT.HYPERLINK', 'Hyperlink', () => ContextEngine.Link('hyperlink')),
      cmd('WORD.CONTEXT.EDITLINK', 'Edit Link', () => ContextEngine.Link('edit')),
      cmd('WORD.CONTEXT.OPENLINK', 'Open Link', () => ContextEngine.Link('open')),
      cmd('WORD.CONTEXT.COPYLINK', 'Copy Link', () => ContextEngine.Link('copy')),
      cmd('WORD.CONTEXT.REMOVELINK', 'Remove Link', () => ContextEngine.Link('remove')),

      // IMAGE
      cmd('WORD.CONTEXT.IMAGE', 'Image Menu', () => ContextEngine.Open('Image')),
      cmd('WORD.CONTEXT.IMAGE.REPLACE', 'Replace Picture', () => ContextEngine.Image('replace')),
      cmd('WORD.CONTEXT.IMAGE.CROP', 'Crop', () => ContextEngine.Image('crop')),
      cmd('WORD.CONTEXT.IMAGE.COMPRESS', 'Compress Picture', () => ContextEngine.Image('compress')),
      cmd('WORD.CONTEXT.IMAGE.ALTTEXT', 'Alt Text', () => ContextEngine.Image('alttext')),
      cmd('WORD.CONTEXT.IMAGE.SIZE', 'Size & Position', () => ContextEngine.Image('size')),
      cmd('WORD.CONTEXT.IMAGE.WRAP', 'Wrap Text', () => ContextEngine.Image('wrap')),
      cmd('WORD.CONTEXT.IMAGE.SAVE', 'Save Picture', () => ContextEngine.Image('save')),

      // TABLE
      cmd('WORD.CONTEXT.TABLE', 'Table Menu', () => ContextEngine.Open('Table')),
      cmd('WORD.CONTEXT.TABLE.INSERTROW', 'Insert Row', () => ContextEngine.Table('insertrow')),
      cmd('WORD.CONTEXT.TABLE.DELETE', 'Delete Row', () => ContextEngine.Table('delete')),
      cmd('WORD.CONTEXT.TABLE.COLUMN', 'Insert Column', () => ContextEngine.Table('column')),
      cmd('WORD.CONTEXT.TABLE.MERGE', 'Merge Cells', () => ContextEngine.Table('merge')),
      cmd('WORD.CONTEXT.TABLE.SPLIT', 'Split Cells', () => ContextEngine.Table('split')),
      cmd('WORD.CONTEXT.TABLE.PROPERTIES', 'Table Properties', () => ContextEngine.Table('properties')),
      cmd('WORD.CONTEXT.TABLE.SORT', 'Sort', () => ContextEngine.Table('sort')),
      cmd('WORD.CONTEXT.TABLE.FORMULA', 'Formula', () => ContextEngine.Table('formula')),

      // SHAPE
      cmd('WORD.CONTEXT.SHAPE', 'Shape Menu', () => ContextEngine.Open('Shape')),
      cmd('WORD.CONTEXT.SHAPE.FILL', 'Shape Fill', () => ContextEngine.Shape('fill')),
      cmd('WORD.CONTEXT.SHAPE.OUTLINE', 'Shape Outline', () => ContextEngine.Shape('outline')),
      cmd('WORD.CONTEXT.SHAPE.EFFECT', 'Shape Effects', () => ContextEngine.Shape('effect')),
      cmd('WORD.CONTEXT.SHAPE.GROUP', 'Group', () => ContextEngine.Shape('group')),
      cmd('WORD.CONTEXT.SHAPE.UNGROUP', 'Ungroup', () => ContextEngine.Shape('ungroup')),
      cmd('WORD.CONTEXT.SHAPE.ORDER', 'Bring Forward / Send Backward', () => ContextEngine.Shape('order')),

      // CHART
      cmd('WORD.CONTEXT.CHART', 'Chart Menu', () => ContextEngine.Open('Chart')),
      cmd('WORD.CONTEXT.CHART.EDITDATA', 'Edit Data', () => ContextEngine.Chart('editdata')),
      cmd('WORD.CONTEXT.CHART.CHANGETYPE', 'Change Chart Type', () => ContextEngine.Chart('changetype')),
      cmd('WORD.CONTEXT.CHART.STYLE', 'Chart Style', () => ContextEngine.Chart('style')),
      cmd('WORD.CONTEXT.CHART.FILTER', 'Chart Filter', () => ContextEngine.Chart('filter')),

      // SMARTART
      cmd('WORD.CONTEXT.SMARTART', 'SmartArt Menu', () => ContextEngine.Open('SmartArt')),
      cmd('WORD.CONTEXT.SMARTART.ADD', 'Add Shape', () => ContextEngine.SmartArt('add')),
      cmd('WORD.CONTEXT.SMARTART.DELETE', 'Delete Shape', () => ContextEngine.SmartArt('delete')),
      cmd('WORD.CONTEXT.SMARTART.LAYOUT', 'Layout', () => ContextEngine.SmartArt('layout')),
      cmd('WORD.CONTEXT.SMARTART.COLOR', 'Change Colors', () => ContextEngine.SmartArt('color')),

      // HEADER FOOTER
      cmd('WORD.CONTEXT.HEADER', 'Header Menu', () => ContextEngine.Open('Header')),
      cmd('WORD.CONTEXT.FOOTER', 'Footer Menu', () => ContextEngine.Open('Footer')),
      cmd('WORD.CONTEXT.PAGE', 'Page Number', () => ContextEngine.HeaderFooter('page')),
      cmd('WORD.CONTEXT.SECTION', 'Section', () => ContextEngine.HeaderFooter('section')),

      // REVIEW
      cmd('WORD.CONTEXT.COMMENT', 'New Comment', () => ContextEngine.Review('comment')),
      cmd('WORD.CONTEXT.REPLY', 'Reply', () => ContextEngine.Review('reply')),
      cmd('WORD.CONTEXT.RESOLVE', 'Resolve', () => ContextEngine.Review('resolve')),
      cmd('WORD.CONTEXT.ACCEPT', 'Accept Change', () => ContextEngine.Review('accept')),
      cmd('WORD.CONTEXT.REJECT', 'Reject Change', () => ContextEngine.Review('reject')),

      // BOOKMARK
      cmd('WORD.CONTEXT.BOOKMARK', 'Bookmark', () => ContextEngine.Bookmark('bookmark')),
      cmd('WORD.CONTEXT.CROSSREFERENCE', 'Cross Reference', () => ContextEngine.Bookmark('crossreference')),
      cmd('WORD.CONTEXT.CITATION', 'Citation', () => ContextEngine.Bookmark('citation')),

      // OBJECT
      cmd('WORD.CONTEXT.OBJECT', 'Object Properties', () => ContextEngine.Open('OLE')),
      cmd('WORD.CONTEXT.OPENOBJECT', 'Open Object', () => ContextEngine.Object('open')),
      cmd('WORD.CONTEXT.EDITOBJECT', 'Edit Object', () => ContextEngine.Object('edit')),
      cmd('WORD.CONTEXT.REPLACEOBJECT', 'Replace Object', () => ContextEngine.Object('replace')),

      // PAGE
      cmd('WORD.CONTEXT.PAGESETUP', 'Page Setup', () => ContextEngine.Page('pagesetup')),
      cmd('WORD.CONTEXT.MARGIN', 'Margins', () => ContextEngine.Page('margin')),
      cmd('WORD.CONTEXT.ORIENTATION', 'Orientation', () => ContextEngine.Page('orientation')),
      cmd('WORD.CONTEXT.COLUMNS', 'Columns', () => ContextEngine.Page('columns')),

      // WINDOW
      cmd('WORD.CONTEXT.SPLIT', 'Split Window', () => ContextEngine.Window('split')),
      cmd('WORD.CONTEXT.NEWWINDOW', 'New Window', () => ContextEngine.Window('newwindow')),
      cmd('WORD.CONTEXT.SIDEBYSIDE', 'Side By Side', () => ContextEngine.Window('sidebyside')),

      // AI
      cmd('WORD.CONTEXT.AI', 'AI Assistant', () => ContextEngine.Open('AI')),
      cmd('WORD.CONTEXT.AI.REWRITE', 'Rewrite', () => ContextEngine.AI('rewrite')),
      cmd('WORD.CONTEXT.AI.SUMMARIZE', 'Summarize', () => ContextEngine.AI('summarize')),
      cmd('WORD.CONTEXT.AI.TRANSLATE', 'Translate', () => ContextEngine.AI('translate')),
      cmd('WORD.CONTEXT.AI.EXPLAIN', 'Explain', () => ContextEngine.AI('explain')),
      cmd('WORD.CONTEXT.AI.IMPROVE', 'Improve Writing', () => ContextEngine.AI('improve')),
      cmd('WORD.CONTEXT.AI.GENERATE', 'Generate Content', () => ContextEngine.AI('generate')),
      cmd('WORD.CONTEXT.AI.CHAT', 'Ask AI', () => ContextEngine.AI('chat')),

      // DEVELOPER
      cmd('WORD.CONTEXT.XML', 'View XML', () => ContextEngine.Developer('xml')),
      cmd('WORD.CONTEXT.OPENXML', 'OpenXML', () => ContextEngine.Developer('openxml')),
      cmd('WORD.CONTEXT.FIELD', 'Field Codes', () => ContextEngine.Developer('field')),
      cmd('WORD.CONTEXT.DEBUG', 'Debug Object', () => ContextEngine.Developer('debug')),
      cmd('WORD.CONTEXT.PROPERTIES', 'Properties', () => ContextEngine.Developer('properties')),

      // PLUGIN
      cmd('WORD.CONTEXT.PLUGIN', 'Plugin Commands', () => ContextEngine.Open('Plugin')),
      cmd('WORD.CONTEXT.PLUGIN.RUN', 'Run Plugin', () => ContextEngine.Plugin('run')),
      cmd('WORD.CONTEXT.PLUGIN.SETTINGS', 'Plugin Settings', () => ContextEngine.Plugin('settings')),
    ];
  }
}
