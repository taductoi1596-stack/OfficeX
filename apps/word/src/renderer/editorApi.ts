import { CommandDispatcher } from './CommandDispatcher';
import * as API from './api';
import { Align } from './api';

// ─── Editor State ─────────────────────────────────────────────────────────────

export type EditorState = {
  bold:        boolean;
  italic:      boolean;
  underline:   boolean;
  strike:      boolean;
  superscript: boolean;
  subscript:   boolean;
  fontFamily:  string;
  fontSize:    number;
  align:       string;
  bullets:     boolean;
  numbering:   boolean;
  canUndo:     boolean;
  canRedo:     boolean;
  pageCount:   number;
  currentPage: number;
  wordCount:   number;
  formatPainterActive: boolean;
  clipboardPanelOpen: boolean;

  // Advanced Font States
  doubleUnderline: boolean;
  doubleStrike: boolean;
  smallCaps: boolean;
  allCaps: boolean;
  hiddenText: boolean;
  color: string;
  highlightColor: string;
  letterSpacing: number;
  fontScale: number;
  zoom: number;

  currentParaFmt?: any;
  currentRunFmt?: any;
  isInTable: boolean;

  // SmartArt State
  selectedSmartArtId?: string;
  selectedSmartArtNodeId?: string;
};

export const DEFAULT_STATE: EditorState = {
  bold: false, italic: false, underline: false, strike: false,
  superscript: false, subscript: false,
  fontFamily: 'Calibri', fontSize: 12,
  align: 'left', bullets: false, numbering: false,
  canUndo: false, canRedo: false,
  pageCount: 1, currentPage: 1, wordCount: 0,
  formatPainterActive: false,
  clipboardPanelOpen: false,
  doubleUnderline: false,
  doubleStrike: false,
  smallCaps: false,
  allCaps: false,
  hiddenText: false,
  color: '#000000',
  highlightColor: 'transparent',
  letterSpacing: 0,
  fontScale: 100,
  zoom: 100,
  isInTable: false,
  selectedSmartArtId: undefined,
  selectedSmartArtNodeId: undefined
};

// ─── Undo / Redo Hooks ────────────────────────────────────────────────────────

type UndoRedoHook = () => void;

class UndoHookManager {
  private undoHooks = new Set<UndoRedoHook>();
  private redoHooks = new Set<UndoRedoHook>();

  onBeforeUndo(fn: UndoRedoHook): () => void {
    this.undoHooks.add(fn);
    return () => this.undoHooks.delete(fn);
  }

  onBeforeRedo(fn: UndoRedoHook): () => void {
    this.redoHooks.add(fn);
    return () => this.redoHooks.delete(fn);
  }

  fireUndo() { this.undoHooks.forEach(fn => fn()); }
  fireRedo() { this.redoHooks.forEach(fn => fn()); }
}

export const UndoRedoHooks = new UndoHookManager();

// ─── EditorAPI Registry ───────────────────────────────────────────────────────

type StateListener = (s: EditorState) => void;

class EditorApiRegistry {
  private listeners = new Set<StateListener>();
  private _state: EditorState = { ...DEFAULT_STATE };
  private _legacyImpl: API.IEditorAPI | null = null;

  // Exposed Engine APIs
  public Document: API.IDocumentAPI = API.DocumentStub;
  public Text: API.ITextAPI = API.TextStub;
  public Style: API.IStyleAPI = API.StyleStub;
  public Layout: API.ILayoutAPI = API.LayoutStub;
  public Pagination: API.IPaginationAPI = API.PaginationStub;
  public Render: API.IRenderAPI = API.RenderStub;
  public Viewport: API.IViewportAPI = API.ViewportStub;
  public Table: API.ITableAPI = API.TableStub;
  public Image: API.IImageAPI = API.ImageStub;
  public Shape: API.IShapeAPI = API.ShapeStub;
  public Chart: API.IChartAPI = API.ChartStub;
  public SmartArt: API.ISmartArtAPI = API.SmartArtStub;
  public Equation: API.IEquationAPI = API.EquationStub;
  public HeaderFooter: API.IHeaderFooterAPI = API.HeaderFooterStub;
  public Comment: API.ICommentAPI = API.CommentStub;
  public TrackChanges: API.ITrackChangesAPI = API.TrackChangesStub;
  public Bookmark: API.IBookmarkAPI = API.BookmarkStub;
  public AI: API.IAIAPI = API.AIStub;
  public Plugin: API.IPluginAPI = API.PluginStub;

  /** Allows replacing stubs with real implementations */
  registerModule<K extends keyof EditorApiRegistry>(moduleName: K, impl: any) {
    (this as any)[moduleName] = impl;
  }

  /** Legacy register for backward compatibility with CanvasEditor */
  registerLegacy(api: API.IEditorAPI) {
    this._legacyImpl = api;
  }

  /** Gets the legacy API for commands that haven't been migrated */
  getLegacy(): API.IEditorAPI | null {
    return this._legacyImpl;
  }

  /** Latest editor state snapshot */
  getState(): EditorState { return this._state; }

  /** Called by CanvasEditor after every state mutation to broadcast to all listeners */
  notify(state: EditorState) {
    this._state = state;
    this.listeners.forEach(fn => fn(state));
  }

  /** Subscribe to state changes. Returns unsubscribe function. */
  subscribe(fn: StateListener): () => void {
    this.listeners.add(fn);
    fn(this._state); // immediate call with current state
    return () => this.listeners.delete(fn);
  }
}

export const EditorAPI = new EditorApiRegistry();
if (typeof window !== 'undefined') {
  (window as any).EditorAPI = EditorAPI;
}

// ─── Legacy exec mapper ───────────────────────────────────────────────────────
export function execHomeCommand(commandId: string, payload?: unknown): void {
  CommandDispatcher.dispatch(commandId, payload);
}
