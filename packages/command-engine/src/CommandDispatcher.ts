import { Command, HistoryManager } from '@officex/history-engine';
import { ValidationEngine } from './ValidationEngine';

export class CommandDispatcher {
  private historyManager: HistoryManager;
  private validationEngine: ValidationEngine;

  constructor(historyManager: HistoryManager, validationEngine: ValidationEngine) {
    this.historyManager = historyManager;
    this.validationEngine = validationEngine;
  }

  /**
   * The entry point for ALL mutations in OfficeX.
   * @param command The command to execute
   * @returns true if execution succeeded, false if validation rejected it.
   */
  public dispatch(command: Command): boolean {
    // 1. Validate the command
    if (!this.validationEngine.validate(command)) {
      console.warn(`Command '${command.name}' was blocked by Validation Engine.`);
      return false;
    }

    // 2. Dispatch to History Engine to execute and record
    try {
      this.historyManager.executeCommand(command);
      return true;
    } catch (e) {
      console.error(`Command '${command.name}' failed to execute:`, e);
      return false;
    }
  }
}
