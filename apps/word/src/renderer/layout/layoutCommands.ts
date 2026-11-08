import { CommandDefinition } from '../CommandDispatcher';
import { LayoutEngine } from './LayoutEngine';

function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}

export class LayoutCommandRegistry {
  static all(): CommandDefinition[] {
    return [
      // PAGE SETUP
      cmd('WORD.LAYOUT.PAGESETUP', 'Open Page Setup', () => LayoutEngine.PageSetup('dialog')),
      cmd('WORD.LAYOUT.PAGESETUP.DEFAULT', 'Default Page Setup', () => LayoutEngine.PageSetup('default')),
      cmd('WORD.LAYOUT.PAGESETUP.RESET', 'Reset Page Setup', () => LayoutEngine.PageSetup('reset')),
      cmd('WORD.LAYOUT.PAGESETUP.CUSTOM', 'Custom Page Setup', () => LayoutEngine.PageSetup('custom')),

      // PAPER SIZE
      cmd('WORD.LAYOUT.SIZE', 'Paper Size', () => LayoutEngine.SetPaperSize('dialog')),
      cmd('WORD.LAYOUT.SIZE.A4', 'A4', () => LayoutEngine.SetPaperSize('A4')),
      cmd('WORD.LAYOUT.SIZE.A3', 'A3', () => LayoutEngine.SetPaperSize('A3')),
      cmd('WORD.LAYOUT.SIZE.A5', 'A5', () => LayoutEngine.SetPaperSize('A5')),
      cmd('WORD.LAYOUT.SIZE.LETTER', 'Letter', () => LayoutEngine.SetPaperSize('Letter')),
      cmd('WORD.LAYOUT.SIZE.LEGAL', 'Legal', () => LayoutEngine.SetPaperSize('Legal')),
      cmd('WORD.LAYOUT.SIZE.TABLOID', 'Tabloid', () => LayoutEngine.SetPaperSize('Tabloid')),
      cmd('WORD.LAYOUT.SIZE.CUSTOM', 'Custom Size', () => LayoutEngine.SetPaperSize('Custom')),

      // ORIENTATION
      cmd('WORD.LAYOUT.ORIENTATION', 'Orientation', () => LayoutEngine.SetOrientation('portrait')),
      cmd('WORD.LAYOUT.ORIENTATION.PORTRAIT', 'Portrait', () => LayoutEngine.SetOrientation('portrait')),
      cmd('WORD.LAYOUT.ORIENTATION.LANDSCAPE', 'Landscape', () => LayoutEngine.SetOrientation('landscape')),

      // MARGINS
      cmd('WORD.LAYOUT.MARGIN', 'Margins', () => LayoutEngine.SetMargins('dialog')),
      cmd('WORD.LAYOUT.MARGIN.NORMAL', 'Normal', () => LayoutEngine.SetMargins('normal')),
      cmd('WORD.LAYOUT.MARGIN.NARROW', 'Narrow', () => LayoutEngine.SetMargins('narrow')),
      cmd('WORD.LAYOUT.MARGIN.MODERATE', 'Moderate', () => LayoutEngine.SetMargins('moderate')),
      cmd('WORD.LAYOUT.MARGIN.WIDE', 'Wide', () => LayoutEngine.SetMargins('wide')),
      cmd('WORD.LAYOUT.MARGIN.MIRROR', 'Mirror Margins', () => LayoutEngine.SetMargins('mirror')),
      cmd('WORD.LAYOUT.MARGIN.GUTTER', 'Gutter', () => LayoutEngine.SetMargins('gutter')),
      cmd('WORD.LAYOUT.MARGIN.CUSTOM', 'Custom Margins', () => LayoutEngine.SetMargins('custom')),

      // COLUMNS
      cmd('WORD.LAYOUT.COLUMN', 'Columns', () => LayoutEngine.SetColumns('dialog')),
      cmd('WORD.LAYOUT.COLUMN.ONE', 'One Column', () => LayoutEngine.SetColumns('one')),
      cmd('WORD.LAYOUT.COLUMN.TWO', 'Two Columns', () => LayoutEngine.SetColumns('two')),
      cmd('WORD.LAYOUT.COLUMN.THREE', 'Three Columns', () => LayoutEngine.SetColumns('three')),
      cmd('WORD.LAYOUT.COLUMN.LEFT', 'Left Column', () => LayoutEngine.SetColumns('left')),
      cmd('WORD.LAYOUT.COLUMN.RIGHT', 'Right Column', () => LayoutEngine.SetColumns('right')),
      cmd('WORD.LAYOUT.COLUMN.CUSTOM', 'Custom Columns', () => LayoutEngine.SetColumns('custom')),
      cmd('WORD.LAYOUT.COLUMN.LINEBETWEEN', 'Line Between Columns', () => LayoutEngine.SetColumns('linebetween')),

      // BREAKS
      cmd('WORD.LAYOUT.BREAK', 'Break', () => LayoutEngine.InsertBreak('dialog')),
      cmd('WORD.LAYOUT.BREAK.PAGE', 'Page Break', () => LayoutEngine.InsertBreak('page')),
      cmd('WORD.LAYOUT.BREAK.COLUMN', 'Column Break', () => LayoutEngine.InsertBreak('column')),
      cmd('WORD.LAYOUT.BREAK.TEXTWRAP', 'Text Wrapping Break', () => LayoutEngine.InsertBreak('textwrap')),
      cmd('WORD.LAYOUT.BREAK.SECTIONNEXT', 'Next Page Section', () => LayoutEngine.InsertBreak('sectionnext')),
      cmd('WORD.LAYOUT.BREAK.SECTIONCONTINUOUS', 'Continuous Section', () => LayoutEngine.InsertBreak('sectioncontinuous')),
      cmd('WORD.LAYOUT.BREAK.EVENPAGE', 'Even Page Section', () => LayoutEngine.InsertBreak('evenpage')),
      cmd('WORD.LAYOUT.BREAK.ODDPAGE', 'Odd Page Section', () => LayoutEngine.InsertBreak('oddpage')),

      // LINE NUMBERS
      cmd('WORD.LAYOUT.LINENUMBER', 'Line Numbers', () => LayoutEngine.SetLineNumber('dialog')),
      cmd('WORD.LAYOUT.LINENUMBER.NONE', 'None', () => LayoutEngine.SetLineNumber('none')),
      cmd('WORD.LAYOUT.LINENUMBER.CONTINUOUS', 'Continuous', () => LayoutEngine.SetLineNumber('continuous')),
      cmd('WORD.LAYOUT.LINENUMBER.RESTART', 'Restart Each Page', () => LayoutEngine.SetLineNumber('restart')),
      cmd('WORD.LAYOUT.LINENUMBER.SECTION', 'Restart Each Section', () => LayoutEngine.SetLineNumber('section')),

      // HYPHENATION
      cmd('WORD.LAYOUT.HYPHENATION', 'Hyphenation', () => LayoutEngine.SetHyphenation('dialog')),
      cmd('WORD.LAYOUT.HYPHENATION.NONE', 'None', () => LayoutEngine.SetHyphenation('none')),
      cmd('WORD.LAYOUT.HYPHENATION.AUTO', 'Automatic', () => LayoutEngine.SetHyphenation('auto')),
      cmd('WORD.LAYOUT.HYPHENATION.MANUAL', 'Manual', () => LayoutEngine.SetHyphenation('manual')),

      // PAGE BACKGROUND
      cmd('WORD.LAYOUT.BACKGROUND', 'Page Background', () => LayoutEngine.SetBackground('dialog')),
      cmd('WORD.LAYOUT.BACKGROUND.COLOR', 'Page Color', () => LayoutEngine.SetBackground('color')),
      cmd('WORD.LAYOUT.BACKGROUND.FILL', 'Gradient Fill', () => LayoutEngine.SetBackground('fill')),
      cmd('WORD.LAYOUT.BACKGROUND.IMAGE', 'Background Image', () => LayoutEngine.SetBackground('image')),

      // WATERMARK
      cmd('WORD.LAYOUT.WATERMARK', 'Watermark', () => LayoutEngine.SetWatermark('dialog')),
      cmd('WORD.LAYOUT.WATERMARK.TEXT', 'Text Watermark', () => LayoutEngine.SetWatermark('text')),
      cmd('WORD.LAYOUT.WATERMARK.IMAGE', 'Picture Watermark', () => LayoutEngine.SetWatermark('image')),
      cmd('WORD.LAYOUT.WATERMARK.CUSTOM', 'Custom Watermark', () => LayoutEngine.SetWatermark('custom')),
      cmd('WORD.LAYOUT.WATERMARK.REMOVE', 'Remove Watermark', () => LayoutEngine.SetWatermark('remove')),

      // PAGE BORDER
      cmd('WORD.LAYOUT.BORDER', 'Page Border', () => LayoutEngine.SetBorder('dialog')),
      cmd('WORD.LAYOUT.BORDER.BOX', 'Box', () => LayoutEngine.SetBorder('box')),
      cmd('WORD.LAYOUT.BORDER.SHADOW', 'Shadow', () => LayoutEngine.SetBorder('shadow')),
      cmd('WORD.LAYOUT.BORDER.ART', 'Art Border', () => LayoutEngine.SetBorder('art')),
      cmd('WORD.LAYOUT.BORDER.CUSTOM', 'Custom Border', () => LayoutEngine.SetBorder('custom')),

      // PAGE NUMBERING
      cmd('WORD.LAYOUT.PAGENUMBER', 'Page Number Layout', () => LayoutEngine.SetPageNumber('dialog')),
      cmd('WORD.LAYOUT.PAGENUMBER.START', 'Start Number', () => LayoutEngine.SetPageNumber('start')),
      cmd('WORD.LAYOUT.PAGENUMBER.CONTINUE', 'Continue Numbering', () => LayoutEngine.SetPageNumber('continue')),
      cmd('WORD.LAYOUT.PAGENUMBER.RESTART', 'Restart Numbering', () => LayoutEngine.SetPageNumber('restart')),

      // SECTION
      cmd('WORD.LAYOUT.SECTION', 'Section', () => LayoutEngine.Section('dialog')),
      cmd('WORD.LAYOUT.SECTION.NEW', 'New Section', () => LayoutEngine.Section('new')),
      cmd('WORD.LAYOUT.SECTION.DELETE', 'Delete Section', () => LayoutEngine.Section('delete')),
      cmd('WORD.LAYOUT.SECTION.MERGE', 'Merge Sections', () => LayoutEngine.Section('merge')),
      cmd('WORD.LAYOUT.SECTION.SPLIT', 'Split Section', () => LayoutEngine.Section('split')),

      // PARAGRAPH SPACING
      cmd('WORD.LAYOUT.SPACING', 'Paragraph Spacing', () => LayoutEngine.SetSpacing('dialog')),
      cmd('WORD.LAYOUT.SPACING.BEFORE', 'Space Before', () => LayoutEngine.SetSpacing('before')),
      cmd('WORD.LAYOUT.SPACING.AFTER', 'Space After', () => LayoutEngine.SetSpacing('after')),
      cmd('WORD.LAYOUT.SPACING.LINE', 'Line Spacing', () => LayoutEngine.SetSpacing('line')),

      // INDENT
      cmd('WORD.LAYOUT.INDENT', 'Indent', () => LayoutEngine.SetIndent('dialog')),
      cmd('WORD.LAYOUT.INDENT.LEFT', 'Left Indent', () => LayoutEngine.SetIndent('left')),
      cmd('WORD.LAYOUT.INDENT.RIGHT', 'Right Indent', () => LayoutEngine.SetIndent('right')),
      cmd('WORD.LAYOUT.INDENT.FIRSTLINE', 'First Line', () => LayoutEngine.SetIndent('firstline')),
      cmd('WORD.LAYOUT.INDENT.HANGING', 'Hanging Indent', () => LayoutEngine.SetIndent('hanging')),

      // ALIGNMENT
      cmd('WORD.LAYOUT.ALIGN', 'Page Alignment', () => LayoutEngine.SetAlignment('dialog')),
      cmd('WORD.LAYOUT.ALIGN.TOP', 'Top', () => LayoutEngine.SetAlignment('top')),
      cmd('WORD.LAYOUT.ALIGN.CENTER', 'Center', () => LayoutEngine.SetAlignment('center')),
      cmd('WORD.LAYOUT.ALIGN.BOTTOM', 'Bottom', () => LayoutEngine.SetAlignment('bottom')),
      cmd('WORD.LAYOUT.ALIGN.JUSTIFY', 'Justify', () => LayoutEngine.SetAlignment('justify')),

      // PRINT LAYOUT
      cmd('WORD.LAYOUT.PRINT', 'Print Layout', () => LayoutEngine.PrintLayout('print')),
      cmd('WORD.LAYOUT.WEB', 'Web Layout', () => LayoutEngine.PrintLayout('web')),
      cmd('WORD.LAYOUT.OUTLINE', 'Outline View', () => LayoutEngine.PrintLayout('outline')),
      cmd('WORD.LAYOUT.DRAFT', 'Draft View', () => LayoutEngine.PrintLayout('draft')),
      cmd('WORD.LAYOUT.READMODE', 'Read Mode', () => LayoutEngine.PrintLayout('readmode')),

      // AI
      cmd('WORD.LAYOUT.AI.OPTIMIZE', 'Optimize Layout', () => LayoutEngine.OptimizeAI('optimize')),
      cmd('WORD.LAYOUT.AI.FIX', 'Fix Page Layout', () => LayoutEngine.OptimizeAI('fix')),
      cmd('WORD.LAYOUT.AI.FORMAT', 'Auto Format Pages', () => LayoutEngine.OptimizeAI('format')),
      cmd('WORD.LAYOUT.AI.BOOK', 'Book Layout', () => LayoutEngine.OptimizeAI('book')),
      cmd('WORD.LAYOUT.AI.REPORT', 'Report Layout', () => LayoutEngine.OptimizeAI('report')),
    ];
  }
}
