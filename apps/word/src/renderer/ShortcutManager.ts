/**
 * SHORTCUT MANAGER
 *
 * Binds keyboard shortcuts → Command IDs.
 * Installs a global keydown listener.
 * All shortcuts are defined in HomeCommandRegistry; this class reads them
 * and dispatches through CommandDispatcher.
 *
 * Design:
 *   - Priority: registry shortcuts first, custom bindings after
 *   - Supports Ctrl, Shift, Alt modifiers
 *   - Does NOT intercept if focus is in an <input> or <textarea>
 *     EXCEPT the hidden editor textarea (class ox-hidden-input)
 */

import { HomeCommandRegistry } from './homeCommands';
import { CommandDispatcher } from './CommandDispatcher';
import { FileCommandRegistry } from './file/fileCommands';
import { AICommandRegistry } from './ai_commands/aiCommands';

// ─── Key combo encoding ────────────────────────────────────────────────────────

function encodeKey(e: KeyboardEvent): string {
  const parts: string[] = [];
  if (e.ctrlKey  || e.metaKey) parts.push('ctrl');
  if (e.shiftKey)               parts.push('shift');
  if (e.altKey)                 parts.push('alt');
  parts.push(e.key.toLowerCase());
  return parts.join('+');
}

function shortcutToKey(shortcut: string): string {
  return shortcut
    .toLowerCase()
    .replace(/\s*\+\s*/g, '+')
    .replace('ctrl', 'ctrl')
    .replace('cmd',  'ctrl');
}

// ─── Shortcut Manager ─────────────────────────────────────────────────────────

class ShortcutManagerImpl {
  /** Custom bindings added at runtime (override registry) */
  private custom = new Map<string, string>(); // keyCombo → commandId
  /** Reverse map: commandId → keyCombo (from registry) */
  private registryMap = new Map<string, string>();
  /** Whether global listener is installed */
  private installed = false;

  constructor() {
    this.buildRegistryMap();
  }

  public buildRegistryMap() {
    this.registryMap.clear();
    const allCmds = CommandDispatcher.getAllCommands();
    for (const cmd of allCmds) {
      if (cmd.shortcut) {
        const key = shortcutToKey(cmd.shortcut);
        this.registryMap.set(key, cmd.id);
      }
    }
  }

  /** Bind a custom shortcut (overrides registry) */
  bind(shortcut: string, commandId: string): void {
    this.custom.set(shortcutToKey(shortcut), commandId);
  }

  /** Remove a custom binding */
  unbind(shortcut: string): void {
    this.custom.delete(shortcutToKey(shortcut));
  }

  /** Get the command ID for a key combo, or undefined */
  resolve(keyCombo: string): string | undefined {
    if (this.registryMap.size === 0) {
      this.buildRegistryMap();
    }
    return this.custom.get(keyCombo) ?? this.registryMap.get(keyCombo);
  }

  /** Get the shortcut string for a given command ID */
  shortcutFor(commandId: string): string | undefined {
    for (const [k, v] of this.custom.entries()) { if (v === commandId) return k; }
    return CommandDispatcher.getCommand(commandId)?.shortcut;
  }

  /** Install global keydown handler */
  install(): () => void {
    if (this.installed) return () => {};
    this.installed = true;
    this.buildRegistryMap();

    let altNPressed = false;

    const handler = (e: KeyboardEvent) => {
      // Handle Sequence Shortcuts
      if (altNPressed) {
        if (e.key.toLowerCase() === 'p') {
          e.preventDefault();
          CommandDispatcher.dispatch('WORD.INSERT.PICTURE.FILE');
          altNPressed = false;
          return;
        }
        // If they press any other key, reset the sequence unless it's a modifier
        if (e.key !== 'Alt' && e.key !== 'Control' && e.key !== 'Shift') {
          altNPressed = false;
        }
      }

      if (e.altKey && e.key.toLowerCase() === 'n') {
        altNPressed = true;
        e.preventDefault();
        return;
      }

      // Don't intercept regular inputs UNLESS it's our hidden editor textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'SELECT';
      const isEditorTA = target.tagName === 'TEXTAREA' && target.style.position === 'fixed';
      // Regular text areas (like Find box) should NOT be intercepted
      const isUITextarea = target.tagName === 'TEXTAREA' && !isEditorTA;
      if (isInput || isUITextarea) return;

      const key = encodeKey(e);
      const cmdId = this.resolve(key);

      if (cmdId) {
        // Native text editing keys inside editor textarea are left to native DOM handling
        const nativeTextEditKeys = ['ctrl+c', 'ctrl+v', 'ctrl+x', 'ctrl+a', 'ctrl+z', 'ctrl+y', 'enter'];
        const isNativeEditInTA = isEditorTA && nativeTextEditKeys.includes(key);

        if (!isNativeEditInTA) {
          e.preventDefault();
          e.stopPropagation();
          CommandDispatcher.dispatch(cmdId);
        }
      }
    };

    window.addEventListener('keydown', handler, { capture: true });
    this.installed = true;

    return () => {
      window.removeEventListener('keydown', handler, { capture: true });
      this.installed = false;
    };
  }
}

export const ShortcutManager = new ShortcutManagerImpl();
