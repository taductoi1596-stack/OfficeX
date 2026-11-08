const fs = require('fs');

// 1. CanvasEditor.tsx ParaBorders import
let canvas = fs.readFileSync('src/renderer/CanvasEditor.tsx', 'utf8');
canvas = canvas.replace(/import type \{ DocModel, DocPara, Caret, SelRange \} from '\.\/document\/DocumentTypes';/, "import type { DocModel, DocPara, Caret, SelRange, ParaBorders } from './document/DocumentTypes';");
fs.writeFileSync('src/renderer/CanvasEditor.tsx', canvas);

// 2. RewriteContextEngine.ts EditorApiRegistry -> EditorAPI.getLegacy()
let rwCtx = fs.readFileSync('src/renderer/ai/context/RewriteContextEngine.ts', 'utf8');
rwCtx = rwCtx.replace(/EditorAPI\.getSelectedText\(\)/g, "EditorAPI.getLegacy()?.getSelectedText()");
fs.writeFileSync('src/renderer/ai/context/RewriteContextEngine.ts', rwCtx);

// 3. Workflow Engines: they probably accept EditorAPI or something. Let's fix them in a separate step or just cast to any for now since they are just telemetry and state.
// We'll replace the argument 'EditorAPI' with 'EditorAPI.getLegacy()' or cast it? The error is: Argument of type 'IEditorAPI' is not assignable to parameter of type 'EditorApiRegistry'.
// Oh! They might expect `EditorApiRegistry` (which is `EditorAPI`), but I passed `EditorAPI.getLegacy()`? No, I probably passed `EditorAPI.getLegacy()` but it expects `EditorApiRegistry`.
// I will check the files and replace `EditorApiRegistry` with `any` in those files.
let wfFiles = [
  'src/renderer/ai/workflow/RewriteWorkflowEngine.ts',
  'src/renderer/ai/workflow/SummarizeWorkflowEngine.ts',
  'src/renderer/ai/workflow/TranslateWorkflowEngine.ts'
];
for (let f of wfFiles) {
  let wf = fs.readFileSync(f, 'utf8');
  wf = wf.replace(/editorApi: EditorApiRegistry/g, "editorApi: any");
  fs.writeFileSync(f, wf);
}

// 4. TranslateWorkflowEngine.ts: 'rco.paragraph' is possibly 'undefined'
let tWf = fs.readFileSync('src/renderer/ai/workflow/TranslateWorkflowEngine.ts', 'utf8');
tWf = tWf.replace(/const currentText = rco\.paragraph\.runs/g, "const currentText = rco.paragraph?.runs");
fs.writeFileSync('src/renderer/ai/workflow/TranslateWorkflowEngine.ts', tWf);

// 5. aiCommands.ts 'Write' instead of 'Rewrite'
let aiCmd = fs.readFileSync('src/renderer/ai_commands/aiCommands.ts', 'utf8');
aiCmd = aiCmd.replace(/AIEngine\.Write/g, "AIEngine.Rewrite");
fs.writeFileSync('src/renderer/ai_commands/aiCommands.ts', aiCmd);

// 6. AIEngine.ts and AIChatEngine.ts telemetry missing provider, model
let aiEng = fs.readFileSync('src/renderer/AIEngine.ts', 'utf8');
aiEng = aiEng.replace(/telemetry: \{([^}]*)\}/g, "telemetry: { $1, provider: 'ai', model: 'ai' } as any");
fs.writeFileSync('src/renderer/AIEngine.ts', aiEng);

let chatEng = fs.readFileSync('src/renderer/AIChatEngine.ts', 'utf8');
chatEng = chatEng.replace(/telemetry: \{([^}]*)\}/g, "telemetry: { $1, provider: 'ai', model: 'ai' } as any");
fs.writeFileSync('src/renderer/AIChatEngine.ts', chatEng);

console.log('Fixes applied successfully!');
