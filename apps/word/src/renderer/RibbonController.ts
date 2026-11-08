/**
 * RIBBON CONTROLLER
 *
 * Manages the Home Ribbon's reactive state.
 * Subscribes to EditorAPI state notifications.
 * Computes which buttons are active/enabled/hovered.
 * Notifies React components to re-render via a simple pub-sub.
 *
 * Usage (in React component):
 *   const { active, enabled } = useRibbonState();
 *
 *   active('WORD.HOME.BOLD')  // → true/false
 *   enabled('WORD.HOME.UNDO') // → true/false
 */

import { useEffect, useState } from 'react';
import { EditorAPI, EditorState, DEFAULT_STATE } from './editorApi';
import { CommandDispatcher } from './CommandDispatcher';

// ─── Internal state ───────────────────────────────────────────────────────────

type RibbonState = {
  editorState: EditorState;
  // Precomputed active/enabled maps for O(1) lookup in render
  active:  Map<string, boolean>;
  enabled: Map<string, boolean>;
};

function computeMaps(s: EditorState): Pick<RibbonState, 'active' | 'enabled'> {
  const active  = new Map<string, boolean>();
  const enabled = new Map<string, boolean>();
  for (const cmd of CommandDispatcher.getAllCommands()) {
    active.set(cmd.id,  cmd.isActive  ? cmd.isActive(s)  : false);
    enabled.set(cmd.id, cmd.isEnabled ? cmd.isEnabled(s) : true);
  }
  return { active, enabled };
}

// ─── Ribbon Controller ────────────────────────────────────────────────────────

class RibbonControllerImpl {
  private _state: RibbonState = {
    editorState: DEFAULT_STATE,
    ...computeMaps(DEFAULT_STATE),
  };
  private listeners = new Set<(s: RibbonState) => void>();

  constructor() {
    // Subscribe to editor state changes
    EditorAPI.subscribe(this.handleEditorState);
  }

  private handleEditorState = (editorState: EditorState) => {
    this._state = { editorState, ...computeMaps(editorState) };
    this.listeners.forEach(fn => fn(this._state));
  };

  public refresh() {
    this._state = { ...this._state, ...computeMaps(this._state.editorState) };
    this.listeners.forEach(fn => fn(this._state));
  }

  getState(): RibbonState { return this._state; }

  subscribe(fn: (s: RibbonState) => void): () => void {
    this.listeners.add(fn);
    fn(this._state);
    return () => this.listeners.delete(fn);
  }

  /** Whether a button should appear pressed/lit */
  isActive(commandId: string): boolean {
    return this._state.active.get(commandId) ?? false;
  }

  /** Whether a button is clickable */
  isEnabled(commandId: string): boolean {
    return this._state.enabled.get(commandId) ?? true;
  }

  /** Execute a command (same as CommandDispatcher.dispatch) */
  dispatch(commandId: string, payload?: unknown) {
    CommandDispatcher.dispatch(commandId, payload);
  }

  /** Current page count */
  get pageCount()   { return this._state.editorState.pageCount; }
  get currentPage() { return this._state.editorState.currentPage; }
  get wordCount()   { return this._state.editorState.wordCount; }
  get canUndo()     { return this._state.editorState.canUndo; }
  get canRedo()     { return this._state.editorState.canRedo; }
  get fontFamily()  { return this._state.editorState.fontFamily; }
  get fontSize()    { return this._state.editorState.fontSize; }
}

export const RibbonController = new RibbonControllerImpl();

// ─── React Hook ──────────────────────────────────────────────────────────────

/**
 * useRibbonState()
 *
 * React hook that subscribes to RibbonController and re-renders
 * whenever the editor state changes.
 *
 * Usage:
 *   const rs = useRibbonState();
 *   <button className={rs.active('WORD.HOME.BOLD') ? 'active' : ''}>
 */
export function useRibbonState() {
  const [state, setState] = useState<RibbonState>(() => RibbonController.getState());

  useEffect(() => {
    return RibbonController.subscribe(setState);
  }, []);

  return {
    // Whether a command button should be lit up
    active:  (cmdId: string) => state.active.get(cmdId) ?? false,
    // Whether a command button is enabled
    enabled: (cmdId: string) => state.enabled.get(cmdId) ?? true,
    // Dispatch shorthand
    dispatch: (cmdId: string, payload?: unknown) => RibbonController.dispatch(cmdId, payload),
    // Metadata
    editorState: state.editorState,
    fontFamily:  state.editorState.fontFamily,
    fontSize:    state.editorState.fontSize,
    canUndo:     state.editorState.canUndo,
    canRedo:     state.editorState.canRedo,
    isInTable:   state.editorState.isInTable,
    pageCount:   state.editorState.pageCount,
    currentPage: state.editorState.currentPage,
    wordCount:   state.editorState.wordCount,
    currentParaFmt: state.editorState.currentParaFmt,
    currentRunFmt: state.editorState.currentRunFmt,
  };
}
