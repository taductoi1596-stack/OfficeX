import fs from 'fs';
import path from 'path';

const COMMANDS_DIR = path.join(process.cwd(), 'src', 'commands', 'home');

const MAPPINGS = {
  // Inline format
  'WORD.HOME.BOLD': `context.engines.editorBridge.applyFormat('bold');`,
  'WORD.HOME.ITALIC': `context.engines.editorBridge.applyFormat('italic');`,
  'WORD.HOME.UNDERLINE': `context.engines.editorBridge.applyFormat('underline');`,
  'WORD.HOME.STRIKETHROUGH': `context.engines.editorBridge.applyFormat('strikeThrough');`,
  'WORD.HOME.SUBSCRIPT': `context.engines.editorBridge.applyFormat('subscript');`,
  'WORD.HOME.SUPERSCRIPT': `context.engines.editorBridge.applyFormat('superscript');`,
  'WORD.HOME.HIGHLIGHT': `context.engines.editorBridge.applyFormat('backColor', 'yellow');`,
  'WORD.HOME.FONTCOLOR': `context.engines.editorBridge.applyFormat('foreColor', '#2563eb');`,
  
  // Alignment
  'WORD.HOME.ALIGN.LEFT': `context.engines.editorBridge.applyAlignment('left');`,
  'WORD.HOME.ALIGN.CENTER': `context.engines.editorBridge.applyAlignment('center');`,
  'WORD.HOME.ALIGN.RIGHT': `context.engines.editorBridge.applyAlignment('right');`,
  'WORD.HOME.ALIGN.JUSTIFY': `context.engines.editorBridge.applyAlignment('justify');`,
  
  // Lists
  'WORD.HOME.BULLETS': `context.engines.editorBridge.applyList('bullets');`,
  'WORD.HOME.NUMBERING': `context.engines.editorBridge.applyList('numbering');`,
  
  // Indents
  'WORD.HOME.INDENT.INCREASE': `context.engines.editorBridge.applyIndent('increase');`,
  'WORD.HOME.INDENT.DECREASE': `context.engines.editorBridge.applyIndent('decrease');`,
  
  // Blocks
  'WORD.HOME.STYLE.NORMAL': `context.engines.editorBridge.applyBlock('p');`,
  'WORD.HOME.STYLE.HEADING1': `context.engines.editorBridge.applyBlock('h1');`,
  'WORD.HOME.STYLE.HEADING2': `context.engines.editorBridge.applyBlock('h2');`,
  'WORD.HOME.STYLE.TITLE': `context.engines.editorBridge.applyBlock('h1');`,
  
  // Clipboard
  'WORD.HOME.COPY': `context.engines.editorBridge.copy();`,
  'WORD.HOME.CUT': `context.engines.editorBridge.cut();`,
  'WORD.HOME.PASTE': `context.engines.editorBridge.paste();`,
  
  // Selection
  'WORD.HOME.SELECT.ALL': `context.engines.editorBridge.selectAll();`,
};

const files = fs.readdirSync(COMMANDS_DIR).filter(f => f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(COMMANDS_DIR, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const idMatch = content.match(/id\s*=\s*'([^']+)'/);
  if (!idMatch) return;
  const id = idMatch[1];
  
  let executeBody = MAPPINGS[id] || `console.log(\`[\${this.id}] Executing...\`);`;
  if (id === 'WORD.HOME.PASTE') {
    // async execution for paste
    content = content.replace(
      /execute\(context: ICommandContext\): (Promise<ICommandResult> | ICommandResult|ICommandResult) {[\s\S]*?return { success: true };\n  }/,
      `async execute(context: ICommandContext): Promise<ICommandResult> {
    if (context.engines.editorBridge) {
      ${executeBody}
    }
    return { success: true };
  }`
    );
  } else {
    content = content.replace(
      /execute\(context: ICommandContext\): (Promise<ICommandResult> | ICommandResult|ICommandResult) {[\s\S]*?return { success: true };\n  }/,
      `execute(context: ICommandContext): ICommandResult {
    if (context.engines.editorBridge) {
      ${executeBody}
    }
    return { success: true };
  }`
    );
  }

  content = content.replace(
    /canExecute\(context: ICommandContext\): boolean {[\s\S]*?}/,
    `canExecute(context: ICommandContext): boolean {
    return !!context.engines.editorBridge;
  }`
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
