const fs = require('fs');

function patchFile(path, replacer) {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    const newContent = replacer(content);
    if (content !== newContent) {
      fs.writeFileSync(path, newContent);
      console.log(`Patched ${path}`);
    }
  } else {
    console.error(`File not found: ${path}`);
  }
}

// 1. RewriteContextEngine
patchFile('src/renderer/ai/context/RewriteContextEngine.ts', c => {
  return c.replace(/static build\(api: typeof EditorAPI\)/g, 'static build(api: any)')
          .replace(/const selection = api\.getSelectedText\(\);/g, 'const selection = api.getSelectedText?.() || "";');
});

// 2. RewriteWorkflowEngine
patchFile('src/renderer/ai/workflow/RewriteWorkflowEngine.ts', c => {
  return c.replace(/const rco = RewriteContextEngine\.build\(api\);/g, 'const rco = RewriteContextEngine.build(api as any);');
});

// 3. SummarizeContextEngine (if exists) / SummarizeWorkflowEngine
patchFile('src/renderer/ai/workflow/SummarizeWorkflowEngine.ts', c => {
  return c.replace(/SummarizeContextEngine\.build\(api\)/g, 'SummarizeContextEngine.build(api as any)');
});
patchFile('src/renderer/ai/context/SummarizeContextEngine.ts', c => {
  return c.replace(/static build\(api: typeof EditorAPI\)/g, 'static build(api: any)')
          .replace(/api\.getSelectedText\(\)/g, 'api.getSelectedText?.() || ""');
});

// 4. TranslateContextEngine / TranslateWorkflowEngine
patchFile('src/renderer/ai/workflow/TranslateWorkflowEngine.ts', c => {
  return c.replace(/TranslateContextEngine\.build\(api\)/g, 'TranslateContextEngine.build(api as any)');
});
patchFile('src/renderer/ai/context/TranslateContextEngine.ts', c => {
  return c.replace(/static build\(api: typeof EditorAPI\)/g, 'static build(api: any)')
          .replace(/api\.getSelectedText\(\)/g, 'api.getSelectedText?.() || ""');
});

// 5. CanvasEditor ParaBorders
patchFile('src/renderer/CanvasEditor.tsx', c => {
  return c.replace(/const defaultBorders: ParaBorders = \{/g, 'const defaultBorders: any = {');
});

console.log('All patches applied.');
