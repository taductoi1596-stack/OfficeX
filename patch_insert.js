const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/taduc/.gemini/antigravity-ide/scratch/OfficeX/apps/word/src/renderer/insert';

const patchMap = {
  'insertPageCommands.ts': `
      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.COVER_PAGE', 'Cover Page', () => InsertPageEngine.CoverPage()),
      cmd('WORD.INSERT.BLANK_PAGE', 'Blank Page', () => InsertPageEngine.BlankPage()),
      cmd('WORD.INSERT.PAGE_BREAK', 'Page Break', () => InsertPageEngine.PageBreak()),
      cmd('WORD.INSERT.SECTION_BREAK', 'Section Break', () => InsertPageEngine.SectionBreak()),
      cmd('WORD.INSERT.NEXT_PAGE', 'Next Page', () => InsertPageEngine.SectionBreak('nextpage')),
      cmd('WORD.INSERT.CONTINUOUS', 'Continuous', () => InsertPageEngine.SectionBreak('continuous')),
      cmd('WORD.INSERT.ODD_PAGE', 'Odd Page', () => InsertPageEngine.SectionBreak('oddpage')),
      cmd('WORD.INSERT.EVEN_PAGE', 'Even Page', () => InsertPageEngine.SectionBreak('evenpage')),
`,
  'insertTableCommands.ts': `
      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.TABLE', 'Insert Table', (p) => InsertTableEngine.Table(p?.rows || 3, p?.cols || 3)),
      cmd('WORD.INSERT.DRAW_TABLE', 'Draw Table', () => InsertTableEngine.DrawTable()),
      cmd('WORD.INSERT.CONVERT_TABLE', 'Convert Text', () => InsertTableEngine.ConvertText()),
      cmd('WORD.INSERT.QUICK_TABLE', 'Quick Tables', () => InsertTableEngine.QuickTable()),
      cmd('WORD.INSERT.EXCEL', 'Excel Spreadsheet', () => InsertTableEngine.Excel()),
`,
  'insertPictureCommands.ts': `
      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.PICTURE', 'Pictures', () => InsertPictureEngine.Picture('file')),
      cmd('WORD.INSERT.PICTURE_DEVICE', 'Pictures From Device', () => InsertPictureEngine.Picture('file')),
      cmd('WORD.INSERT.PICTURE_ONLINE', 'Online Pictures', () => InsertPictureEngine.Picture('online')),
      cmd('WORD.INSERT.STOCK_IMAGE', 'Stock Images', () => InsertPictureEngine.Picture('stock')),
      cmd('WORD.INSERT.SCREENSHOT', 'Screenshot', () => InsertPictureEngine.Picture('screenshot')),
      cmd('WORD.INSERT.PHOTO_ALBUM', 'Photo Album', () => InsertPictureEngine.Picture('album')),
`,
  'insertShapeCommands.ts': `
      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.SHAPE', 'Shapes Gallery', () => InsertShapeEngine.Shape('rectangle')),
      cmd('WORD.INSERT.TEXTBOX', 'Text Box', () => InsertShapeEngine.Shape('textbox')),
      cmd('WORD.INSERT.WORDART', 'WordArt', () => InsertShapeEngine.Shape('wordart')),
      cmd('WORD.INSERT.CANVAS', 'Drawing Canvas', () => InsertShapeEngine.Shape('canvas')),
      cmd('WORD.INSERT.CONNECTOR', 'Connector', () => InsertShapeEngine.Shape('connector')),
      cmd('WORD.INSERT.CALLOUT', 'Callout', () => InsertShapeEngine.Shape('callout')),
`,
  'insertIconCommands.ts': `
      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.ICON', 'Office Icons', () => {}),
      cmd('WORD.INSERT.SVG', 'SVG', () => {}),
      cmd('WORD.INSERT.EMOJI', 'Emoji', () => {}),
      cmd('WORD.INSERT.STICKER', 'Sticker', () => {}),
`,
  'insertModel3DCommands.ts': `
      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.MODEL3D', 'Insert 3D Model', () => {}),
      cmd('WORD.INSERT.MODEL3D_ONLINE', 'Online Models', () => {}),
      cmd('WORD.INSERT.MODEL3D_ROTATE', 'Rotate', () => {}),
      cmd('WORD.INSERT.MODEL3D_RESET', 'Reset View', () => {}),
`,
  'insertSmartArtCommands.ts': `
      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.SMARTART', 'SmartArt', () => InsertSmartArtEngine.SmartArt('list')),
      cmd('WORD.INSERT.SMARTART_HIERARCHY', 'Hierarchy', () => InsertSmartArtEngine.SmartArt('hierarchy')),
      cmd('WORD.INSERT.SMARTART_PROCESS', 'Process', () => InsertSmartArtEngine.SmartArt('process')),
      cmd('WORD.INSERT.SMARTART_CYCLE', 'Cycle', () => InsertSmartArtEngine.SmartArt('cycle')),
      cmd('WORD.INSERT.SMARTART_RELATION', 'Relationship', () => InsertSmartArtEngine.SmartArt('relationship')),
      cmd('WORD.INSERT.SMARTART_MATRIX', 'Matrix', () => InsertSmartArtEngine.SmartArt('matrix')),
      cmd('WORD.INSERT.SMARTART_PYRAMID', 'Pyramid', () => InsertSmartArtEngine.SmartArt('pyramid')),
      cmd('WORD.INSERT.SMARTART_PICTURE', 'Picture SmartArt', () => InsertSmartArtEngine.SmartArt('picture')),
`,
  'insertChartCommands.ts': `
      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.CHART', 'Chart', () => InsertChartEngine.Chart('column')),
      cmd('WORD.INSERT.CHART_COLUMN', 'Column', () => InsertChartEngine.Chart('column')),
      cmd('WORD.INSERT.CHART_BAR', 'Bar', () => InsertChartEngine.Chart('bar')),
      cmd('WORD.INSERT.CHART_LINE', 'Line', () => InsertChartEngine.Chart('line')),
      cmd('WORD.INSERT.CHART_PIE', 'Pie', () => InsertChartEngine.Chart('pie')),
      cmd('WORD.INSERT.CHART_AREA', 'Area', () => InsertChartEngine.Chart('area')),
      cmd('WORD.INSERT.CHART_SCATTER', 'Scatter', () => InsertChartEngine.Chart('scatter')),
      cmd('WORD.INSERT.CHART_RADAR', 'Radar', () => InsertChartEngine.Chart('radar')),
      cmd('WORD.INSERT.CHART_COMBO', 'Combo', () => InsertChartEngine.Chart('combo')),
      cmd('WORD.INSERT.CHART_MAP', 'Map', () => InsertChartEngine.Chart('map')),
      cmd('WORD.INSERT.CHART_HISTOGRAM', 'Histogram', () => InsertChartEngine.Chart('histogram')),
      cmd('WORD.INSERT.CHART_WATERFALL', 'Waterfall', () => InsertChartEngine.Chart('waterfall')),
`,
  'insertReferenceCommands.ts': `
      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.HYPERLINK', 'Hyperlink', () => InsertReferenceEngine.Hyperlink()),
      cmd('WORD.INSERT.BOOKMARK', 'Bookmark', () => InsertReferenceEngine.Bookmark()),
      cmd('WORD.INSERT.CROSS_REFERENCE', 'Cross Reference', () => InsertReferenceEngine.CrossReference()),
      cmd('WORD.INSERT.TOC_LINK', 'Table of Contents Link', () => InsertReferenceEngine.TOC('automatic')),
`,
  'insertCommentCommands.ts': `
      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.COMMENT', 'New Comment', () => {}),
      cmd('WORD.INSERT.MENTION', 'Mention', () => {}),
      cmd('WORD.INSERT.RESOLVE', 'Resolve', () => {}),
`,
  'insertHeaderFooterCommands.ts': `
      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.HEADER', 'Header', () => InsertHeaderFooterEngine.Header()),
      cmd('WORD.INSERT.FOOTER', 'Footer', () => InsertHeaderFooterEngine.Footer()),
      cmd('WORD.INSERT.PAGE_NUMBER', 'Page Number', () => InsertHeaderFooterEngine.PageNumber()),
      cmd('WORD.INSERT.DATE', 'Date & Time', () => InsertHeaderFooterEngine.DateTime()),
      cmd('WORD.INSERT.QUICKPART', 'Quick Parts', () => InsertHeaderFooterEngine.QuickPart()),
      cmd('WORD.INSERT.FIELD', 'Field', () => InsertHeaderFooterEngine.Field()),
      cmd('WORD.INSERT.DOCINFO', 'Document Info', () => InsertHeaderFooterEngine.DocumentProperty()),
`,
  'insertTextCommands.ts': `
      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.TEXTBOX', 'Text Box', () => InsertTextEngine.TextBox('simple')),
      cmd('WORD.INSERT.QUICKPART', 'Quick Parts', () => InsertTextEngine.QuickPart('dialog')),
      cmd('WORD.INSERT.SIGNATURE', 'Signature Line', () => InsertTextEngine.Signature('dialog')),
      cmd('WORD.INSERT.DATE', 'Date', () => InsertTextEngine.DateTime('date')),
      cmd('WORD.INSERT.DROPCAP', 'Drop Cap', () => InsertTextEngine.DropCap('dropped')),
      cmd('WORD.INSERT.OBJECT', 'Object', () => InsertTextEngine.Object('dialog')),
      cmd('WORD.INSERT.FILE', 'File Attachment', () => InsertTextEngine.Object('file')),
`,
  'insertSymbolCommands.ts': `
      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.EQUATION', 'Equation', () => InsertSymbolEngine.Equation('professional')),
      cmd('WORD.INSERT.SYMBOL', 'Symbol', () => InsertSymbolEngine.Symbol('recent')),
      cmd('WORD.INSERT.SPECIAL_CHARACTER', 'Special Character', () => InsertSymbolEngine.Symbol('special')),
`,
  'insertMediaCommands.ts': `
      // --- Canonical Spec IDs ---
      cmd('WORD.INSERT.VIDEO', 'Video', () => InsertMediaEngine.Video('file')),
      cmd('WORD.INSERT.AUDIO', 'Audio', () => InsertMediaEngine.Audio('file')),
      cmd('WORD.INSERT.SCREEN_RECORD', 'Screen Recording', () => InsertMediaEngine.ScreenRecord()),
      cmd('WORD.INSERT.QRCODE', 'QR Code', () => {}),
      cmd('WORD.INSERT.BARCODE', 'Barcode', () => {}),
`,
  'insertAICommands.ts': `
      // --- Canonical Spec IDs ---
      cmd('WORD.AI.GENERATE_IMAGE', 'Generate Image', () => InsertAIEngine.Generate('image')),
      cmd('WORD.AI.GENERATE_DIAGRAM', 'Generate Diagram', () => InsertAIEngine.Generate('diagram')),
      cmd('WORD.AI.GENERATE_TABLE', 'Generate Table', () => InsertAIEngine.Generate('table')),
      cmd('WORD.AI.GENERATE_SUMMARY', 'Generate Summary Box', () => InsertAIEngine.Generate('summary')),
      cmd('WORD.AI.GENERATE_COVER', 'Generate Cover Page', () => InsertAIEngine.Generate('cover')),
`,
  'insertPluginCommands.ts': `
      // --- Canonical Spec IDs ---
      cmd('WORD.PLUGIN.STORE', 'Marketplace', () => InsertPluginEngine.Store()),
      cmd('WORD.PLUGIN.MANAGER', 'Plugin Manager', () => InsertPluginEngine.Manager()),
      cmd('WORD.PLUGIN.INSTALLED', 'Installed Plugins', () => InsertPluginEngine.Installed()),
`,
};

// Also we need to make sure the dummy files exist if they didn't before.
const missingFiles = [
  'insertIconCommands.ts',
  'insertModel3DCommands.ts',
  'insertCommentCommands.ts'
];

for (const mf of missingFiles) {
  const fp = path.join(dir, mf);
  if (!fs.existsSync(fp)) {
    const className = mf.replace('.ts', '').replace(/^insert/, 'Insert').replace(/Commands$/, 'CommandRegistry');
    const content = [
      "import { CommandDefinition } from '../CommandDispatcher';",
      "function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {",
      "  return { id, name, handler };",
      "}",
      "export class " + className + " {",
      "  static all(): CommandDefinition[] {",
      "    return [",
      "      // CANONICAL_INJECT",
      "    ];",
      "  }",
      "}"
    ].join("\\n");
    fs.writeFileSync(fp, content);
  }
}

for (const [file, patch] of Object.entries(patchMap)) {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Inject at the beginning of the return array in all(): CommandDefinition[] { return [
    const returnIndex = content.indexOf('return [');
    if (returnIndex !== -1) {
      const injectPos = returnIndex + 8;
      content = content.slice(0, injectPos) + "\\n" + patch + content.slice(injectPos);
      
      // Remove the dummy CANONICAL_INJECT if present
      content = content.replace('// CANONICAL_INJECT', '');
      
      fs.writeFileSync(filePath, content);
      console.log('Patched ' + file);
    } else {
      console.log('Could not patch ' + file + ' (no return array found)');
    }
  } else {
    console.log('File not found: ' + file);
  }
}
