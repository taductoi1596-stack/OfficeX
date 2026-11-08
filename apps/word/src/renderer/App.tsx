import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Ribbon } from '@officex/ui';
import {
  IconWord, IconSave, IconUndo, IconRedo,
} from '@officex/icons';
import { EngineProvider, useEngines } from './EngineContext';
import { TranslationMemoryEngine } from './ai/workflow/TranslationMemoryEngine';
import { AIProviderManager } from './ai/AIProviderManager';
import { ParagraphNode, RunNode } from '@officex/object-model-engine';
import { CanvasEditor } from './CanvasEditor';
import { useRibbonState, RibbonController } from './RibbonController';
import { CommandDispatcher } from './CommandDispatcher';
import { EditorAPI } from './editorApi';
import { ShortcutManager } from './ShortcutManager';
import { ClipboardEngine, ClipboardHistoryItem } from './ClipboardEngine';
import { FontGroup } from './FontGroup';
import { ParagraphGroup } from './ParagraphGroup';
import { ParagraphDialog } from './ParagraphDialog';
import { StylesGroup } from './StylesGroup';
import { StylePane } from './StylePane';
import { StyleInspector } from './StyleInspector';
import { StyleManagerDialog } from './StyleManagerDialog';
import { FindPane } from './FindPane';
import { GoToDialog } from './GoToDialog';
import { AIPanelHost } from './AIPanelHost';
import { AIPanelManager } from './AIPanelManager';
import { AIRibbonGroup } from './AIRibbonGroup';
import { RBtn, RGroup } from './SharedComponents';
import { HomeRibbon } from './HomeRibbon';
import { FileMenu } from './file/FileMenu';
import { FileEngine } from './file/FileEngine';
import { FileCommandRegistry } from './file/fileCommands';
import { FileRibbon } from './file/FileRibbon';
import { FileStorageEngine } from './file/FileStorageEngine';
import { FolderSaveDialog } from './file/FolderSaveDialog';
import { SmartArtDesignRibbon } from './ribbons/SmartArtDesignRibbon';
import { SmartArtFormatRibbon } from './ribbons/SmartArtFormatRibbon';
import { InsertPageCommandRegistry } from './insert/insertPageCommands';
import { InsertPageEngine } from './insert/InsertPageEngine';
import { InsertTableCommandRegistry } from './insert/insertTableCommands';
import { InsertTableEngine } from './insert/InsertTableEngine';
import { TableDesignRibbon } from './table/TableDesignRibbon';
import { InsertShapeCommandRegistry } from './insert/insertShapeCommands';
import { InsertShapeEngine } from './insert/InsertShapeEngine';
import { InsertChartCommandRegistry } from './insert/insertChartCommands';
import { InsertChartEngine } from './insert/InsertChartEngine';
import { InsertSmartArtCommandRegistry } from './insert/insertSmartArtCommands';
import { InsertSmartArtEngine } from './insert/InsertSmartArtEngine';
import { InsertTextCommandRegistry } from './insert/insertTextCommands';
import { InsertTextEngine } from './insert/InsertTextEngine';
import { InsertHeaderFooterCommandRegistry } from './insert/insertHeaderFooterCommands';
import { InsertHeaderFooterEngine } from './insert/InsertHeaderFooterEngine';
import { InsertReferenceCommandRegistry } from './insert/insertReferenceCommands';
import { InsertReferenceEngine } from './insert/InsertReferenceEngine';
import { InsertEquationCommandRegistry } from './insert/insertEquationCommands';
import { InsertEquationEngine } from './insert/InsertEquationEngine';
import { InsertSymbolCommandRegistry } from './insert/insertSymbolCommands';
import { InsertSymbolEngine } from './insert/InsertSymbolEngine';
import { InsertMediaCommandRegistry } from './insert/insertMediaCommands';
import { InsertMediaEngine } from './insert/InsertMediaEngine';
import { InsertObjectCommandRegistry } from './insert/insertObjectCommands';
import { InsertObjectEngine } from './insert/InsertObjectEngine';
import { InsertFormCommandRegistry } from './insert/insertFormCommands';
import { InsertFormEngine } from './insert/InsertFormEngine';
import { SmartArtGalleryModal } from './insert/SmartArtGalleryModal';
import { InsertAICommandRegistry } from './insert/insertAICommands';
import { InsertAIEngine } from './insert/InsertAIEngine';
import { InsertPluginCommandRegistry } from './insert/insertPluginCommands';
import { InsertPluginEngine } from './insert/InsertPluginEngine';
import { InsertIconCommandRegistry } from './insert/insertIconCommands';
import { InsertModel3DCommandRegistry } from './insert/insertModel3DCommands';
import { InsertCommentCommandRegistry } from './insert/insertCommentCommands';
import { InsertRibbon } from './insert/InsertRibbon';
import { TableLayoutRibbon } from './table/TableLayoutRibbon';
import { LayoutCommandRegistry } from './layout/layoutCommands';
import { LayoutEngine } from './layout/LayoutEngine';
import { LayoutRibbon } from './layout/LayoutRibbon';
import { ReferenceCommandRegistry } from './references/referenceCommands';
import { ReferenceEngine } from './references/ReferenceEngine';
import { ReferencesRibbon } from './references/ReferencesRibbon';
import { ReviewCommandRegistry } from './review/reviewCommands';
import { ReviewEngine } from './review/ReviewEngine';
import { ReviewRibbon } from './review/ReviewRibbon';
import { ViewCommandRegistry } from './view/viewCommands';
import { ViewEngine } from './view/ViewEngine';
import { ViewRibbon } from './view/ViewRibbon';
import { ContextCommandRegistry } from './context/contextCommands';
import { ContextEngine } from './context/ContextEngine';
import { ContextMenuProvider } from './context/ContextMenuProvider';
import { InternalCommandRegistry } from './internal/internalCommands';
import { InternalEngine } from './internal/InternalEngine';
import { AICommandRegistry } from './ai_commands/aiCommands';
import { AIEngine } from './ai_commands/AIEngine';
import { AIRibbon } from './ai_commands/AIRibbon';
import { InsertPictureCommandRegistry } from './insert/insertPictureCommands';
import { InsertPictureEngine } from './insert/InsertPictureEngine';
import { DrawRibbon } from './draw/DrawRibbon';
import { DrawPensCommandRegistry } from './draw/drawPensCommands';
import { DrawHighlighterCommandRegistry } from './draw/drawHighlighterCommands';
import { DrawEraserCommandRegistry } from './draw/drawEraserCommands';
import { DrawLassoCommandRegistry } from './draw/drawLassoCommands';
import { DrawInkToolsCommandRegistry } from './draw/drawInkToolsCommands';
import { DrawInkToShapeCommandRegistry } from './draw/drawInkToShapeCommands';
import { HeaderFooterRibbon } from './headerfooter/HeaderFooterRibbon';
import { DrawInkToTextCommandRegistry } from './draw/drawInkToTextCommands';
import { DrawInkToMathCommandRegistry } from './draw/drawInkToMathCommands';
import { DrawInkReplayCommandRegistry } from './draw/drawInkReplayCommands';
import { DrawRulerCommandRegistry } from './draw/drawRulerCommands';
import { DrawCanvasCommandRegistry } from './draw/drawCanvasCommands';
import { DrawAICommandRegistry } from './draw/drawAICommands';
import { DesignRibbon } from './design/DesignRibbon';
import { DesignThemesCommandRegistry } from './design/designThemesCommands';
import { DesignColorsCommandRegistry } from './design/designColorsCommands';
import { DesignFontsCommandRegistry } from './design/designFontsCommands';
import { DesignSpacingCommandRegistry } from './design/designSpacingCommands';
import { DesignEffectsCommandRegistry } from './design/designEffectsCommands';
import { DesignStyleSetCommandRegistry } from './design/designStyleSetCommands';
import { DesignPageBackgroundCommandRegistry } from './design/designPageBackgroundCommands';
import { DesignWatermarkCommandRegistry } from './design/designWatermarkCommands';
import { DesignPageColorCommandRegistry } from './design/designPageColorCommands';
import { DesignPageBordersCommandRegistry } from './design/designPageBordersCommands';
import { DesignFormatCommandRegistry } from './design/designFormatCommands';
import { DesignAICommandRegistry } from './design/designAICommands';
import { MailingsRibbon } from './mailings/MailingsRibbon';
import { DeveloperRibbon } from './developer/DeveloperRibbon';
import { HelpRibbon } from './help/HelpRibbon';
import { SearchBox } from './components/Ribbon/SearchBox';
import { EquationPanel } from './insert/EquationPanel';
import '@officex/theme/dist/index.css';

// ─── Clipboard History Hook ───────────────────────────────────────────────────
function useClipboardHistory() {
  const [history, setHistory] = useState<ClipboardHistoryItem[]>(() => ClipboardEngine.getHistory());
  useEffect(() => {
    return ClipboardEngine.subscribeHistory(() => {
      setHistory([...ClipboardEngine.getHistory()]);
    });
  }, []);
  return history;
}

const ipc = (window as any).ipc;
const closeWindow = () => {
  if (ipc && typeof ipc.invoke === 'function') {
    ipc.invoke('window-close');
  } else {
    try {
      window.close();
    } catch {}
    FileEngine.close();
  }
};
const minimizeWindow = () => ipc?.invoke('window-minimize');
const maximizeWindow = () => ipc?.invoke('window-maximize');

const ribbonTabs = [
  { id: 'file', label: 'File' },
  { id: 'home', label: 'Home' },
  { id: 'insert', label: 'Insert' },
  { id: 'layout', label: 'Layout' },
  { id: 'ai', label: 'AI' },
];

// ─── Format via execCommand (preserves selection) ─────────────────────────────
function fmt(command: string, value?: string) {
  document.execCommand(command, false, value);
}

// ─── Word Editor ──────────────────────────────────────────────────────────────
function WordEditor() {
  const {
    historyManager, documentManager, documentRoot,
    activeDocumentId, cacheManager,
  } = useEngines();

  const [activeTab, setActiveTab] = useState('home');
  const [isDirty, setIsDirty]     = useState(false);
  const [showParaDialog, setShowParaDialog] = useState(false);
  const [showStylePane, setShowStylePane] = useState(false);
  const [showStyleInspector, setShowStyleInspector] = useState(false);
  const [showStyleManager, setShowStyleManager] = useState(false);
  const [showFindPane, setShowFindPane] = useState(false);
  const [showGoToDialog, setShowGoToDialog] = useState(false);
  const [showSmartArtGallery, setShowSmartArtGallery] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [fileMenuSection, setFileMenuSection] = useState<any>('new');
  const [isInHeaderFooter, setIsInHeaderFooter] = useState(false);
  const [showEquationPanel, setShowEquationPanel] = useState(false);
  // Dialog xác nhận lưu khi đóng
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const pendingCloseRef = useRef<(() => void) | null>(null);
  const discardChangesOnCloseRef = useRef(false);

  // ── Ribbon reactive state from RibbonController ────────────────────
  const rs = useRibbonState();
  const clipboardHistory = useClipboardHistory();

  // ── Install global keyboard shortcuts & AI Panel Manager ──────────
  useEffect(() => {
    // Register File Commands
    CommandDispatcher.registerRegistry(FileCommandRegistry.all());
    // Initialize File Engine
    FileEngine.initialize();

    // Register Insert Page Commands
    CommandDispatcher.registerRegistry(InsertPageCommandRegistry.all());
    InsertPageEngine.initialize();

    // Register Insert Table Commands
    CommandDispatcher.registerRegistry(InsertTableCommandRegistry.all());
    InsertTableEngine.initialize();

    // Register Insert Shape Commands
    CommandDispatcher.registerRegistry(InsertShapeCommandRegistry.all());
    InsertShapeEngine.initialize();

    // Register Insert Chart Commands
    CommandDispatcher.registerRegistry(InsertChartCommandRegistry.all());
    InsertChartEngine.initialize();

    // Register Insert SmartArt Commands
    CommandDispatcher.registerRegistry(InsertSmartArtCommandRegistry.all());
    InsertSmartArtEngine.initialize();

    // Register Insert Text Commands
    CommandDispatcher.registerRegistry(InsertTextCommandRegistry.all());
    InsertTextEngine.initialize();

    // Register Insert Header Footer Commands
    CommandDispatcher.registerRegistry(InsertHeaderFooterCommandRegistry.all());
    InsertHeaderFooterEngine.initialize();

    // Register Insert Reference Commands
    CommandDispatcher.registerRegistry(InsertReferenceCommandRegistry.all());
    InsertReferenceEngine.initialize();

    // Register Insert Equation Commands
    CommandDispatcher.registerRegistry(InsertEquationCommandRegistry.all());
    InsertEquationEngine.initialize();

    // Register Insert Symbol Commands
    CommandDispatcher.registerRegistry(InsertSymbolCommandRegistry.all());
    InsertSymbolEngine.initialize();

    // Register Insert Media Commands
    CommandDispatcher.registerRegistry(InsertMediaCommandRegistry.all());
    InsertMediaEngine.initialize();

    // Register Insert Object Commands
    CommandDispatcher.registerRegistry(InsertObjectCommandRegistry.all());
    InsertObjectEngine.initialize();

    // Register Insert Form Commands
    CommandDispatcher.registerRegistry(InsertFormCommandRegistry.all());
    InsertFormEngine.initialize();

    // Register Insert AI Commands
    CommandDispatcher.registerRegistry(InsertAICommandRegistry.all());
    InsertAIEngine.initialize();

    // Register Insert Plugin Commands
    CommandDispatcher.registerRegistry(InsertPluginCommandRegistry.all());
    InsertPluginEngine.initialize();

    // Register missing Insert Commands
    CommandDispatcher.registerRegistry(InsertIconCommandRegistry.all());
    CommandDispatcher.registerRegistry(InsertModel3DCommandRegistry.all());
    CommandDispatcher.registerRegistry(InsertCommentCommandRegistry.all());

    // Register Draw Commands
    CommandDispatcher.registerRegistry(DrawPensCommandRegistry.all());
    CommandDispatcher.registerRegistry(DrawHighlighterCommandRegistry.all());
    CommandDispatcher.registerRegistry(DrawEraserCommandRegistry.all());
    CommandDispatcher.registerRegistry(DrawLassoCommandRegistry.all());
    CommandDispatcher.registerRegistry(DrawInkToolsCommandRegistry.all());
    CommandDispatcher.registerRegistry(DrawInkToShapeCommandRegistry.all());
    CommandDispatcher.registerRegistry(DrawInkToTextCommandRegistry.all());
    CommandDispatcher.registerRegistry(DrawInkToMathCommandRegistry.all());
    CommandDispatcher.registerRegistry(DrawInkReplayCommandRegistry.all());
    CommandDispatcher.registerRegistry(DrawRulerCommandRegistry.all());
    CommandDispatcher.registerRegistry(DrawCanvasCommandRegistry.all());
    CommandDispatcher.registerRegistry(DrawAICommandRegistry.all());

    // Register Design Commands
    CommandDispatcher.registerRegistry(DesignThemesCommandRegistry.all());
    CommandDispatcher.registerRegistry(DesignColorsCommandRegistry.all());
    CommandDispatcher.registerRegistry(DesignFontsCommandRegistry.all());
    CommandDispatcher.registerRegistry(DesignSpacingCommandRegistry.all());
    CommandDispatcher.registerRegistry(DesignEffectsCommandRegistry.all());
    CommandDispatcher.registerRegistry(DesignStyleSetCommandRegistry.all());
    CommandDispatcher.registerRegistry(DesignPageBackgroundCommandRegistry.all());
    CommandDispatcher.registerRegistry(DesignWatermarkCommandRegistry.all());
    CommandDispatcher.registerRegistry(DesignPageColorCommandRegistry.all());
    CommandDispatcher.registerRegistry(DesignPageBordersCommandRegistry.all());
    CommandDispatcher.registerRegistry(DesignFormatCommandRegistry.all());
    CommandDispatcher.registerRegistry(DesignAICommandRegistry.all());

    // Register Layout Commands
    CommandDispatcher.registerRegistry(LayoutCommandRegistry.all());
    LayoutEngine.initialize();

    // Register Reference Commands
    CommandDispatcher.registerRegistry(ReferenceCommandRegistry.all());
    ReferenceEngine.initialize();

    // Register Review Commands
    CommandDispatcher.registerRegistry(ReviewCommandRegistry.all());
    ReviewEngine.initialize();

    // Register View Commands
    CommandDispatcher.registerRegistry(ViewCommandRegistry.all());
    ViewEngine.initialize();

    // Register Context Menu Commands
    CommandDispatcher.registerRegistry(ContextCommandRegistry.all());
    ContextEngine.initialize();

    // Register Internal Commands
    CommandDispatcher.registerRegistry(InternalCommandRegistry.all());
    InternalEngine.initialize();

    // Register AI Commands
    CommandDispatcher.registerRegistry(AICommandRegistry.all());
    AIEngine.initialize();

    // Register Insert Picture Commands
    CommandDispatcher.registerRegistry(InsertPictureCommandRegistry.all());
    InsertPictureEngine.initialize();

    RibbonController.refresh();

    FileEngine.on('file:saved', () => setIsDirty(false));
    FileEngine.on('file:new', () => setIsDirty(false));
    FileEngine.on('file:modified', () => setIsDirty(true));
    FileEngine.on('file:opened', () => setIsDirty(false));

    AIProviderManager.initialize().then(() => {
      AIPanelManager.initialize();
    });
    
    const onStylePane = () => setShowStylePane(prev => !prev);
    const onFindPane = () => setShowFindPane(prev => !prev);
    const onParaDialog = () => setShowParaDialog(true);
    const onStyleInspector = () => setShowStyleInspector(prev => !prev);
    const onStyleManager = () => setShowStyleManager(true);
    const onGoTo = () => setShowGoToDialog(true);
    const onOpenSmartArt = () => setShowSmartArtGallery(true);
    const onOpenPrintMenu = () => {
      setFileMenuSection('print');
      setShowFileMenu(true);
    };

    document.addEventListener('officex:open-style-pane', onStylePane);
    document.addEventListener('officex:open-find-pane', onFindPane);
    document.addEventListener('officex:open-paragraph-dialog', onParaDialog);
    document.addEventListener('officex:open-style-inspector', onStyleInspector);
    document.addEventListener('officex:open-style-manager', onStyleManager);
    document.addEventListener('officex:open-goto', onGoTo);
    document.addEventListener('officex:open-smartart-gallery', onOpenSmartArt);
    document.addEventListener('officex:open-print-menu', onOpenPrintMenu);

    const uninstallShortcuts = ShortcutManager.install();

    // Auto-open file if passed via URL or double-click
    const urlParams = new URLSearchParams(window.location.search);
    const initialFile = urlParams.get('file');
    if (initialFile) {
      setTimeout(() => {
        FileEngine.openFromPath(initialFile);
      }, 350);
    }

    return () => {
      uninstallShortcuts();
      FileEngine.dispose();
      AIPanelManager.dispose();
      document.removeEventListener('officex:open-style-pane', onStylePane);
      document.removeEventListener('officex:open-find-pane', onFindPane);
      document.removeEventListener('officex:open-paragraph-dialog', onParaDialog);
      document.removeEventListener('officex:open-style-inspector', onStyleInspector);
      document.removeEventListener('officex:open-style-manager', onStyleManager);
      document.removeEventListener('officex:open-goto', onGoTo);
      document.removeEventListener('officex:open-smartart-gallery', onOpenSmartArt);
      document.removeEventListener('officex:open-print-menu', onOpenPrintMenu);
    };
  }, []);

  // Document dirty tracking
  useEffect(() => {
    if (activeDocumentId) {
      documentManager.events(activeDocumentId).on('document:dirty-changed', (e) => {
        setIsDirty(e.payload as boolean);
      });
    }
  }, [activeDocumentId, documentManager]);

  useEffect(() => {
    const unsubPara = CommandDispatcher.subscribe('WORD.PARAGRAPH.DIALOG', () => {
      setShowParaDialog(true);
    });
    const unsubStylePane = CommandDispatcher.subscribe('WORD.STYLEPANE.TOGGLE', () => {
      setShowStylePane(prev => !prev);
    });
    const unsubInspector = CommandDispatcher.subscribe('WORD.STYLEINSPECTOR.TOGGLE', () => {
      setShowStyleInspector(prev => !prev);
    });
    const unsubManager = CommandDispatcher.subscribe('WORD.STYLEMANAGER.OPEN', () => {
      setShowStyleManager(true);
    });
    const unsubFind = CommandDispatcher.subscribe('WORD.FIND.OPEN', () => {
      setShowFindPane(prev => !prev);
    });
    const unsubGoTo = CommandDispatcher.subscribe('WORD.GOTO.OPEN', () => {
      setShowGoToDialog(true);
    });
    const unsubHeaderDialog = CommandDispatcher.subscribe('WORD.INSERT.HEADER.DIALOG', () => {
      setActiveTab('header_footer');
      setIsInHeaderFooter(true);
    });
    const unsubHeaderClose = CommandDispatcher.subscribe('WORD.HEADER_FOOTER.CLOSE', () => {
      setActiveTab('home');
      setIsInHeaderFooter(false);
    });
    const unsubEquation = CommandDispatcher.subscribe('WORD.INSERT.EQUATION', () => {
      setShowEquationPanel(prev => !prev);
    });
    return () => {
      unsubPara();
      unsubStylePane();
      unsubInspector();
      unsubManager();
      unsubFind();
      unsubGoTo();
      unsubHeaderDialog();
      unsubHeaderClose();
      unsubEquation();
    };
  }, []);

  useEffect(() => {
    if (rs.editorState?.selectedSmartArtId) {
      setActiveTab('smartart_design');
    } else if (activeTab === 'smartart_design' || activeTab === 'smartart_format') {
      setActiveTab('home');
    }
  }, [rs.editorState?.selectedSmartArtId]);

  // When inside header/footer: switch to table_design when entering a table,
  // and back to header_footer when leaving
  useEffect(() => {
    if (isInHeaderFooter) {
      if (rs.isInTable && (activeTab === 'header_footer')) {
        setActiveTab('table_design');
      } else if (!rs.isInTable && (activeTab === 'table_design' || activeTab === 'table_layout')) {
        setActiveTab('header_footer');
      }
    }
  }, [rs.isInTable, isInHeaderFooter]);

  const handleSave = async () => {
    exec('WORD.FILE.SAVE');
  };

  // Xử lý đóng cửa sổ — hỏi lưu nếu có thay đổi chưa lưu (chỉ khi mở file hoặc đã gõ nội dung)
  const handleClose = useCallback(async () => {
    if (!FileEngine.needsSavePrompt()) {
      closeWindow();
      return;
    }
    // Hiện dialog hỏi lưu
    setShowUnsavedDialog(true);
    pendingCloseRef.current = closeWindow;
  }, []);

  // Lắng nghe yêu cầu đóng cửa sổ từ Electron (khi bấm X trên thanh tiêu đề Windows hoặc Alt+F4)
  useEffect(() => {
    const electronAPI = (window as any).electronAPI;
    const ipc = (window as any).ipc;
    if (electronAPI?.onRequestClose) {
      return electronAPI.onRequestClose(() => {
        handleClose();
      });
    } else if (ipc?.on) {
      return ipc.on('window:request-close', () => {
        handleClose();
      });
    }
  }, [handleClose]);

  // beforeunload: bắt reload / đóng tab trình duyệt
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!discardChangesOnCloseRef.current && FileEngine.needsSavePrompt()) {
        e.preventDefault();
        e.returnValue = 'Tài liệu chưa được lưu. Bạn có muốn lưu không?';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const cacheStats = cacheManager.getStats();

  // All ribbon button clicks go through CommandDispatcher
  const exec = (cmdId: string, payload?: unknown) => {
    CommandDispatcher.dispatch(cmdId, payload);
  };

  const [docName, setDocName] = useState<string>(() => FileEngine.getCurrentFile()?.name || 'Document 1');
  const [docPath, setDocPath] = useState<string | null>(() => FileEngine.getCurrentFile()?.path || null);

  // Dialog chọn thư mục lưu
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [folderDialogConfig, setFolderDialogConfig] = useState<{
    title?: string;
    subtitle?: string;
    initialFileName?: string;
    initialFolder?: string;
    resolve?: (path: string | null) => void;
  }>({});

  const promptFolderSave = useCallback((config?: {
    title?: string;
    subtitle?: string;
    initialFileName?: string;
    initialFolder?: string;
  }): Promise<string | null> => {
    return new Promise((resolve) => {
      const cur = FileEngine.getCurrentFile();
      const currentPath = cur?.path;
      let folderPart = 'C:\\Users\\taduc\\Desktop';
      if (currentPath && (currentPath.includes('\\') || currentPath.includes('/'))) {
        const sep = currentPath.includes('/') ? '/' : '\\';
        folderPart = currentPath.substring(0, currentPath.lastIndexOf(sep));
      }
      const namePart = cur?.name || 'Document 1.docx';

      setFolderDialogConfig({
        title: config?.title || 'Chọn Thư Mục Lưu Tài Liệu',
        subtitle: config?.subtitle || 'Vui lòng chọn thư mục và tên file để lưu trữ tài liệu:',
        initialFileName: config?.initialFileName || namePart,
        initialFolder: config?.initialFolder || folderPart,
        resolve,
      });
      setShowFolderDialog(true);
    });
  }, []);

  // Hook save dialog vào FileStorageEngine để khi gọi FileEngine.save() / saveAs() sẽ hiện hộp thoại thư mục
  useEffect(() => {
    FileStorageEngine.setSaveDialogHandler(async (defaultName) => {
      return promptFolderSave({ initialFileName: defaultName });
    });
    return () => {
      FileStorageEngine.setSaveDialogHandler(null);
    };
  }, [promptFolderSave]);

  // Hook commands đóng tài liệu
  useEffect(() => {
    const u1 = CommandDispatcher.subscribe('WORD.FILE.CLOSE', () => handleClose());
    const u2 = CommandDispatcher.subscribe('WORD.FILE.EXIT', () => handleClose());
    return () => { u1(); u2(); };
  }, [handleClose]);

  useEffect(() => {
    const updateInfo = (file: any) => {
      setDocName(file?.name || 'Document 1');
      setDocPath(file?.path || null);
    };
    const u1 = FileEngine.on('file:opened', updateInfo);
    const u2 = FileEngine.on('file:saved', updateInfo);
    const u3 = FileEngine.on('file:new', () => { setDocName('Document 1'); setDocPath(null); });
    const u4 = FileEngine.on('file:renamed', updateInfo);
    return () => { u1(); u2(); u3(); u4(); };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden font-sans">

      {/* ── Title Bar ─────────────────────────────────────────────── */}
      <div
        className="h-8 bg-[#2b579a] text-white flex items-center px-3 shrink-0 select-none no-print"
        style={{ WebkitAppRegion: 'drag' } as any}
      >
        <div className="flex items-center gap-2">
          <IconWord size={15} />
          <button
            onClick={() => promptFolderSave()}
            className="flex items-center gap-2 hover:bg-white/20 px-2 py-0.5 rounded transition-colors text-left"
            title="Nhấn để đổi tên hoặc chọn thư mục lưu khác"
          >
            <span className="text-xs font-semibold">{isDirty ? '● ' : ''}{docName}</span>
            <span className="text-[10px] text-white/85 bg-white/20 px-1.5 py-0.5 rounded font-mono flex items-center gap-1">
              📁 {docPath ? (docPath.length > 32 ? '...' + docPath.slice(-28) : docPath) : 'Chưa chọn thư mục'}
            </span>
          </button>
          <span className="text-xs text-white/50">- OfficeX Word</span>
        </div>
        {/* Quick Access Toolbar */}
        <div className="flex items-center gap-1 ml-3" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <span className="opacity-50">|</span>
          <span>Trang {rs.currentPage}/{rs.pageCount}</span>
          <span>Tiếng Việt</span>
          {isDirty && <span className="text-yellow-300 font-medium">● Unsaved</span>}
          <span className="text-green-300">✓ {rs.canUndo ? 'Đã sửa' : 'Đã lưu'}</span>
        </div>
        {/* Search Box */}
        <SearchBox />

        {/* Window controls */}
        <div className="ml-auto flex" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <button className="w-10 h-8 flex items-center justify-center hover:bg-white/20 text-sm" onClick={minimizeWindow}>─</button>
          <button className="w-10 h-8 flex items-center justify-center hover:bg-white/20 text-sm" onClick={maximizeWindow}>□</button>
          <button className="w-10 h-8 flex items-center justify-center hover:bg-red-500 text-sm" onClick={handleClose}>✕</button>
        </div>
      </div>

      {/* ── Unsaved Changes Dialog ─────────────────────────────────── */}
      {showUnsavedDialog && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff', borderRadius: 10, padding: '28px 32px',
            minWidth: 380, boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
            fontFamily: 'Calibri, Segoe UI, Arial, sans-serif',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <span style={{ fontSize: 28 }}>💾</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>Lưu thay đổi?</div>
                <div style={{ fontSize: 13, color: '#555', marginTop: 4 }}>
                  Tài liệu <b style={{ color: '#2b579a' }}>{docName}</b> có thay đổi chưa được lưu.
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                onClick={() => { setShowUnsavedDialog(false); pendingCloseRef.current = null; }}
                style={{
                  padding: '8px 18px', borderRadius: 6, border: '1px solid #ccc',
                  background: '#f5f5f5', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                }}
              >Hủy</button>
              <button
                onClick={async () => {
                  discardChangesOnCloseRef.current = true;
                  setShowUnsavedDialog(false);
                  const close = pendingCloseRef.current;
                  pendingCloseRef.current = null;
                  close?.();
                }}
                style={{
                  padding: '8px 18px', borderRadius: 6, border: '1px solid #e53e3e',
                  background: '#fff5f5', color: '#e53e3e', cursor: 'pointer', fontSize: 13, fontWeight: 500,
                }}
              >Không lưu</button>
              <button
                onClick={async () => {
                  setShowUnsavedDialog(false);
                  const saved = await FileEngine.save();
                  if (saved) {
                    pendingCloseRef.current?.();
                    pendingCloseRef.current = null;
                  }
                }}
                style={{
                  padding: '8px 20px', borderRadius: 6, border: 'none',
                  background: '#2b579a', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                }}
              >Lưu</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Folder Save Dialog ─────────────────────────────────────── */}
      <FolderSaveDialog
        isOpen={showFolderDialog}
        title={folderDialogConfig.title}
        subtitle={folderDialogConfig.subtitle}
        initialFileName={folderDialogConfig.initialFileName}
        initialFolder={folderDialogConfig.initialFolder}
        onSave={(fullPath, fileName) => {
          setShowFolderDialog(false);
          folderDialogConfig.resolve?.(fullPath);
          setDocPath(fullPath);
          setDocName(fileName);
        }}
        onDismiss={() => {
          setShowFolderDialog(false);
          folderDialogConfig.resolve?.(null);
        }}
        onCancel={() => {
          setShowFolderDialog(false);
          folderDialogConfig.resolve?.(null);
        }}
      />

      {/* ── Modals ───────────────────────────────────────────────────────────────── */}
      {showParaDialog && <ParagraphDialog isOpen={showParaDialog} onClose={() => setShowParaDialog(false)} />}
      {showStyleManager && <StyleManagerDialog onClose={() => setShowStyleManager(false)} />}
      {showFileMenu && <FileMenu initialSection={fileMenuSection} onClose={() => { setShowFileMenu(false); setActiveTab('home'); setFileMenuSection('new'); }} />}
      <SmartArtGalleryModal 
        isOpen={showSmartArtGallery} 
        onClose={() => setShowSmartArtGallery(false)} 
        onInsert={(type, subType) => {
          EditorAPI.getLegacy()?.insertSmartArt?.(type, subType);
        }}
      />

      {/* ── Ribbon ─────────────────────────────────────────────────── */}
      <div className="bg-[#f3f3f3] dark:bg-card border-b border-border shrink-0 no-print">
        <Ribbon tabs={[
            ...ribbonTabs, 
            ...(rs.isInTable ? [
              { id: 'table_design', label: 'Thiết kế bảng', activeColor: '#2b579a' },
              { id: 'table_layout', label: 'Bố trí bảng', activeColor: '#2b579a' }
            ] : []),
            ...(rs.editorState?.selectedSmartArtId ? [
              { id: 'smartart_design', label: 'SmartArt Design', activeColor: '#1e3f70' },
              { id: 'smartart_format', label: 'Format', activeColor: '#1e3f70' }
            ] : []),
            ...(isInHeaderFooter ? [
              { id: 'header_footer', label: 'Đầu trang & Chân trang', activeColor: '#2b579a' }
            ] : [])
        ] as any} activeTab={activeTab} onChange={(tab) => {
          if (tab === 'file') { setShowFileMenu(true); return; }
          setActiveTab(tab);
        }} />
        <div className="px-2 pt-0.5 pb-0 flex flex-wrap items-start">

          {activeTab === 'file_tools' && (
            <FileRibbon />
          )}

          {activeTab === 'home' && <HomeRibbon />}

          {activeTab === 'ai' && <AIRibbon />}

          {activeTab === 'insert' && (
            <InsertRibbon />
          )}

          {activeTab === 'smartart_design' && (
            <SmartArtDesignRibbon />
          )}

          {activeTab === 'table_design' && <TableDesignRibbon />}

          {activeTab === 'table_layout' && <TableLayoutRibbon />}

          {activeTab === 'smartart_format' && (
            <SmartArtFormatRibbon />
          )}

          {activeTab === 'layout' && (
            <LayoutRibbon />
          )}

          {activeTab === 'references' && (
            <ReferencesRibbon />
          )}

          {activeTab === 'review' && (
            <ReviewRibbon />
          )}

          {activeTab === 'view' && (
            <ViewRibbon />
          )}

          {activeTab === 'draw' && (
            <DrawRibbon />
          )}

          {activeTab === 'design' && (
            <DesignRibbon />
          )}

          {activeTab === 'mailings' && (
            <MailingsRibbon />
          )}

          {activeTab === 'developer' && (
            <DeveloperRibbon />
          )}


          
          {(activeTab === 'header_footer' || (isInHeaderFooter && activeTab !== 'table_design' && activeTab !== 'table_layout')) && (
            <HeaderFooterRibbon />
          )}

          {activeTab === 'help' && <HelpRibbon />}

          {activeTab !== 'home' && activeTab !== 'ai' && activeTab !== 'file_tools' && activeTab !== 'insert' && activeTab !== 'layout' && activeTab !== 'references' && activeTab !== 'review' && activeTab !== 'view' && activeTab !== 'draw' && activeTab !== 'design' && activeTab !== 'mailings' && activeTab !== 'developer' && activeTab !== 'table_layout' && activeTab !== 'table_design' && activeTab !== 'help' && activeTab !== 'header_footer' && (
            <div className="flex items-center px-4 h-[78px] text-sm text-slate-400 italic">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tab — coming soon
            </div>
          )}
        </div>
      </div>



      <div className="flex-1 bg-gray-100 dark:bg-slate-900 relative flex overflow-hidden">
        {/* Left Side: Clipboard Panel */}
        {rs.editorState.clipboardPanelOpen && (
          <div className="w-64 bg-white dark:bg-slate-800 border-r border-border flex flex-col shadow-sm z-10 shrink-0">
            <div className="h-8 border-b border-border flex items-center justify-between px-3 shrink-0">
              <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 uppercase">Clipboard</span>
              <button 
                className="hover:text-red-500 text-slate-400"
                onClick={() => exec('WORD.HOME.CLIPBOARD.PANEL')}
              >×</button>
            </div>
            <div className="p-2 flex flex-col gap-1 border-b border-border shrink-0">
              <button 
                className="w-full h-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 rounded text-[11px] font-medium"
                onClick={() => ClipboardEngine.clearHistory()}
              >
                Clear All
              </button>
            </div>
            <div className="flex-1 overflow-auto p-2 flex flex-col gap-2">
              {clipboardHistory.length === 0 && (
                <div className="text-[11px] text-slate-400 text-center mt-4">Clipboard is empty.</div>
              )}
              {clipboardHistory.map(item => (
                <div 
                  key={item.id} 
                  className="p-2 border border-border rounded bg-white hover:border-blue-400 cursor-pointer shadow-sm group relative"
                  onClick={async () => {
                    await navigator.clipboard.write([
                      new ClipboardItem({
                        'text/plain': new Blob([item.textPreview], { type: 'text/plain' }),
                        'text/html': new Blob([`<div data-officex="${encodeURIComponent(JSON.stringify(item.paras))}">${item.textPreview}</div>`], { type: 'text/html' })
                      })
                    ]);
                    exec('WORD.HOME.PASTE');
                  }}
                  title="Click to paste"
                >
                  {/* Clipboard item content */}
                  <div className="text-[10px] text-slate-400 flex justify-between mb-1">
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-[11px] line-clamp-3 text-slate-700">
                    {item.textPreview}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Editor Canvas */}
        {/* ─── Document Area & Sidebars ────────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden relative bg-[#E6E6E6]">
          {showFindPane && (
            <FindPane onClose={() => setShowFindPane(false)} />
          )}
          <div className="flex-1 relative flex flex-col overflow-hidden min-h-0">
            <ContextMenuProvider>
              <CanvasEditor />
            </ContextMenuProvider>
          </div>
          {showEquationPanel && <EquationPanel onClose={() => setShowEquationPanel(false)} />}
          <AIPanelHost />
        </div>
      </div>

      {/* ── Status Bar ─────────────────────────────────────────────── */}
      <div className="h-5 bg-[#2b579a] text-white flex items-center px-4 text-[10px] shrink-0">
        <span className="opacity-80">Trang <strong style={{ fontWeight: 800, fontSize: 11, opacity: 1, color: '#fff' }}>{rs.currentPage}</strong> / <strong style={{ fontWeight: 800, fontSize: 11, opacity: 1, color: '#fff' }}>{rs.pageCount}</strong> &nbsp;&nbsp;|&nbsp;&nbsp; {rs.wordCount} từ</span>
        
        {/* MOCK CONTEXT TOGGLE */}
        <div className="ml-4 flex items-center gap-1 opacity-80">
          <label>Mock Context:</label>
          <select 
            className="bg-[#1e3f70] text-white outline-none border-none text-[10px] rounded"
            onChange={(e) => {
              const val = e.target.value as any;
              ContextEngine.Open(val);
            }}
          >
            <option value="Text">Text</option>
            <option value="Image">Image</option>
            <option value="Table">Table</option>
            <option value="Paragraph">Paragraph</option>
          </select>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={() => exec('WORD.VIEW.ZOOM.OUT')} className="hover:bg-white/20 px-1 rounded">-</button>
          <input 
            type="range" 
            min="25" max="400" step="5" 
            value={rs.editorState?.zoom ?? 100} 
            onChange={(e) => {
              const val = parseInt(e.target.value);
              EditorAPI.getLegacy()?.setZoom(val);
            }}
            className="w-24 h-1 bg-blue-300 rounded-lg appearance-none cursor-pointer"
          />
          <button onClick={() => exec('WORD.VIEW.ZOOM.IN')} className="hover:bg-white/20 px-1 rounded">+</button>
          <span className="w-8 text-right">{Math.round(rs.editorState?.zoom ?? 100)}%</span>
        </div>
      </div>
      
      <ParagraphDialog isOpen={showParaDialog} onClose={() => setShowParaDialog(false)} />
      {showStyleManager && <StyleManagerDialog onClose={() => setShowStyleManager(false)} />}
      {showGoToDialog && <GoToDialog onClose={() => setShowGoToDialog(false)} />}
    </div>
  );
}

const App = () => (
  <EngineProvider>
    <WordEditor />
  </EngineProvider>
);

export default App;
