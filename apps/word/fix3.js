const fs = require('fs');

let c = fs.readFileSync('src/renderer/CanvasEditor.tsx', 'utf8');

// Add imports
c = c.replace(/import \{ ClipboardEngine \} from '\.\/ClipboardEngine';/, "import { ClipboardEngine } from './ClipboardEngine';\nimport { useViewport } from './viewport/useViewport';\nimport { ViewportEngine } from './viewport/ViewportEngine';");

// Remove PAGE_GAP
c = c.replace(/const PAGE_GAP\s*=\s*24;\n/, '');

// Remove old state
c = c.replace(/const \[zoom,\s*setZoom\]\s*=\s*useState\(1\.0\);\n/, '');
c = c.replace(/const scrollRef\s*=\s*useRef<HTMLDivElement>\(null\);\n/, '');
c = c.replace(/const hRulerRef\s*=\s*useRef<HTMLDivElement>\(null\);\n/, '');
c = c.replace(/const vRulerRef\s*=\s*useRef<HTMLDivElement>\(null\);\n/, '');

// Add useViewport call
// Wait, we need to place it after `const sc = ...` so we can pass `sc`.
// `const sc = ...` is around line 90.
c = c.replace(/(const sc\s*=\s*useMemo\(\(\) => LayoutEngine.*?;\n)(\s*)(const \{ marginTop,)/, 
  "$1$2const { zoom, setZoom, vis, scrollRef, hRulerRef, vRulerRef, onScroll, PAGE_GAP } = useViewport(pages.length, projectedDoc.pageSetup, sc);\n$2$3");

// Remove auto-scroll block
c = c.replace(/\/\/ ── Auto-scroll caret into view ──[\s\S]*?\/\/ ── Virtual page rendering ──/g, '// ── Virtual page rendering ──');

// Remove virtual page rendering logic
c = c.replace(/\/\/ ── Virtual page rendering ──[\s\S]*?\/\/ ── Register EditorAPI ──/g, '// ── Register EditorAPI ──');

// Fix onPageMouseDown coordinate mapping
c = c.replace(/const lx = \(e\.clientX - rect\.left\) \/ zoom;\n\s*const ly = \(e\.clientY - rect\.top\)  \/ zoom;\n\s*const newCaret = LayoutEngine\.get\(\)\.hitTest\(pIdx, lx, ly, pages, projectedDoc\.pageSetup\);/g, 
  "const newCaret = ViewportEngine.get().hitTest(e.clientX, e.clientY, rect, pIdx, pages, projectedDoc.pageSetup, zoom);");

// Fix onPageMouseMove coordinate mapping
c = c.replace(/const lx = \(e\.clientX - rect\.left\) \/ zoom;\n\s*const ly = \(e\.clientY - rect\.top\)  \/ zoom;\n\s*const focus_ = LayoutEngine\.get\(\)\.hitTest\(pIdx, lx, ly, pages, projectedDoc\.pageSetup\);/g,
  "const focus_ = ViewportEngine.get().hitTest(e.clientX, e.clientY, rect, pIdx, pages, projectedDoc.pageSetup, zoom);");

fs.writeFileSync('src/renderer/CanvasEditor.tsx', c);
console.log('done');
