const fs = require('fs');

// 1. ViewportEngine.ts
let viewportPath = 'src/renderer/viewport/ViewportEngine.ts';
let v = fs.readFileSync(viewportPath, 'utf8');
v = v.replace(/import \{ LayoutResult, LayoutEngine \} from '\.\.\/layout\/LayoutEngine';/, 
  "import { LayoutResult } from '../layout/LayoutTypes';\nimport { HitTestEngine } from '../hittest/HitTestEngine';");
v = v.replace(/LayoutEngine\.get\(\)\.hitTest/g, 'HitTestEngine.get().hitTest');
fs.writeFileSync(viewportPath, v);

// 2. RenderEngine.tsx
let renderPath = 'src/renderer/render/RenderEngine.tsx';
let r = fs.readFileSync(renderPath, 'utf8');
r = r.replace(/import \{ LayoutEngine \} from '\.\.\/layout\/LayoutEngine';/, 
  "import { LayoutEngine } from '../layout/LayoutEngine';\nimport { HitTestEngine } from '../hittest/HitTestEngine';");
r = r.replace(/LayoutEngine\.get\(\)\.getSelectionRects/g, 'HitTestEngine.get().getSelectionRects');
fs.writeFileSync(renderPath, r);

// 3. CanvasEditor.tsx
let canvasPath = 'src/renderer/CanvasEditor.tsx';
let c = fs.readFileSync(canvasPath, 'utf8');
// Add HitTestEngine import
c = c.replace(/import \{ ViewportEngine \} from '\.\/viewport\/ViewportEngine';/, 
  "import { ViewportEngine } from './viewport/ViewportEngine';\nimport { HitTestEngine } from './hittest/HitTestEngine';");
c = c.replace(/LayoutEngine\.get\(\)\.getScreenCaret/g, 'HitTestEngine.get().getScreenCaret');
fs.writeFileSync(canvasPath, c);

console.log('done');
