import { CommandDefinition } from '../CommandDispatcher';
function cmd(id: string, name: string, handler: (payload?: any) => void): CommandDefinition {
  return { id, name, handler };
}
export class DrawAICommandRegistry {
  static all(): CommandDefinition[] {
    return [
      cmd('WORD.AI.INK_BEAUTIFY', 'Beautify Ink', () => {}),
      cmd('WORD.AI.INK_CLEAN', 'Clean Handwriting', () => {}),
      cmd('WORD.AI.INK_SKETCH', 'Convert Sketch', () => {}),
      cmd('WORD.AI.INK_DIAGRAM', 'Generate Diagram', () => {}),
      cmd('WORD.AI.INK_SHAPE', 'Generate Shape', () => {}),
      cmd('WORD.AI.INK_EXPLAIN', 'Explain Drawing', () => {}),
    ];
  }
}