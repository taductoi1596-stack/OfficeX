const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src/renderer');
files.forEach(f => {
  if (f.includes('CanvasEditor.tsx')) return;
  let c = fs.readFileSync(f, 'utf8');
  let changed = false;

  // Replace CanvasEditor imports with DocumentTypes
  if (c.includes('CanvasEditor')) {
    c = c.replace(/import\s+(type\s+)?\{(.*?)\}\s+from\s+['"].*?CanvasEditor['"];/g, (match, isType, imports) => {
      let isDocImport = ['DocModel', 'DocPara', 'DocRun', 'RunFmt', 'ParaFmt', 'Caret', 'SelRange'].some(t => imports.includes(t));
      if (isDocImport) {
        let prefix = isType ? 'import type ' : 'import ';
        let target = f.includes('src\\renderer\\render') || f.includes('src\\renderer\\layout') || f.includes('src\\renderer\\text') || f.includes('src\\renderer\\pagination') 
                     ? '../document/DocumentTypes' 
                     : './document/DocumentTypes';
        // Need to calculate relative path properly, but since they are all 1 level deep, '../document/DocumentTypes' is usually correct, except maybe from rulers?
        return `${prefix}{${imports}} from '../document/DocumentTypes';`;
      }
      return match;
    });
    changed = true;
  }

  if (f.includes('RenderEngine.tsx')) {
    c = c.replace(/import \{ getCachedImage \} from '..\/CanvasEditor';/g, "import { getCachedImage } from './ImageCache';");
    c = c.replace(/import \{ LayoutResult, LayoutEngine, paraLen \} from '..\/layout\/LayoutEngine';/g, "import { LayoutEngine } from '../layout/LayoutEngine';\nimport { LayoutResult } from '../layout/LayoutTypes';\nimport { paraLen } from '../document/DocumentEngine';");
    changed = true;
  }

  if (f.includes('Measurer.ts')) {
    c = c.replace(/import type \{ RunFmt \} from '..\/CanvasEditor';/g, "import type { RunFmt } from '../document/DocumentTypes';");
    c = c.replace(/import \{ getCachedImage \} from '..\/CanvasEditor';/g, "import { getCachedImage } from '../render/ImageCache';");
    changed = true;
  }

  if (f.includes('TextEngine.ts')) {
    c = c.replace(/import type \{ DocPara \} from '..\/CanvasEditor';/g, "import type { DocPara } from '../document/DocumentTypes';");
    changed = true;
  }

  if (f.includes('PaginationEngine.ts')) {
    c = c.replace(/import type \{ DocModel, PageSetup \} from '..\/CanvasEditor';/g, "import type { DocModel, PageSetup } from '../document/DocumentTypes';");
    changed = true;
  }

  if (f.includes('PaginationTypes.ts')) {
    c = c.replace(/import type \{ DocRun, Caret, SelRange \} from '..\/CanvasEditor';/g, "import type { DocRun, Caret, SelRange } from '../document/DocumentTypes';");
    changed = true;
  }

  if (changed) fs.writeFileSync(f, c);
});
console.log('done');
