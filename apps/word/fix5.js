const fs = require('fs');
let c = fs.readFileSync('src/renderer/CanvasEditor.tsx', 'utf8');

c = c.replace(
  /import \{ DocumentEngine \} from '\.\/document\/DocumentEngine';/,
  "import { defaultDoc, paraText, paraLen, insertText, splitPara, deleteSelection, applyRunFmt, applyParaFmt, getRunFmtAt, getParaFmtAt, isFmtActive, normalizeSel } from './document/DocumentEngine';"
);

fs.writeFileSync('src/renderer/CanvasEditor.tsx', c);
console.log('done');
