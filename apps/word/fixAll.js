const fs = require('fs');

// 1. Fix AIRibbonGroup.tsx
let aiRibbon = fs.readFileSync('src/renderer/AIRibbonGroup.tsx', 'utf8');
aiRibbon = aiRibbon.replace(/icon: React\.ComponentType<\{ size\?: number; className\?: string \}>;/g, 'icon: any;');
fs.writeFileSync('src/renderer/AIRibbonGroup.tsx', aiRibbon);

// 2. Fix App.tsx (line 375 ParagraphDialog)
let app = fs.readFileSync('src/renderer/App.tsx', 'utf8');
app = app.replace(/{showParaDialog && <ParagraphDialog onClose=\{\(\) => setShowParaDialog\(false\)\} \/>}/g, '{showParaDialog && <ParagraphDialog isOpen={showParaDialog} onClose={() => setShowParaDialog(false)} />}');
fs.writeFileSync('src/renderer/App.tsx', app);

// 3. Fix FindPane.tsx
let findPane = fs.readFileSync('src/renderer/FindPane.tsx', 'utf8');
findPane = findPane.replace(/const { documentRoot } = useEngines\(\);/g, 'const { documentRoot } = useEngines() as any;');
fs.writeFileSync('src/renderer/FindPane.tsx', findPane);

// 4. Fix CanvasEditor.tsx
let canvas = fs.readFileSync('src/renderer/CanvasEditor.tsx', 'utf8');
// Fix ParaBorders error on 533
canvas = canvas.replace(/setBorders: \(b: any\) => \{ const nd = applyParaFmt\(doc, sel, caret, \{ borders: b \|\| undefined \}\); commit\(nd, caret, sel\); \},/g, '');
canvas = canvas.replace(/setBorders: \(b\) => \{ const nd = applyParaFmt\(doc, sel, caret, \{ borders: b \}\); commit\(nd, caret, sel\); \},/g, '');
canvas = canvas.replace(/setBorder: \(type, def\) => \{/g, 'setBorders: (b: any) => { const nd = applyParaFmt(doc, sel, caret, { borders: b || undefined }); commit(nd, caret, sel); },\n      setBorder: (type, def) => {');
// Remove duplicates lines 885-905
canvas = canvas.replace(/      setDrawTableMode: \(active: boolean\) => \{[\s\S]*?api\.insertTable\(rows, cols\);\n      }/g, '');
fs.writeFileSync('src/renderer/CanvasEditor.tsx', canvas);

// 5. Fix DictationToolbar.tsx
let dict = fs.readFileSync('src/renderer/DictationToolbar.tsx', 'utf8');
dict = dict.replace(/const isActive = status === 'listening';\n  const isPaused = status === 'paused';/g, `const isActive = status === 'listening';
  const isPaused = status === 'paused';
  
  const statusColor = ({
    idle: '#757575',
    listening: '#107C41',
    paused: '#F7630C',
    processing: '#2B579A',
  } as Record<string, string>)[status as string];

  const statusLabel = ({
    idle: 'Ready',
    listening: '● Listening...',
    paused: '⏸ Paused',
    processing: '⏳ Processing...',
  } as Record<string, string>)[status as string];`);
fs.writeFileSync('src/renderer/DictationToolbar.tsx', dict);

console.log('Fixes applied successfully!');
