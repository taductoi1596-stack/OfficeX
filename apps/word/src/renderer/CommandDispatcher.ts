/**
 * COMMAND DISPATCHER
 *
 * Tầng trung gian giữa Ribbon UI và EditorAPI.
 * 
 * Flow:
 *   Ribbon.onClick(cmdId)
 *     → CommandDispatcher.dispatch(cmdId, payload?)
 *       → HomeCommandRegistry.get(cmdId).handler(EditorAPI, payload)
 *         → EditorAPI (Document Engine)
 *           → HistoryEngine.push()
 *             → LayoutEngine.reflow()
 *               → RenderEngine.repaint()
 *                 → RibbonController.refresh()
 */

import { EditorAPI } from './editorApi';

export interface CommandDefinition {
  id: string;
  name: string;
  icon?: string;
  shortcut?: string;
  isEnabled?: (state: any) => boolean;
  isActive?: (state: any) => boolean;
  handler: (api: any, payload?: any) => void;
}

export interface DispatchResult {
  success:   boolean;
  commandId: string;
  error?:    string;
}

class CommandDispatcherImpl {
  private registries: Map<string, CommandDefinition> = new Map();
  private middlewares: Array<(id: string, payload: unknown) => boolean> = [];
  private listeners: Record<string, Array<(payload: any) => void>> = {};

  /**
   * Register a batch of commands.
   */
  registerRegistry(commands: CommandDefinition[]) {
    for (const def of commands) {
      this.registries.set(def.id, def);
    }
  }

  getCommand(id: string): CommandDefinition | undefined {
    return this.registries.get(id);
  }

  getAllCommands(): CommandDefinition[] {
    return Array.from(this.registries.values());
  }

  /**
   * Add middleware. Return true to cancel the dispatch chain.
   */
  use(fn: (id: string, payload: unknown) => boolean): () => void {
    this.middlewares.push(fn);
    return () => { this.middlewares.splice(this.middlewares.indexOf(fn), 1); };
  }

  /**
   * Subscribe to a specific command.
   */
  subscribe(commandId: string, fn: (payload: any) => void): () => void {
    if (!this.listeners[commandId]) this.listeners[commandId] = [];
    this.listeners[commandId].push(fn);
    return () => { this.listeners[commandId] = this.listeners[commandId].filter(f => f !== fn); };
  }

  /**
   * Dispatch a command by ID.
   * Returns a result object with success/failure info.
   */
  dispatch(commandId: string, payload?: unknown): DispatchResult {
    // Run middlewares
    for (const mw of this.middlewares) {
      if (mw(commandId, payload)) {
        return { success: false, commandId, error: 'Cancelled by middleware' };
      }
    }

    const def = this.getCommand(commandId);
    if (!def) {
      console.warn(`[CommandDispatcher] Unknown command: ${commandId}`);
      return { success: false, commandId, error: `Command not registered: ${commandId}` };
    }

    const api = EditorAPI;
    if (!api) {
      console.warn(`[CommandDispatcher] No EditorAPI registered`);
      return { success: false, commandId, error: 'Editor not ready' };
    }

    // Check isEnabled
    const state = EditorAPI.getState();
    if (def.isEnabled && !def.isEnabled(state)) {
      return { success: false, commandId, error: 'Command disabled' };
    }

    try {
      def.handler(api, payload);
      if (this.listeners[commandId]) {
        this.listeners[commandId].forEach(fn => fn(payload));
      }
      return { success: true, commandId };
    } catch (err) {
      console.error(`[CommandDispatcher] Error executing ${commandId}:`, err);
      return { success: false, commandId, error: String(err) };
    }
  }

  /**
   * Check if a command is currently active (button lit up).
   */
  isActive(commandId: string): boolean {
    const def = this.getCommand(commandId);
    if (!def?.isActive) return false;
    return def.isActive(EditorAPI.getState());
  }

  /**
   * Check if a command is currently enabled.
   */
  isEnabled(commandId: string): boolean {
    const def = this.getCommand(commandId);
    if (!def) return false;
    if (!def.isEnabled) return true;
    return def.isEnabled(EditorAPI.getState());
  }
}

export const CommandDispatcher = new CommandDispatcherImpl();
