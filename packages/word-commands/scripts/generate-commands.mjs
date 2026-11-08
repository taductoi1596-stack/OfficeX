import fs from 'fs';
import path from 'path';

// Resolve paths relative to this script
const REGISTRY_PATH = path.resolve(process.cwd(), '../../registry/home_commands.md');
const OUT_DIR = path.resolve(process.cwd(), 'src/commands/home');
const INDEX_PATH = path.resolve(process.cwd(), 'src/index.ts');

if (!fs.existsSync(REGISTRY_PATH)) {
  console.error('Error: Could not find registry at', REGISTRY_PATH);
  process.exit(1);
}

const content = fs.readFileSync(REGISTRY_PATH, 'utf-8');

// Regex to find table rows
// Example row: | WORD.HOME.PASTE | Paste | Clipboard Engine |
const rowRegex = /\|\s*(WORD\.HOME\.[A-Z0-9.]+)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/g;

let match;
const commands = [];

while ((match = rowRegex.exec(content)) !== null) {
  const [_, id, displayName, targetEngine] = match;
  commands.push({
    id: id.trim(),
    displayName: displayName.trim(),
    targetEngine: targetEngine.trim()
  });
}

console.log(`Found ${commands.length} commands in registry.`);

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Generate TS class for each command
const generatedClassNames = [];

for (const cmd of commands) {
  // Convert ID (WORD.HOME.PASTE.SPECIAL) to ClassName (PasteSpecialCommand)
  const parts = cmd.id.replace('WORD.HOME.', '').split('.');
  const camelParts = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
  const className = camelParts.join('') + 'Command';
  
  generatedClassNames.push({ className, id: cmd.id });

  const fileName = `${className}.ts`;
  const filePath = path.join(OUT_DIR, fileName);
  
  // Create safe camel case engine reference (e.g. Clipboard Engine -> clipboardManager)
  const engineRef = cmd.targetEngine.toLowerCase().replace(' engine', 'Manager');

  const fileContent = `// ─────────────────────────────────────────────────────────────────────────────
// ${cmd.displayName} Command
// Auto-generated from registry/home_commands.md
// ─────────────────────────────────────────────────────────────────────────────

import type { ICommand, ICommandContext, ICommandResult } from '../../models/ICommand';

export class ${className} implements ICommand {
  id = '${cmd.id}';
  displayName = '${cmd.displayName}';
  category = 'Home';

  canExecute(context: ICommandContext): boolean {
    return !!context.engines.${engineRef};
  }

  execute(context: ICommandContext): ICommandResult {
    console.log(\`[\${this.id}] Executing via \${'${cmd.targetEngine}'}...\`);
    return { success: true };
  }

  undo(context: ICommandContext): ICommandResult {
    console.log(\`[\${this.id}] Undo action...\`);
    return { success: true };
  }

  redo(context: ICommandContext): ICommandResult {
    return this.execute(context);
  }

  serialize(): string {
    return JSON.stringify({ id: this.id });
  }
}
`;

  fs.writeFileSync(filePath, fileContent, 'utf-8');
}

console.log(`Generated ${commands.length} command files in ${OUT_DIR}`);

// ─────────────────────────────────────────────────────────────────────────────
// Now, update index.ts to export and register all of them
// ─────────────────────────────────────────────────────────────────────────────

let indexFile = `// @officex/word-commands — Public API
export type { ICommand, ICommandContext, ICommandResult } from './models/ICommand';
export { CommandRegistry } from './CommandRegistry';
export { CommandDispatcher } from './CommandDispatcher';

// --- Auto-Generated Imports ---
`;

for (const cmd of generatedClassNames) {
  indexFile += `import { ${cmd.className} } from './commands/home/${cmd.className}';\n`;
}

indexFile += `
/**
 * Convenience method to populate a registry with standard Word commands
 */
export function registerCoreCommands(registry: import('./CommandRegistry').CommandRegistry) {
`;

for (const cmd of generatedClassNames) {
  indexFile += `  registry.registerCommand(new ${cmd.className}());\n`;
}

indexFile += `}\n`;

fs.writeFileSync(INDEX_PATH, indexFile, 'utf-8');
console.log('Updated index.ts to export and register all commands.');
