// ─────────────────────────────────────────────────────────────────────────────
// Command Dispatcher — Validates, executes and routes commands to history
// Ref: WORD_COMMANDS.md §3, §11
// ─────────────────────────────────────────────────────────────────────────────

import type { CommandRegistry } from './CommandRegistry';
import type { ICommandContext, ICommandResult } from './models/ICommand';

export class CommandDispatcher {
  constructor(
    private registry: CommandRegistry,
    private baseContext: Omit<ICommandContext, 'payload'>
  ) {}

  async execute(commandId: string, payload?: any): Promise<ICommandResult> {
    const command = this.registry.getCommand(commandId);
    if (!command) {
      return { success: false, errorMessage: `Command ${commandId} not found` };
    }

    const context: ICommandContext = {
      ...this.baseContext,
      payload
    };

    // 1. Validation Flow
    if (!command.canExecute(context)) {
      console.warn(`[CommandDispatcher] Command ${commandId} cannot execute in current context.`);
      return { success: false, errorMessage: 'Command cannot execute.' };
    }

    // 2. Execution Flow
    console.log(`[CommandDispatcher] Executing ${commandId} | Payload:`, payload);
    
    try {
      const result = await command.execute(context);
      
        // Wrap the word command into a history-engine compatible command
        this.baseContext.engines.historyManager.executeCommand({
          execute: () => {},
          undo: () => { 
            // In a real integration, this would invoke the specific word command's undo
            // For contentEditable MVP, rely on native undo
            if (context.engines.editorBridge) {
              document.execCommand('undo');
            }
          },
          redo: () => {
            if (context.engines.editorBridge) {
              document.execCommand('redo');
            }
          }
        });

      return result;
    } catch (error: any) {
      console.error(`[CommandDispatcher] Execution failed for ${commandId}:`, error);
      return { success: false, errorMessage: error.message };
    }
  }
}
