/**
 * AIPanelManager.ts
 *
 * Enterprise Singleton AI Panel Manager for OfficeX Word.
 * Controls lifecycle, state, switching, persistence of all AI panels.
 * The Ribbon and commands NEVER create panels directly — they call this manager.
 */

import { CommandDispatcher } from './CommandDispatcher';
import { EditorAPI } from './editorApi';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PanelId =
  | 'rewrite'
  | 'summarize'
  | 'translate'
  | 'dictate'
  | 'chat';

export type DockPosition = 'right' | 'left' | 'floating';

export type PanelLifecycleState =
  | 'idle'       // Never created
  | 'created'    // Instance exists but not visible
  | 'visible'    // Currently shown
  | 'hidden'     // Mounted but hidden (state preserved)
  | 'error';

export type PanelState = {
  id: PanelId;
  lifecycle: PanelLifecycleState;
  title: string;
  commandId: string;
  contextText: string;       // Snapshot of selection when panel was opened
  lastScrollTop: number;
};

export type PanelManagerLayout = {
  activePanelId: PanelId | null;
  dockPosition: DockPosition;
  panelWidth: number;        // px
  pinned: boolean;
  autoHide: boolean;
};

type PanelManagerListener = (layout: PanelManagerLayout, panels: Map<PanelId, PanelState>) => void;

// ─── Persistence Keys ─────────────────────────────────────────────────────────

const STORAGE_KEY_LAYOUT = 'officex.ai.panelManager.layout';

const DEFAULT_LAYOUT: PanelManagerLayout = {
  activePanelId: null,
  dockPosition: 'right',
  panelWidth: 420,
  pinned: true,
  autoHide: false,
};

const PANEL_DEFS: Array<{ id: PanelId; title: string; commandId: string }> = [
  { id: 'rewrite',   title: 'AI Rewrite',   commandId: 'WORD.AI.REWRITE' },
  { id: 'summarize', title: 'AI Summarize',  commandId: 'WORD.AI.SUMMARIZE' },
  { id: 'translate', title: 'AI Translate',  commandId: 'WORD.AI.TRANSLATE' },
  { id: 'dictate',   title: 'Dictate',       commandId: 'WORD.DICTATE.START' },
  { id: 'chat',      title: 'AI Chat',       commandId: 'WORD.AI.CHAT.OPEN' },
];

const CMD_TO_PANEL: Record<string, PanelId> = {
  'WORD.AI.REWRITE':    'rewrite',
  'WORD.AI.SUMMARIZE':  'summarize',
  'WORD.AI.TRANSLATE':  'translate',
  'WORD.DICTATE.START': 'dictate',
  'WORD.AI.CHAT.OPEN':  'chat',
};

// ─── AIPanelManager Singleton ─────────────────────────────────────────────────

class AIPanelManagerImpl {
  private layout: PanelManagerLayout;
  private panels: Map<PanelId, PanelState> = new Map();
  private listeners: Set<PanelManagerListener> = new Set();
  private unsubscribers: Array<() => void> = [];
  private _initialized = false;

  constructor() {
    // Restore layout from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LAYOUT);
      this.layout = saved ? { ...DEFAULT_LAYOUT, ...JSON.parse(saved) } : { ...DEFAULT_LAYOUT };
    } catch {
      this.layout = { ...DEFAULT_LAYOUT };
    }

    // Initialise panel states
    for (const def of PANEL_DEFS) {
      this.panels.set(def.id, {
        id: def.id,
        lifecycle: 'idle',
        title: def.title,
        commandId: def.commandId,
        contextText: '',
        lastScrollTop: 0,
      });
    }
  }

  initialize() {
    if (this._initialized) return;
    this._initialized = true;

    // Subscribe to AI panel commands
    const AI_COMMAND_MAP: Record<string, PanelId> = {
      'WORD.AI.OPEN': 'chat',
      'WORD.AI.CHAT': 'chat',
      'WORD.AI.CHAT.OPEN': 'chat',
      'WORD.AI.OPEN_SIDEBAR': 'chat',
      'WORD.AI.NEW_CHAT': 'chat',
      'WORD.AI.RECENT_CHATS': 'chat',
      'WORD.AI.PINNED_CHATS': 'chat',
      'WORD.AI.HISTORY': 'chat',
      'WORD.AI.SETTINGS': 'chat',
      'WORD.AI.EXPLAIN': 'chat',
      'WORD.AI.ASK': 'chat',
      'WORD.AI.SEARCH': 'chat',
      'WORD.AI.FIND_SIMILAR': 'chat',
      'WORD.AI.QUESTIONS': 'chat',
      'WORD.AI.FLASHCARD': 'chat',
      'WORD.AI.REVIEW': 'chat',
      'WORD.AI.REVIEW_SELECTION': 'chat',
      'WORD.AI.ACCESSIBILITY': 'chat',
      'WORD.AI.READABILITY': 'chat',
      'WORD.AI.DUPLICATE': 'chat',
      'WORD.AI.CONTRADICTION': 'chat',
      'WORD.AI.TRACK_CHANGES_REVIEW': 'chat',
      'WORD.AI.TABLE': 'chat',
      'WORD.AI.SMARTART': 'chat',
      'WORD.AI.DIAGRAM': 'chat',
      'WORD.AI.TIMELINE': 'chat',
      'WORD.AI.MINDMAP': 'chat',
      'WORD.AI.FLOWCHART': 'chat',
      'WORD.AI.IMAGEPROMPT': 'chat',

      'WORD.AI.REWRITE': 'rewrite',
      'WORD.AI.CONTINUE': 'rewrite',
      'WORD.AI.SHORTEN': 'rewrite',
      'WORD.AI.EXPAND': 'rewrite',
      'WORD.AI.TONE': 'rewrite',
      'WORD.AI.GRAMMAR': 'rewrite',

      'WORD.AI.SUMMARIZE': 'summarize',
      'WORD.AI.OUTLINE': 'summarize',
      'WORD.AI.TITLE': 'summarize',
      'WORD.AI.TOC': 'summarize',
      'WORD.AI.FAQ': 'summarize',
      'WORD.AI.REFERENCE': 'summarize',
      'WORD.AI.METADATA': 'summarize',

      'WORD.AI.TRANSLATE': 'translate',
      'WORD.AI.TRANSLATE_PAGE': 'translate',
      'WORD.AI.TRANSLATE_DOCUMENT': 'translate',

      'WORD.DICTATE.START': 'dictate',
    };

    Object.entries(AI_COMMAND_MAP).forEach(([cmdId, panelId]) => {
      const unsub = CommandDispatcher.subscribe(cmdId, () => {
        this._handlePanelCommand(panelId, cmdId);
      });
      this.unsubscribers.push(unsub);
    });

    // Close / hide commands
    const unsubClose = CommandDispatcher.subscribe('WORD.AI.PANEL.CLOSE', () => this.closeActive());
    const unsubHide  = CommandDispatcher.subscribe('WORD.AI.PANEL.HIDE',  () => this.hideActive());
    const unsubPin   = CommandDispatcher.subscribe('WORD.AI.PANEL.PIN',   () => this.togglePin());
    this.unsubscribers.push(unsubClose, unsubHide, unsubPin);
  }

  dispose() {
    this.unsubscribers.forEach(fn => fn());
    this.unsubscribers = [];
    this._initialized = false;
  }

  // ── Command Handler ──────────────────────────────────────────────────────────

  private _handlePanelCommand(panelId: PanelId, _cmd: string) {
    const current = this.layout.activePanelId;

    if (current === panelId) {
      // Toggle: clicking same button closes/hides the panel
      if (this.layout.pinned) {
        this._hidePanel(panelId);
      } else {
        this._closePanel(panelId);
      }
    } else {
      // Switch to new panel (preserves old panel state = 'hidden')
      if (current) {
        this._hidePanel(current);
      }
      this._openPanel(panelId);
    }

    this._saveLayout();
    this._notify();
  }

  // ── Panel Lifecycle ──────────────────────────────────────────────────────────

  private _openPanel(id: PanelId) {
    const state = this.panels.get(id)!;

    // Snapshot editor context
    const api = EditorAPI.getLegacy();
    state.contextText = api?.getSelectedText() ?? '';

    state.lifecycle = 'visible';
    this.layout.activePanelId = id;
  }

  private _hidePanel(id: PanelId) {
    const state = this.panels.get(id);
    if (state) state.lifecycle = 'hidden';
    if (this.layout.activePanelId === id) this.layout.activePanelId = null;
  }

  private _closePanel(id: PanelId) {
    const state = this.panels.get(id);
    if (state) state.lifecycle = 'idle';
    if (this.layout.activePanelId === id) this.layout.activePanelId = null;
  }

  // ── Public API ────────────────────────────────────────────────────────────────

  openPanel(id: PanelId) {
    const current = this.layout.activePanelId;
    if (current && current !== id) this._hidePanel(current);
    this._openPanel(id);
    this._saveLayout();
    this._notify();
  }

  closeActive() {
    const id = this.layout.activePanelId;
    if (id) { this._closePanel(id); this._saveLayout(); this._notify(); }
  }

  hideActive() {
    const id = this.layout.activePanelId;
    if (id) { this._hidePanel(id); this._saveLayout(); this._notify(); }
  }

  togglePin() {
    this.layout.pinned = !this.layout.pinned;
    this._saveLayout();
    this._notify();
  }

  setDock(pos: DockPosition) {
    this.layout.dockPosition = pos;
    this._saveLayout();
    this._notify();
  }

  setWidth(px: number) {
    this.layout.panelWidth = Math.max(320, Math.min(700, px));
    this._saveLayout();
    this._notify();
  }

  saveScrollTop(id: PanelId, top: number) {
    const s = this.panels.get(id);
    if (s) s.lastScrollTop = top;
  }

  getLayout(): PanelManagerLayout { return this.layout; }
  getPanels(): Map<PanelId, PanelState> { return this.panels; }
  getActivePanel(): PanelState | null {
    return this.layout.activePanelId
      ? (this.panels.get(this.layout.activePanelId) ?? null)
      : null;
  }

  isPanelVisible(id: PanelId): boolean {
    return this.panels.get(id)?.lifecycle === 'visible';
  }

  getPanelDef(id: PanelId) {
    return PANEL_DEFS.find(d => d.id === id) ?? null;
  }

  // ── Subscriptions ─────────────────────────────────────────────────────────────

  subscribe(fn: PanelManagerListener): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private _notify() {
    const layout = { ...this.layout };
    const panels = new Map(this.panels);
    this.listeners.forEach(fn => fn(layout, panels));
  }

  // ── Persistence ───────────────────────────────────────────────────────────────

  private _saveLayout() {
    try {
      localStorage.setItem(STORAGE_KEY_LAYOUT, JSON.stringify(this.layout));
    } catch (_) {}
  }
}

export const AIPanelManager = new AIPanelManagerImpl();
export { CMD_TO_PANEL, PANEL_DEFS };
