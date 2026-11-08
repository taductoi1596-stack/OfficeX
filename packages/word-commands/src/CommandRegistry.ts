// ─────────────────────────────────────────────────────────────────────────────
// Command Registry — Stores and retrieves registered commands
// Ref: WORD_COMMANDS.md §3
// ─────────────────────────────────────────────────────────────────────────────

import type { ICommand } from './models/ICommand';

export class CommandRegistry {
  private commands = new Map<string, ICommand>();

  registerCommand(command: ICommand): void {
    if (this.commands.has(command.id)) {
      console.warn(`[CommandRegistry] Command ${command.id} is already registered. Overwriting.`);
    }
    this.commands.set(command.id, command);
  }

  getCommand(id: string): ICommand | undefined {
    return this.commands.get(id);
  }

  getAllCommands(): ICommand[] {
    return Array.from(this.commands.values());
  }
}
