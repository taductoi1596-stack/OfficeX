import { ContextMenuRegistry } from './ContextMenuRegistry';
import { 
  IconCut, IconCopy, IconPaste, IconFormatPainter, IconAI, IconBot, IconTable, IconFileText, IconEdit3
} from '@officex/icons';

export function registerDefaultContextMenus() {
  // Text Context Menu
  ContextMenuRegistry.register({
    contextType: 'Text',
    items: [
      { id: 'cut', type: 'Item', label: 'Cut', commandId: 'WORD.CONTEXT.CUT', icon: IconCut, shortcut: 'Ctrl+X' },
      { id: 'copy', type: 'Item', label: 'Copy', commandId: 'WORD.CONTEXT.COPY', icon: IconCopy, shortcut: 'Ctrl+C' },
      { id: 'paste', type: 'Item', label: 'Paste', commandId: 'WORD.CONTEXT.PASTE', icon: IconPaste, shortcut: 'Ctrl+V' },
      { id: 'paste_special', type: 'Item', label: 'Paste Special...', commandId: 'WORD.CONTEXT.PASTE.SPECIAL' },
      { id: 'div1', type: 'Divider' },
      { id: 'font', type: 'Item', label: 'Font...', commandId: 'WORD.CONTEXT.FONT' },
      { id: 'paragraph', type: 'Item', label: 'Paragraph...', commandId: 'WORD.CONTEXT.PARAGRAPH' },
      { id: 'styles', type: 'Item', label: 'Styles...', commandId: 'WORD.CONTEXT.STYLE' },
      { id: 'div2', type: 'Divider' },
      { id: 'hyperlink', type: 'Item', label: 'Hyperlink...', commandId: 'WORD.CONTEXT.HYPERLINK' },
      { id: 'comment', type: 'Item', label: 'New Comment', commandId: 'WORD.CONTEXT.COMMENT' },
      { id: 'div3', type: 'Divider' },
      { id: 'ai_rewrite', type: 'Item', label: '✨ AI Rewrite', commandId: 'WORD.CONTEXT.AI.REWRITE', icon: IconAI },
      { id: 'ai_summarize', type: 'Item', label: '✨ AI Summarize', commandId: 'WORD.CONTEXT.AI.SUMMARIZE', icon: IconAI },
      { id: 'translate', type: 'Item', label: 'Translate...', commandId: 'WORD.CONTEXT.AI.TRANSLATE', icon: IconBot },
    ]
  });

  // Image Context Menu
  ContextMenuRegistry.register({
    contextType: 'Image',
    items: [
      { id: 'cut', type: 'Item', label: 'Cut', commandId: 'WORD.CONTEXT.CUT', icon: IconCut },
      { id: 'copy', type: 'Item', label: 'Copy', commandId: 'WORD.CONTEXT.COPY', icon: IconCopy },
      { id: 'div1', type: 'Divider' },
      { id: 'replace_image', type: 'Item', label: 'Replace Image...', commandId: 'WORD.IMAGE.REPLACE' },
      { id: 'crop', type: 'Item', label: 'Crop', commandId: 'WORD.IMAGE.CROP' },
      { id: 'wrap_text', type: 'SubMenu', label: 'Wrap Text', children: [
        { id: 'wrap_inline', type: 'Item', label: 'In Line with Text', commandId: 'WORD.IMAGE.WRAP.INLINE' },
        { id: 'wrap_square', type: 'Item', label: 'Square', commandId: 'WORD.IMAGE.WRAP.SQUARE' }
      ]},
      { id: 'div2', type: 'Divider' },
      { id: 'save_as_picture', type: 'Item', label: 'Save As Picture...', commandId: 'WORD.IMAGE.SAVE' },
      { id: 'ai_enhance', type: 'Item', label: '✨ AI Enhance', commandId: 'WORD.IMAGE.AI.ENHANCE', icon: IconAI }
    ]
  });

  // Table Context Menu
  ContextMenuRegistry.register({
    contextType: 'Table',
    items: [
      { id: 'insert_row', type: 'Item', label: 'Insert Row', commandId: 'WORD.TABLE.INSERT.ROW' },
      { id: 'insert_col', type: 'Item', label: 'Insert Column', commandId: 'WORD.TABLE.INSERT.COL' },
      { id: 'delete_row', type: 'Item', label: 'Delete Row', commandId: 'WORD.TABLE.DELETE.ROW', icon: IconCut },
      { id: 'delete_col', type: 'Item', label: 'Delete Column', commandId: 'WORD.TABLE.DELETE.COL', icon: IconCut },
      { id: 'div1', type: 'Divider' },
      { id: 'merge_cells', type: 'Item', label: 'Merge Cells', commandId: 'WORD.TABLE.MERGE' },
      { id: 'split_cells', type: 'Item', label: 'Split Cells', commandId: 'WORD.TABLE.SPLIT' },
      { id: 'div2', type: 'Divider' },
      { id: 'table_props', type: 'Item', label: 'Table Properties...', commandId: 'WORD.TABLE.PROPERTIES', icon: IconTable }
    ]
  });

  // Paragraph Context Menu
  ContextMenuRegistry.register({
    contextType: 'Paragraph',
    items: [
      { id: 'cut', type: 'Item', label: 'Cut', commandId: 'WORD.CONTEXT.CUT', icon: IconCut, shortcut: 'Ctrl+X' },
      { id: 'copy', type: 'Item', label: 'Copy', commandId: 'WORD.CONTEXT.COPY', icon: IconCopy, shortcut: 'Ctrl+C' },
      { id: 'paste', type: 'Item', label: 'Paste', commandId: 'WORD.CONTEXT.PASTE', icon: IconPaste, shortcut: 'Ctrl+V' },
      { id: 'div1', type: 'Divider' },
      { id: 'paragraph', type: 'Item', label: 'Paragraph...', commandId: 'WORD.CONTEXT.PARAGRAPH' },
      { id: 'bullets', type: 'Item', label: 'Bullets', commandId: 'WORD.CONTEXT.BULLETS' },
      { id: 'numbering', type: 'Item', label: 'Numbering', commandId: 'WORD.CONTEXT.NUMBERING' },
      { id: 'div2', type: 'Divider' },
      { id: 'page_break_before', type: 'Item', label: 'Page Break Before', commandId: 'WORD.CONTEXT.PAGE.BREAK' }
    ]
  });
}
