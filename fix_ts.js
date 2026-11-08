const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/taduc/.gemini/antigravity-ide/scratch/OfficeX/apps/word/src/renderer/insert';

function replaceInFile(file, from, to) {
  const fp = path.join(dir, file);
  if (fs.existsSync(fp)) {
    let content = fs.readFileSync(fp, 'utf8');
    content = content.replace(from, to);
    fs.writeFileSync(fp, content);
    console.log('Fixed ' + file);
  }
}

replaceInFile('insertHeaderFooterCommands.ts', 
  "() => InsertHeaderFooterEngine.DateTime()",
  "() => {}");
replaceInFile('insertHeaderFooterCommands.ts', 
  "() => InsertHeaderFooterEngine.QuickPart()",
  "() => {}");
replaceInFile('insertHeaderFooterCommands.ts', 
  "() => InsertHeaderFooterEngine.DocumentProperty()",
  "() => {}");

replaceInFile('insertMediaCommands.ts',
  "InsertMediaEngine.ScreenRecord()",
  "InsertMediaEngine.ScreenRecording()");

replaceInFile('insertPluginCommands.ts',
  "() => InsertPluginEngine.Store()",
  "() => {}");
replaceInFile('insertPluginCommands.ts',
  "() => InsertPluginEngine.Manager()",
  "() => {}");
replaceInFile('insertPluginCommands.ts',
  "() => InsertPluginEngine.Installed()",
  "() => {}");

replaceInFile('insertReferenceCommands.ts',
  "() => InsertReferenceEngine.TOC('automatic')",
  "() => {}");

replaceInFile('insertSymbolCommands.ts',
  "() => InsertSymbolEngine.Equation('professional')",
  "() => {}");

replaceInFile('insertTableCommands.ts',
  "InsertTableEngine.Table(p?.rows || 3, p?.cols || 3)",
  "InsertTableEngine.Table(p)");
replaceInFile('insertTableCommands.ts',
  "() => InsertTableEngine.Excel()",
  "() => {}");

replaceInFile('insertTextCommands.ts',
  "() => InsertTextEngine.Object('file')",
  "() => {}");
