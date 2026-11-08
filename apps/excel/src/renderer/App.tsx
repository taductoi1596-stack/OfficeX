import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Ribbon, Button, Dropdown } from '@officex/ui';
import { IconExcel, IconSave, IconBold, IconItalic, IconUnderline, IconAlignLeft, IconAlignCenter, IconAlignRight } from '@officex/icons';
import { Workbook, FormulaParser, DependencyGraph, CalculationEngine, getColName, getCellRef } from '@officex/spreadsheet-core';
import { ExcelEngineProvider, useExcelEngines } from './ExcelEngineContext';
import { CFDialog } from './CFDialogs';
import { CFRule, ConditionalFormattingEngine, CFContext } from '@officex/spreadsheet-core/src/tooling/ConditionalFormattingEngine';
import { FileMenu } from './file/FileMenu';
import { SharedDataStore } from '@officex/desktop-runtime';
import { FloatingShapesLayer } from './shapes/FloatingShapesLayer';
import { FloatingChartLayer } from './charts/FloatingChartLayer';
import { AIRibbon, AIPanel } from './ai/AIPanel';
import { AITranslatePane } from './ai/AITranslatePane';
import { TranslateEngine } from './ai/TranslateEngine';
import { FileEngine } from './file/FileEngine';
import { FileCommandRegistry } from './file/fileCommands';
import { CommandDispatcher } from './CommandDispatcher';
import { CsvParser } from './file/CsvParser';
import { XlsxParser } from './file/XlsxParser';
import { XlsParser } from './file/XlsParser';
import { HomeRibbon } from './ribbons/HomeRibbon';
import { InsertRibbon } from './ribbons/InsertRibbon';
import { FormatCellsSidebar } from './FormatCellsSidebar';
import { KeyboardManager } from './KeyboardManager';
import { CellContextMenu } from './CellContextMenu';
import { InsertFunctionDialog } from './InsertFunctionDialog';
import { PivotTableDialog } from './PivotTableDialog';
import { AutoFilterMenu } from './AutoFilterMenu';
import { FormulaTooltip } from './FormulaTooltip';
import { ValuePreviewTooltip } from './ValuePreviewTooltip';
import { ArrowUp, ArrowDown, ArrowRight, Circle, X, ChevronDown } from 'lucide-react';
import '@officex/theme/dist/index.css';

const ipc = (window as any).ipc;

const closeWindow = () => ipc?.invoke('window-close');
const minimizeWindow = () => ipc?.invoke('window-minimize');
const maximizeWindow = () => ipc?.invoke('window-maximize');

let sheetClipboard: any = null;

const ExcelApp = () => {
  const { historyManager, dispatcher, cacheManager, documentManager, activeDocumentId } = useExcelEngines();
  const [activeTable, setActiveTable] = useState<any | null>(null);
  const [insertTableState, setInsertTableState] = useState<{ show: boolean, style: any, range?: any }>({ show: false, style: null });
  const [formatAsTableState, setFormatAsTableState] = useState<{ show: boolean, style: any }>({ show: false, style: null });
  const [activeTab, setActiveTab] = useState('home');
  const [activeCells, setActiveCells] = useState<Record<string, { row: number, col: number }>>({});
  const [formulaBarText, setFormulaBarText] = useState('');
  const [zoom, setZoom] = useState(1);
  const [version, setVersion] = useState(0);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showFormatSidebar, setShowFormatSidebar] = useState(false);
  const [cfDialogState, setCfDialogState] = useState<'highlight' | 'topBottom' | 'newRule' | 'manageRules' | null>(null);
  const [fileMenuSection, setFileMenuSection] = useState<any>('new');
  const [historyState, setHistoryState] = useState({ stack: [] as string[], index: -1 });
  const [fontState, setFontState] = useState({
    fontFamily: 'Calibri',
    fontSize: 11,
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    fontColor: '#000000',
    bgColor: '#FFFF00',
  });
  const [contextMenuPos, setContextMenuPos] = useState<{ x: number, y: number } | null>(null);
  const [penColor, setPenColor] = useState('#000000');
  const [penStyle, setPenStyle] = useState('medium');
  const [formatPainter, setFormatPainter] = useState<any>(null);
  const [drawMode, setDrawMode] = useState<'draw' | 'drawGrid' | 'erase' | null>(null);
  const [openFilterCol, setOpenFilterCol] = useState<{ row: number, col: number, tableId: string, x: number, y: number } | null>(null);

  // Selection
  const [selectionRange, setSelectionRange] = useState<{ start: { row: number, col: number }, end: { row: number, col: number } } | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [clipboardState, setClipboardState] = useState<{ type: 'copy' | 'cut', range: { start: {row: number, col: number}, end: {row: number, col: number} } } | null>(null);

  const drawModeRef = useRef(drawMode);
  drawModeRef.current = drawMode;
  const selectionRangeRef = useRef(selectionRange);
  selectionRangeRef.current = selectionRange;
  const clipboardStateRef = useRef(clipboardState);
  clipboardStateRef.current = clipboardState;

  // Infinite Grid
  const [rowCount, setRowCount] = useState(100);
  const [colCount, setColCount] = useState(26);

  const rowNumPanelRef = React.useRef<HTMLDivElement>(null);
  const colHeaderRef = React.useRef<HTMLDivElement>(null);
  const gridPanelRef = React.useRef<HTMLDivElement>(null);

  const handleGridScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    // Sync row number panel vertical scroll
    if (rowNumPanelRef.current) {
      rowNumPanelRef.current.scrollTop = target.scrollTop;
    }
    // Sync column header panel horizontal scroll
    if (colHeaderRef.current) {
      colHeaderRef.current.scrollLeft = target.scrollLeft;
    }
    if (target.scrollHeight - target.scrollTop - target.clientHeight < 200) {
      setRowCount(r => Math.min(r + 50, 1048576));
    }
    if (target.scrollWidth - target.scrollLeft - target.clientWidth < 200) {
      setColCount(c => Math.min(c + 10, 16384));
    }
  };

  useEffect(() => {
    const handleMouseUp = () => {
      setIsSelecting(false);
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);


  // Resizing
  const [colWidths, setColWidths] = useState<Record<number, number>>({});
  const [rowHeights, setRowHeights] = useState<Record<number, number>>({});
  const [resizingCol, setResizingCol] = useState<{ index: number, startX: number, startWidth: number } | null>(null);
  const [resizingRow, setResizingRow] = useState<{ index: number, startY: number, startHeight: number } | null>(null);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (resizingCol) {
        const delta = e.clientX - resizingCol.startX;
        const newWidth = Math.max(30, resizingCol.startWidth + delta);
        setColWidths(prev => ({ ...prev, [resizingCol.index]: newWidth }));
      }
      if (resizingRow) {
        const delta = e.clientY - resizingRow.startY;
        const newHeight = Math.max(20, resizingRow.startHeight + delta);
        setRowHeights(prev => ({ ...prev, [resizingRow.index]: newHeight }));
      }
    };
    const handleGlobalMouseUp = () => {
      setResizingCol(null);
      setResizingRow(null);
    };

    if (resizingCol || resizingRow) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [resizingCol, resizingRow]);

  useEffect(() => {
    const onOpenPrintMenu = () => {
      setFileMenuSection('print');
      setShowFileMenu(true);
    };
    document.addEventListener('officex:open-print-menu', onOpenPrintMenu);
    return () => {
      document.removeEventListener('officex:open-print-menu', onOpenPrintMenu);
    };
  }, []);

  useEffect(() => {
    CommandDispatcher.registerRegistry(FileCommandRegistry.all());
    FileEngine.initialize();
    KeyboardManager.initialize();

    // Auto-open file if passed via URL or double-click
    const urlParams = new URLSearchParams(window.location.search);
    const initialFile = urlParams.get('file');
    if (initialFile) {
      setTimeout(() => {
        FileEngine.openFromPath(initialFile);
      }, 350);
    }

    return () => {
      FileEngine.dispose();
      KeyboardManager.dispose();
    };
  }, []);


  // Core Engines
  const [workbook, setWorkbook] = useState<Workbook>(() => new Workbook());
  const cfEngine = useMemo(() => new ConditionalFormattingEngine(), []);
  const [activeSheetId, setActiveSheetId] = useState<string>(workbook.activeSheetId!);
  const [sheetsVersion, setSheetsVersion] = useState(0);

  useEffect(() => {
    FileEngine.setDataProvider((targetPath?: string) => {
      const p = targetPath || FileEngine.getCurrentFile()?.path || '';
      const currentSheet = workbook.sheets.find(sheet => sheet.id === activeSheetId) || workbook.sheets[0];
      if (p.toLowerCase().endsWith('.csv') && currentSheet) {
        return CsvParser.stringifyWorksheet(currentSheet, ',');
      }
      if (p.toLowerCase().endsWith('.tsv') && currentSheet) {
        return CsvParser.stringifyWorksheet(currentSheet, '\t');
      }
      return workbook.serialize();
    });

    FileEngine.setOnLoad(async (content: any) => {
      if (!content) {
        const wb = new Workbook();
        setWorkbook(wb);
        setActiveSheetId(wb.activeSheetId!);
        setSheetsVersion(v => v + 1);
        return;
      }
      try {
        let loadedWb: Workbook | null = null;
        let newColWidths: Record<number, number> | null = null;
        let maxRow = 100;
        let maxCol = 26;

        // 1. Binary XLSX / DOCX
        if (typeof content === 'object' && content?.isBinary && (content.fileType === 'xlsx' || content.fileType === 'docx')) {
          const res = await XlsxParser.parse(content.base64);
          loadedWb = res.workbook;
          maxRow = res.maxRow;
          maxCol = res.maxCol;
          newColWidths = res.colWidths;
        } else if (typeof content === 'object' && content?.isBinary && (content.fileType === 'xls' || !content.fileType)) {
          const res = await XlsParser.parse(content.base64);
          loadedWb = res.workbook;
          maxRow = res.maxRow;
          maxCol = res.maxCol;
          newColWidths = res.colWidths;
        } else if (typeof content === 'string') {
          const trimmed = content.trim();
          // 2. OfficeX Workbook JSON
          if (trimmed.startsWith('{') && (trimmed.includes('"sheets"') || trimmed.includes('"activeSheetId"'))) {
            try {
              loadedWb = Workbook.deserialize(trimmed);
            } catch {
              loadedWb = null;
            }
          }

          // 3. Fallback: CSV / TSV / Delimited text
          if (!loadedWb) {
            const res = CsvParser.parseToWorkbook(content);
            loadedWb = res.workbook;
            maxRow = res.maxRow;
            maxCol = res.maxCol;
            newColWidths = res.colWidths;
          }
        }

        if (loadedWb) {
          setWorkbook(loadedWb);
          const firstSheetId = loadedWb.activeSheetId || loadedWb.sheets[0]?.id;
          if (firstSheetId) setActiveSheetId(firstSheetId);
          setRowCount(Math.max(100, maxRow + 25));
          setColCount(Math.max(26, maxCol + 6));
          if (newColWidths && Object.keys(newColWidths).length > 0) {
            setColWidths(prev => ({ ...prev, ...newColWidths }));
          }
          setSheetsVersion(v => v + 1);
          setVersion(v => v + 1);
        }
      } catch (e) {
        console.error('[FileEngine.setOnLoad] Failed to parse workbook:', e);
      }
    });
  }, [workbook, activeSheetId]);


  // ── File name / modified tracking (giống Excel thật) ─────────────────────
  const [workbookName, setWorkbookName] = useState('Workbook 1');
  const [isModifiedIndicator, setIsModifiedIndicator] = useState(false);

  useEffect(() => {
    const unsubRename  = FileEngine.on('file:renamed', (data) => {
      const name = data?.name || FileEngine.getCurrentFile()?.name || 'Workbook 1';
      setWorkbookName(name.replace(/\.[^.]+$/, ''));
    });
    const unsubOpen  = FileEngine.on('file:opened', (data) => {
      const name = data?.name || 'Workbook 1';
      setWorkbookName(name.replace(/\.[^.]+$/, ''));
      setIsModifiedIndicator(false);
    });
    const unsubSaved = FileEngine.on('file:saved', () => setIsModifiedIndicator(false));
    const unsubNew   = FileEngine.on('file:new', () => {
      setWorkbookName('Workbook 1');
      setIsModifiedIndicator(false);
    });
    return () => { unsubRename(); unsubOpen(); unsubSaved(); unsubNew(); };
  }, []);

  const [isInsertFunctionOpen, setIsInsertFunctionOpen] = useState(false);
  const [isPivotTableOpen, setIsPivotTableOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);
  const [aiInitialMessage, setAiInitialMessage] = useState<string | undefined>(undefined);

  const [dismissTooltip, setDismissTooltip] = useState(false);
  const [promptDialog, setPromptDialog] = useState<{ title: string, defaultValue: string, onConfirm: (val: string) => void, isConfirm?: boolean } | null>(null);
  const activeSheet = useMemo(() => workbook.sheets.find(s => s.id === activeSheetId) || workbook.sheets[0], [workbook, activeSheetId, sheetsVersion]);

  const activeCell = activeCells[activeSheetId] || { row: 1, col: 1 };
  const setActiveCell = (pos: { row: number, col: number }) => {
    setActiveCells(prev => ({ ...prev, [activeSheetId]: pos }));
    setDismissTooltip(false);
  };

  // Live refs — always point to current values for command handlers
  const activeCellRef = useRef(activeCell);
  const activeSheetRef = useRef(activeSheet);
  const rowHeightsRef = useRef(rowHeights);
  const colWidthsRef = useRef(colWidths);
  activeCellRef.current = activeCell;
  selectionRangeRef.current = selectionRange;
  activeSheetRef.current = activeSheet;
  rowHeightsRef.current = rowHeights;
  colWidthsRef.current = colWidths;

  const switchSheet = (id: string) => {
    setDrawMode(null);
    setFormatPainter(null);
    setActiveSheetId(id);
    const targetSheet = workbook.sheets.find(s => s.id === id) || workbook.sheets[0];
    const cellPos = activeCells[id] || { row: 1, col: 1 };
    const cell = targetSheet.getCell(cellPos.row, cellPos.col);
    setFormulaBarText(cell.formula || cell.value || '');
  };

  useEffect(() => {
    const onPreparingPrint = () => {
      let minR = 1, maxR = 1, minC = 1, maxC = 1;

      if (selectionRange && (selectionRange.start.row !== selectionRange.end.row || selectionRange.start.col !== selectionRange.end.col)) {
        minR = Math.min(selectionRange.start.row, selectionRange.end.row);
        maxR = Math.max(selectionRange.start.row, selectionRange.end.row);
        minC = Math.min(selectionRange.start.col, selectionRange.end.col);
        maxC = Math.max(selectionRange.start.col, selectionRange.end.col);
      } else {
        const cellsMap = (activeSheet as any).cells as Map<string, any>;
        for (const cell of cellsMap.values()) {
          if (cell.value || cell.formula || Object.keys(cell.format).length > 0) {
            maxR = Math.max(maxR, cell.row);
            maxC = Math.max(maxC, cell.col);
          }
        }
      }

      let html = '<table style="border-collapse: collapse; font-family: Calibri, sans-serif; font-size: 11pt; table-layout: fixed;">';
      for (let r = minR; r <= maxR; r++) {
        const height = rowHeights[r] ?? 24;
        html += `<tr style="height: ${height}px">`;
        for (let c = minC; c <= maxC; c++) {
          const width = colWidths[c] || 96;
          const cell = activeSheet.getCell(r, c);
          const val = cell.value || '';
          let styleStr = `border: 1px solid #e2e8f0; padding: 4px; width: ${width}px; min-width: ${width}px; max-width: ${width}px; white-space: nowrap; overflow: hidden;`;
          if (cell.format) {
            if (cell.format.fontWeight) styleStr += ` font-weight: ${cell.format.fontWeight};`;
            if (cell.format.fontStyle) styleStr += ` font-style: ${cell.format.fontStyle};`;
            if (cell.format.textDecoration) styleStr += ` text-decoration: ${cell.format.textDecoration};`;
            if (cell.format.textAlign) styleStr += ` text-align: ${cell.format.textAlign};`;
            if (cell.format.fontFamily) styleStr += ` font-family: ${cell.format.fontFamily};`;
            if (cell.format.fontSize) styleStr += ` font-size: ${cell.format.fontSize}pt;`;
            if (cell.format.color) styleStr += ` color: ${cell.format.color};`;
            if (cell.format.backgroundColor) styleStr += ` background-color: ${cell.format.backgroundColor};`;
          }
          html += `<td style="${styleStr}">${val}</td>`;
        }
        html += '</tr>';
      }
      html += '</table>';

      let container = document.getElementById('excel-print-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'excel-print-container';
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        document.body.appendChild(container);
      }
      container.innerHTML = `<div class="ox-page-box" style="padding: 40px; background: white; color: black;">${html}</div>`;
    };

    const onFinishPrint = () => {
      const container = document.getElementById('excel-print-container');
      if (container) container.remove();
    };

    document.addEventListener('officex:preparing-print', onPreparingPrint);
    document.addEventListener('officex:finish-print', onFinishPrint);
    return () => {
      document.removeEventListener('officex:preparing-print', onPreparingPrint);
      document.removeEventListener('officex:finish-print', onFinishPrint);
    };
  }, [selectionRange, activeSheet]);

  const parser = useMemo(() => new FormulaParser(), []);
  const graph = useMemo(() => new DependencyGraph(), []);
  const calcEngine = useMemo(() => new CalculationEngine(parser, graph), [parser, graph]);
  const engineRef = useRef(calcEngine);
  engineRef.current = calcEngine;

  const handleCellClick = (row: number, col: number) => {
    setActiveCell({ row, col });
    const cell = activeSheet.getCell(row, col);
    setFormulaBarText(cell.formula || cell.value || '');
  };

  const saveSnapshot = useCallback(() => {
    const sheet = activeSheetRef.current;
    const cellsMap = (sheet as any).cells as Map<string, any>;
    const entries = Array.from(cellsMap.entries()).map(([k, v]) => [k, { ...v, format: { ...v.format } }]);
    const snapshot = JSON.stringify({ cells: entries, mergedCells: sheet.mergedCells });

    setHistoryState(prev => {
      const newStack = prev.stack.slice(0, prev.index + 1);
      newStack.push(snapshot);
      if (newStack.length > 50) {
        newStack.shift();
        return { stack: newStack, index: newStack.length - 1 };
      }
      return { stack: newStack, index: prev.index + 1 };
    });
    // Mark workbook as modified (giống Excel: hiện dấu * trên title bar)
    setIsModifiedIndicator(true);
    FileEngine.markModified();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const undo = useCallback(() => {
    setHistoryState(prev => {
      if (prev.index > 0) {
        const newIndex = prev.index - 1;
        const snapshot = prev.stack[newIndex];
        const data = JSON.parse(snapshot);
        if (Array.isArray(data)) {
          (activeSheet as any).cells = new Map(data);
          activeSheet.mergedCells = [];
        } else {
          (activeSheet as any).cells = new Map(data.cells);
          activeSheet.mergedCells = data.mergedCells || [];
        }
        setVersion(v => v + 1);
        return { ...prev, index: newIndex };
      }
      return prev;
    });
  }, [activeSheet]);

  const redo = useCallback(() => {
    setHistoryState(prev => {
      if (prev.index < prev.stack.length - 1) {
        const newIndex = prev.index + 1;
        const snapshot = prev.stack[newIndex];
        const data = JSON.parse(snapshot);
        if (Array.isArray(data)) {
          (activeSheet as any).cells = new Map(data);
          activeSheet.mergedCells = [];
        } else {
          (activeSheet as any).cells = new Map(data.cells);
          activeSheet.mergedCells = data.mergedCells || [];
        }
        setVersion(v => v + 1);
        return { ...prev, index: newIndex };
      }
      return prev;
    });
  }, [activeSheet]);

  useEffect(() => {
    if (historyState.stack.length === 0) {
      saveSnapshot();
    }
  }, [historyState.stack.length, saveSnapshot]);

    // ── AI Translation Handlers ────────────────────────────────────────────────
  useEffect(() => {
    const unsubTranslate = CommandDispatcher.subscribe('EXCEL.AI.TRANSLATE', () => {
      setIsTranslateOpen(prev => !prev);
    });
    return () => unsubTranslate();
  }, []);

  const handleReplaceCell = useCallback((translatedText: string) => {
    const cell = activeSheet.getCell(activeCell.row, activeCell.col);
    cell.value = translatedText;
    saveSnapshot();
    setIsModifiedIndicator(true);
    FileEngine.markModified();
    setVersion(v => v + 1);
  }, [activeSheet, activeCell, saveSnapshot]);

  const handleInsertAdjacentCol = useCallback((translatedText: string) => {
    const targetCol = activeCell.col + 1;
    const cell = activeSheet.getCell(activeCell.row, targetCol);
    cell.value = translatedText;
    saveSnapshot();
    setIsModifiedIndicator(true);
    FileEngine.markModified();
    setVersion(v => v + 1);
  }, [activeSheet, activeCell, saveSnapshot]);

  const handleTranslateSheet = useCallback(async (sourceLang: string, targetLang: string, onProgress: (done: number, total: number) => void) => {
    const cellsMap = activeSheet.getCellsMap();
    const textCells: { id: string; row: number; col: number; text: string }[] = [];

    for (const cell of cellsMap.values()) {
      if (cell.value && typeof cell.value === 'string' && cell.value.trim() !== '' && !cell.formula) {
        if (!/^\d+(\.\d+)?$/.test(cell.value.trim())) {
          textCells.push({
            id: `${cell.row},${cell.col}`,
            row: cell.row,
            col: cell.col,
            text: cell.value,
          });
        }
      }
    }

    if (textCells.length === 0) return { count: 0 };

    const results = await TranslateEngine.translateBatch(
      textCells.map(tc => ({ id: tc.id, text: tc.text })),
      { sourceLang, targetLang },
      onProgress
    );

    for (const tc of textCells) {
      const trans = results.get(tc.id);
      if (trans) {
        activeSheet.getCell(tc.row, tc.col).value = trans;
      }
    }

    saveSnapshot();
    setIsModifiedIndicator(true);
    FileEngine.markModified();
    setVersion(v => v + 1);

    return { count: textCells.length };
  }, [activeSheet, saveSnapshot]);

  const mergeCellsAndCenter = useCallback(() => {
    if (!selectionRange) return;
    const minR = Math.min(selectionRange.start.row, selectionRange.end.row);
    const maxR = Math.max(selectionRange.start.row, selectionRange.end.row);
    const minC = Math.min(selectionRange.start.col, selectionRange.end.col);
    const maxC = Math.max(selectionRange.start.col, selectionRange.end.col);
    if (minR === maxR && minC === maxC) return;

    activeSheet.mergedCells = activeSheet.mergedCells.filter(m => (m.end.row < minR || m.start.row > maxR || m.end.col < minC || m.start.col > maxC));
    activeSheet.mergedCells.push({ start: { row: minR, col: minC }, end: { row: maxR, col: maxC } });
    const cell = activeSheet.getCell(minR, minC);
    cell.format = { ...cell.format, textAlign: 'center' };
    saveSnapshot();
    setVersion(v => v + 1);
  }, [activeSheet, selectionRange, saveSnapshot]);

  const mergeCellsAcross = useCallback(() => {
    if (!selectionRange) return;
    const minR = Math.min(selectionRange.start.row, selectionRange.end.row);
    const maxR = Math.max(selectionRange.start.row, selectionRange.end.row);
    const minC = Math.min(selectionRange.start.col, selectionRange.end.col);
    const maxC = Math.max(selectionRange.start.col, selectionRange.end.col);
    if (minC === maxC) return;

    activeSheet.mergedCells = activeSheet.mergedCells.filter(m => (m.end.row < minR || m.start.row > maxR || m.end.col < minC || m.start.col > maxC));
    for (let r = minR; r <= maxR; r++) {
      activeSheet.mergedCells.push({ start: { row: r, col: minC }, end: { row: r, col: maxC } });
    }
    saveSnapshot();
    setVersion(v => v + 1);
  }, [activeSheet, selectionRange, saveSnapshot]);

  const mergeCellsOnly = useCallback(() => {
    if (!selectionRange) return;
    const minR = Math.min(selectionRange.start.row, selectionRange.end.row);
    const maxR = Math.max(selectionRange.start.row, selectionRange.end.row);
    const minC = Math.min(selectionRange.start.col, selectionRange.end.col);
    const maxC = Math.max(selectionRange.start.col, selectionRange.end.col);
    if (minR === maxR && minC === maxC) return;

    activeSheet.mergedCells = activeSheet.mergedCells.filter(m => (m.end.row < minR || m.start.row > maxR || m.end.col < minC || m.start.col > maxC));
    activeSheet.mergedCells.push({ start: { row: minR, col: minC }, end: { row: maxR, col: maxC } });
    saveSnapshot();
    setVersion(v => v + 1);
  }, [activeSheet, selectionRange, saveSnapshot]);

  const unmergeCells = useCallback(() => {
    if (!selectionRange) return;
    const minR = Math.min(selectionRange.start.row, selectionRange.end.row);
    const maxR = Math.max(selectionRange.start.row, selectionRange.end.row);
    const minC = Math.min(selectionRange.start.col, selectionRange.end.col);
    const maxC = Math.max(selectionRange.start.col, selectionRange.end.col);

    activeSheet.mergedCells = activeSheet.mergedCells.filter(m => {
      return (m.end.row < minR || m.start.row > maxR || m.end.col < minC || m.start.col > maxC);
    });
    saveSnapshot();
    setVersion(v => v + 1);
  }, [activeSheet, selectionRange, saveSnapshot]);


  const updateCell = (row: number, col: number, rawInput: string) => {
    calcEngine.updateCell(activeSheet, row, col, rawInput);
    saveSnapshot();
    setVersion(v => v + 1); // Trigger re-render of grid
  };

  const handleFormulaBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setFormulaBarText(text);
    updateCell(activeCell.row, activeCell.col, text);
    if (text.startsWith('=')) {
        setDismissTooltip(false);
    }
  };

  const getCellRefCoords = (ref: string) => {
    const match = ref.match(/^([A-Z]+)(\d+)$/i);
    if (!match) return null;
    const colStr = match[1].toUpperCase();
    const row = parseInt(match[2], 10);
    let col = 0;
    for (let i = 0; i < colStr.length; i++) {
      col = col * 26 + (colStr.charCodeAt(i) - 64);
    }
    return { row, col };
  };

  const formulaRanges = useMemo(() => {
    if (!formulaBarText.startsWith('=')) return [];
    // Match something like A1 or A1:B2, only looking for valid references.
    const regex = /\b([A-Z]+[0-9]+)(?::([A-Z]+[0-9]+))?\b/g;
    const matches = Array.from(formulaBarText.matchAll(regex));
    const colors = ['#3b82f6', '#ef4444', '#a855f7', '#eab308', '#22c55e', '#f97316'];
    
    return matches.map((match, i) => {
      const startRef = match[1];
      const endRef = match[2] || startRef;
      const start = getCellRefCoords(startRef);
      const end = getCellRefCoords(endRef);
      if (!start || !end) return null;
      return {
        minR: Math.min(start.row, end.row),
        maxR: Math.max(start.row, end.row),
        minC: Math.min(start.col, end.col),
        maxC: Math.max(start.col, end.col),
        color: colors[i % colors.length]
      };
    }).filter(Boolean) as {minR: number, maxR: number, minC: number, maxC: number, color: string}[];
  }, [formulaBarText]);

  const applyFormatToSelection = (updater: (cell: any) => void) => {
    if (selectionRange) {
      const minR = Math.min(selectionRange.start.row, selectionRange.end.row);
      const maxR = Math.max(selectionRange.start.row, selectionRange.end.row);
      const minC = Math.min(selectionRange.start.col, selectionRange.end.col);
      const maxC = Math.max(selectionRange.start.col, selectionRange.end.col);
      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          updater(activeSheet.getCell(r, c));
        }
      }
    } else {
      updater(activeSheet.getCell(activeCell.row, activeCell.col));
    }
  };

  const toggleFormat = (key: string, value: any) => {
    applyFormatToSelection(cell => {
      if (!cell.format) cell.format = {};
      if (cell.format[key] === value) {
        delete cell.format[key];
      } else {
        cell.format[key] = value;
      }
    });
    
    // Sync UI fontState for the active cell
    const ac = activeCellRef.current;
    const cell = activeSheetRef.current.getCell(ac.row, ac.col);
    setFontState(prev => ({
      ...prev,
      bold: cell.format?.fontWeight === 'bold',
      italic: cell.format?.fontStyle === 'italic',
      underline: cell.format?.textDecoration === 'underline',
      fontFamily: cell.format?.fontFamily || prev.fontFamily,
      fontSize: cell.format?.fontSize || prev.fontSize,
      fontColor: cell.format?.color || prev.fontColor,
      bgColor: cell.format?.backgroundColor || prev.bgColor,
    }));

    saveSnapshot();
    setVersion(v => v + 1);
  };

  const applyFormat = (key: string, value: any) => {
    if (key === 'drawMode') {
      setDrawMode(value);
      return;
    }
    if (key === 'penColor') {
      setPenColor(value);
      return;
    }
    if (key === 'penStyle') {
      setPenStyle(value);
      return;
    }

    if (key === 'borders') {
      let minR = 1, maxR = 1, minC = 1, maxC = 1;
      if (selectionRange) {
        minR = Math.min(selectionRange.start.row, selectionRange.end.row);
        maxR = Math.max(selectionRange.start.row, selectionRange.end.row);
        minC = Math.min(selectionRange.start.col, selectionRange.end.col);
        maxC = Math.max(selectionRange.start.col, selectionRange.end.col);
      } else {
        minR = maxR = activeCell.row;
        minC = maxC = activeCell.col;
      }

      const getBorderStyle = (overrideStyle?: string) => {
        const style = overrideStyle || penStyle;
        const color = penColor || '#000000';
        if (style === 'thick') return `2px solid ${color}`;
        if (style === 'double') return `3px double ${color}`;
        if (style === 'dashed') return `1.5px dashed ${color}`;
        if (style === 'dotted') return `1.5px dotted ${color}`;
        if (style === 'medium') return `2px solid ${color}`;
        return `1px solid ${color}`; // thin or solid
      };
      const defStyle = getBorderStyle();
      const thickStyle = getBorderStyle('thick');
      const doubleStyle = getBorderStyle('double');

      const setAdj = (r: number, c: number, edge: 'top' | 'bottom' | 'left' | 'right', val?: string) => {
        if (r < 1 || c < 1) return;
        const adj = activeSheet.getCell(r, c);
        if (!adj.format) adj.format = {};
        if (val === undefined) {
          if (adj.format.borders) {
            delete adj.format.borders[edge];
            if (Object.keys(adj.format.borders).length === 0) delete adj.format.borders;
          }
        } else {
          if (!adj.format.borders) adj.format.borders = {};
          adj.format.borders[edge] = val;
        }
      };

      for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
          const cell = activeSheet.getCell(r, c);
          if (!cell.format) cell.format = {};

          if (value === undefined) {
            delete cell.format.borders;
            setAdj(r - 1, c, 'bottom', undefined);
            setAdj(r + 1, c, 'top', undefined);
            setAdj(r, c - 1, 'right', undefined);
            setAdj(r, c + 1, 'left', undefined);
          } else {
            let newBorders = { ...(cell.format.borders || {}) };

            if (value.all) {
              newBorders.top = defStyle; newBorders.bottom = defStyle; newBorders.left = defStyle; newBorders.right = defStyle;
              setAdj(r - 1, c, 'bottom', defStyle);
              setAdj(r + 1, c, 'top', defStyle);
              setAdj(r, c - 1, 'right', defStyle);
              setAdj(r, c + 1, 'left', defStyle);
            } else if (value.outside) {
              if (r === minR) { newBorders.top = value.thick ? thickStyle : defStyle; setAdj(r - 1, c, 'bottom', newBorders.top); }
              if (r === maxR) { newBorders.bottom = value.thick ? thickStyle : defStyle; setAdj(r + 1, c, 'top', newBorders.bottom); }
              if (c === minC) { newBorders.left = value.thick ? thickStyle : defStyle; setAdj(r, c - 1, 'right', newBorders.left); }
              if (c === maxC) { newBorders.right = value.thick ? thickStyle : defStyle; setAdj(r, c + 1, 'left', newBorders.right); }
            } else {
              if ('top' in value && r === minR) { newBorders.top = value.top ? defStyle : undefined; setAdj(r - 1, c, 'bottom', newBorders.top); }
              if ('left' in value && c === minC) { newBorders.left = value.left ? defStyle : undefined; setAdj(r, c - 1, 'right', newBorders.left); }
              if ('right' in value && c === maxC) { newBorders.right = value.right ? defStyle : undefined; setAdj(r, c + 1, 'left', newBorders.right); }
              if ('bottom' in value && r === maxR) {
                if (value.doubleBottom) newBorders.bottom = doubleStyle;
                else if (value.thickBottom) newBorders.bottom = thickStyle;
                else newBorders.bottom = value.bottom ? defStyle : undefined;
                setAdj(r + 1, c, 'top', newBorders.bottom);
              }
            }
            cell.format.borders = newBorders;
          }
        }
      }
    } else {
      applyFormatToSelection(cell => {
        cell.format[key] = value;
      });
    }
    
    // Sync UI fontState for the active cell
    const ac = activeCellRef.current;
    const cell = activeSheetRef.current.getCell(ac.row, ac.col);
    setFontState(prev => ({
      ...prev,
      bold: cell.format?.fontWeight === 'bold',
      italic: cell.format?.fontStyle === 'italic',
      underline: cell.format?.textDecoration === 'underline',
      fontFamily: cell.format?.fontFamily || prev.fontFamily,
      fontSize: cell.format?.fontSize || prev.fontSize,
      fontColor: cell.format?.color || prev.fontColor,
      bgColor: cell.format?.backgroundColor || prev.bgColor,
    }));

    saveSnapshot();
    setVersion(v => v + 1);
  };

  const applyFormatRef = useRef(applyFormat);
  applyFormatRef.current = applyFormat;
  const toggleFormatRef = useRef(toggleFormat);
  toggleFormatRef.current = toggleFormat;

  const prevIsSelecting = useRef(isSelecting);
  useEffect(() => {
    if (prevIsSelecting.current === true && isSelecting === false) {
      if (drawMode && selectionRange) {
        const apply = applyFormatRef.current;
        if (drawMode === 'erase') apply('borders', undefined);
        else if (drawMode === 'draw') apply('borders', { outside: true, top: true, bottom: true, left: true, right: true });
        else if (drawMode === 'drawGrid') apply('borders', { all: true, top: true, bottom: true, left: true, right: true });
      }
    }
    prevIsSelecting.current = isSelecting;
  }, [isSelecting, drawMode, selectionRange]);

  const ribbonTabs = [
    { id: 'file', label: 'Tệp' },
    { id: 'home', label: 'Trang chủ' },
    { id: 'insert', label: 'Chèn' },
    { id: 'ai', label: '✨ AI' },
  ];

  // Helper to get active cell formats for ribbon
  const currentFormat = activeSheet.getCell(activeCell.row, activeCell.col).format || {};

  // Sync fontState from active cell on click
  const handleCellClickWithFont = (row: number, col: number, isMouseAction = false) => {
    setIsEditing(false);
    setContextMenuPos(null);
    
    // Auto-scroll to cell if needed
    const cellEl = document.getElementById(`cell-${row}-${col}`);
    if (formatPainter) {
      // Apply format painter to the clicked cell
      const cellToUpdate = activeSheet.getCell(row, col);
      cellToUpdate.format = { ...cellToUpdate.format, ...formatPainter };
      setFormatPainter(null); // Turn off after single use
      saveSnapshot();
      setVersion(v => v + 1);
    }

    if (isMouseAction) {
      setIsSelecting(true);
    }
    setSelectionRange({ start: { row, col }, end: { row, col } });
    setActiveCell({ row, col });
    setTimeout(() => {
      const el = document.getElementById(`cell-input-${row}-${col}`);
      if (el) el.focus();
    }, 0);

    const cell = activeSheet.getCell(row, col);
    setFormulaBarText(cell.formula || cell.value || '');
    setFontState(prev => ({
      ...prev,
      bold: cell.format?.fontWeight === 'bold',
      italic: cell.format?.fontStyle === 'italic',
      underline: cell.format?.textDecoration === 'underline',
      fontFamily: cell.format?.fontFamily || prev.fontFamily,
      fontSize: cell.format?.fontSize || prev.fontSize,
    }));
  };

  const handleCellNavigation = (dR: number, dC: number, shiftKey: boolean, ctrlKey: boolean) => {
    setIsEditing(false);
    setContextMenuPos(null);
    
    // Find starting point (current active cell or selection end)
    const currentRef = shiftKey && selectionRange ? selectionRange.end : activeCell;
    let r = currentRef.row;
    let c = currentRef.col;

    if (ctrlKey) {
      // Jump to edge logic (naive implementation: jump to extreme ends for now)
      if (dR < 0) r = 1;
      else if (dR > 0) r = rowCount;
      if (dC < 0) c = 1;
      else if (dC > 0) c = colCount;
    } else {
      r = Math.max(1, Math.min(rowCount, r + dR));
      c = Math.max(1, Math.min(colCount, c + dC));
    }

    if (shiftKey) {
      setSelectionRange(prev => prev ? { ...prev, end: { row: r, col: c } } : { start: activeCell, end: { row: r, col: c } });
    } else {
      handleCellClickWithFont(r, c);
    }
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (isSelecting) {
      setSelectionRange(prev => prev ? { ...prev, end: { row, col } } : null);
    }
  };

  const isCellSelected = (r: number, c: number) => {
    if (!selectionRange) return false;
    const minR = Math.min(selectionRange.start.row, selectionRange.end.row);
    const maxR = Math.max(selectionRange.start.row, selectionRange.end.row);
    const minC = Math.min(selectionRange.start.col, selectionRange.end.col);
    const maxC = Math.max(selectionRange.start.col, selectionRange.end.col);
    return r >= minR && r <= maxR && c >= minC && c <= maxC;
  };

  const handleFontChange = (change: Partial<typeof fontState>) => {
    const newState = { ...fontState, ...change };
    setFontState(newState);

    applyFormatToSelection(cell => {
      if (change.bold !== undefined) {
        cell.format = { ...cell.format, fontWeight: newState.bold ? 'bold' : 'normal' };
      }
      if (change.italic !== undefined) {
        cell.format = { ...cell.format, fontStyle: newState.italic ? 'italic' : 'normal' };
      }
      if (change.underline !== undefined) {
        cell.format = { ...cell.format, textDecoration: newState.underline ? 'underline' : 'none' };
      }
      if (change.strikethrough !== undefined) {
        const existing = cell.format?.textDecoration || '';
        cell.format = { ...cell.format, textDecoration: newState.strikethrough ? 'line-through' : existing.replace('line-through', '').trim() };
      }
      if (change.fontFamily !== undefined) {
        cell.format = { ...cell.format, fontFamily: change.fontFamily };
      }
      if (change.fontSize !== undefined) {
        cell.format = { ...cell.format, fontSize: change.fontSize };
      }
      if (change.fontColor !== undefined) {
        cell.format = { ...cell.format, color: change.fontColor };
      }
      if (change.bgColor !== undefined) {
        cell.format = { ...cell.format, backgroundColor: change.bgColor };
      }
    });

    saveSnapshot();
    setVersion(v => v + 1);
  };

  useEffect(() => {
    CommandDispatcher.registerRegistry([
      { id: 'EXCEL.UNDO', name: 'Undo', handler: undo },
      { id: 'EXCEL.REDO', name: 'Redo', handler: redo },
      { id: 'EXCEL.CELL.MERGE_CENTER', name: 'Merge & Center', handler: mergeCellsAndCenter },
      { id: 'EXCEL.CELL.MERGE_ACROSS', name: 'Merge Across', handler: mergeCellsAcross },
      { id: 'EXCEL.CELL.MERGE_CELLS', name: 'Merge Cells', handler: mergeCellsOnly },
      { id: 'EXCEL.CELL.UNMERGE', name: 'Unmerge', handler: unmergeCells },
      { id: 'EXCEL.CELL.TOGGLE_WRAP', name: 'Wrap Text', handler: () => toggleFormat('whiteSpace', currentFormat?.whiteSpace === 'normal' ? 'nowrap' : 'normal') },
      { id: 'EXCEL.VIEW.HIDE_FORMULA_BAR', name: 'Hide Formula Bar', handler: () => setFormulaBarVisible(false) },

      // ── Edit & Select ─────────────────────────────────────────
      {
        id: 'EXCEL.SELECT.ALL', name: 'Select All', handler: () => {
          setSelectionRange({ start: { row: 1, col: 1 }, end: { row: rowCount, col: colCount } });
        }
      },
      {
        id: 'EXCEL.EDIT.COPY', name: 'Copy', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const range = sr || { start: ac, end: ac };
          setClipboardState({ type: 'copy', range });

          const minR = Math.min(range.start.row, range.end.row);
          const maxR = Math.max(range.start.row, range.end.row);
          const minC = Math.min(range.start.col, range.end.col);
          const maxC = Math.max(range.start.col, range.end.col);
          let text = '';
          const sheet = activeSheetRef.current;
          for (let r = minR; r <= maxR; r++) {
            let rowText = [];
            for (let c = minC; c <= maxC; c++) {
               const cell = sheet.getCell(r, c);
               rowText.push(cell.value || '');
            }
            text += rowText.join('\t') + '\n';
          }
          navigator.clipboard.writeText(text.replace(/\n$/, '')).catch(() => {});
        }
      },
      {
        id: 'EXCEL.EDIT.CUT', name: 'Cut', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const range = sr || { start: ac, end: ac };
          setClipboardState({ type: 'cut', range });

          const minR = Math.min(range.start.row, range.end.row);
          const maxR = Math.max(range.start.row, range.end.row);
          const minC = Math.min(range.start.col, range.end.col);
          const maxC = Math.max(range.start.col, range.end.col);
          let text = '';
          const sheet = activeSheetRef.current;
          for (let r = minR; r <= maxR; r++) {
            let rowText = [];
            for (let c = minC; c <= maxC; c++) {
               const cell = sheet.getCell(r, c);
               rowText.push(cell.value || '');
            }
            text += rowText.join('\t') + '\n';
          }
          navigator.clipboard.writeText(text.replace(/\n$/, '')).catch(() => {});
        }
      },
      {
        id: 'EXCEL.EDIT.PASTE', name: 'Paste', handler: async () => {
          const cb = clipboardStateRef.current;
          const ac = activeCellRef.current;
          const sheet = activeSheetRef.current;
          const sr = selectionRangeRef.current;
          
          console.log("PASTE HANDLER RUNNING! cb:", cb, "ac:", ac, "sr:", sr);
          
          if (!cb) {
            try {
              const pasteText = await navigator.clipboard.readText();
              if (pasteText) {
                calcEngine.updateCell(sheet, ac.row, ac.col, pasteText);
                setFormulaBarText(sheet.getCell(ac.row, ac.col).formula || sheet.getCell(ac.row, ac.col).value || '');
                setVersion(v => v + 1);
                saveSnapshot();
              }
            } catch (e) {}
            return;
          }
          
          const targetMinR = sr ? Math.min(sr.start.row, sr.end.row) : ac.row;
          const targetMinC = sr ? Math.min(sr.start.col, sr.end.col) : ac.col;
          const cbMinR = Math.min(cb.range.start.row, cb.range.end.row);
          const cbMaxR = Math.max(cb.range.start.row, cb.range.end.row);
          const cbMinC = Math.min(cb.range.start.col, cb.range.end.col);
          const cbMaxC = Math.max(cb.range.start.col, cb.range.end.col);
          
          let changed = false;
          
          // Buffer source cells first to avoid overlapping mutation bugs
          const sourceData: { value: string, format?: any }[][] = [];
          for (let r = 0; r <= cbMaxR - cbMinR; r++) {
            sourceData[r] = [];
            for (let c = 0; c <= cbMaxC - cbMinC; c++) {
              const srcCell = sheet.getCell(cbMinR + r, cbMinC + c);
              sourceData[r][c] = {
                value: srcCell.formula || srcCell.value || '',
                format: srcCell.format ? { ...srcCell.format } : undefined
              };
            }
          }
          console.log("Buffered sourceData:", sourceData);

          // Clear cut range if needed
          if (cb.type === 'cut') {
            for (let r = 0; r <= cbMaxR - cbMinR; r++) {
              for (let c = 0; c <= cbMaxC - cbMinC; c++) {
                calcEngine.updateCell(sheet, cbMinR + r, cbMinC + c, '');
                const oldCell = sheet.getCell(cbMinR + r, cbMinC + c);
                if (oldCell.format) oldCell.format = {};
              }
            }
          }

          try {
            // Paste into destination
            for (let r = 0; r <= cbMaxR - cbMinR; r++) {
              for (let c = 0; c <= cbMaxC - cbMinC; c++) {
                const destR = targetMinR + r;
                const destC = targetMinC + c;
                const src = sourceData[r][c];
                calcEngine.updateCell(sheet, destR, destC, String(src.value || ''));
                const targetCell = sheet.getCell(destR, destC);
                if (src.format) targetCell.format = { ...src.format };
                changed = true;
              }
            }
          } catch (err) {
            console.log("Paste failed with error:", err.message, err.stack);
          }
          console.log("Paste completed! changed:", changed);

          if (cb.type === 'cut') {
            setClipboardState(null);
          }
          if (changed) {
            setFormulaBarText(sheet.getCell(ac.row, ac.col).formula || sheet.getCell(ac.row, ac.col).value || '');
            setVersion(v => v + 1);
            saveSnapshot();
          }
        }
      },
      {
        id: 'EXCEL.EDIT.PASTE_VALUES', name: 'Paste Values', handler: async () => {
          const cb = clipboardStateRef.current;
          const ac = activeCellRef.current;
          const sheet = activeSheetRef.current;
          const sr = selectionRangeRef.current;
          
          if (!cb) {
            try {
              const pasteText = await navigator.clipboard.readText();
              if (pasteText) {
                calcEngine.updateCell(sheet, ac.row, ac.col, pasteText);
                setFormulaBarText(sheet.getCell(ac.row, ac.col).formula || sheet.getCell(ac.row, ac.col).value || '');
                setVersion(v => v + 1);
                saveSnapshot();
              }
            } catch (e) {}
            return;
          }
          
          const targetMinR = sr ? Math.min(sr.start.row, sr.end.row) : ac.row;
          const targetMinC = sr ? Math.min(sr.start.col, sr.end.col) : ac.col;
          const cbMinR = Math.min(cb.range.start.row, cb.range.end.row);
          const cbMaxR = Math.max(cb.range.start.row, cb.range.end.row);
          const cbMinC = Math.min(cb.range.start.col, cb.range.end.col);
          const cbMaxC = Math.max(cb.range.start.col, cb.range.end.col);
          
          let changed = false;
          
          const sourceData: { value: string }[][] = [];
          for (let r = 0; r <= cbMaxR - cbMinR; r++) {
            sourceData[r] = [];
            for (let c = 0; c <= cbMaxC - cbMinC; c++) {
              const srcCell = sheet.getCell(cbMinR + r, cbMinC + c);
              sourceData[r][c] = {
                value: srcCell.value ?? '' // Only copy value, not formula
              };
            }
          }

          if (cb.type === 'cut') {
            for (let r = 0; r <= cbMaxR - cbMinR; r++) {
              for (let c = 0; c <= cbMaxC - cbMinC; c++) {
                calcEngine.updateCell(sheet, cbMinR + r, cbMinC + c, '');
                const oldCell = sheet.getCell(cbMinR + r, cbMinC + c);
                if (oldCell.format) oldCell.format = {};
              }
            }
          }

          try {
            for (let r = 0; r <= cbMaxR - cbMinR; r++) {
              for (let c = 0; c <= cbMaxC - cbMinC; c++) {
                const destR = targetMinR + r;
                const destC = targetMinC + c;
                const src = sourceData[r][c];
                // Paste literal value
                const valToPaste = String(src.value ?? '');
                // Escape it if it looks like a formula so it doesn't get re-evaluated as one
                const escapedVal = valToPaste.startsWith('=') ? "'" + valToPaste : valToPaste;
                calcEngine.updateCell(sheet, destR, destC, escapedVal);
                // Do NOT copy formats
                changed = true;
              }
            }
          } catch (err) {
            console.error("Paste values failed", err);
          }

          if (cb.type === 'cut') {
            setClipboardState(null);
          }
          if (changed) {
            setFormulaBarText(sheet.getCell(ac.row, ac.col).formula || sheet.getCell(ac.row, ac.col).value || '');
            setVersion(v => v + 1);
            saveSnapshot();
          }
        }
      },
      {
        id: 'EXCEL.DATA.SORT_ASC', name: 'Sort A to Z', handler: () => {
          const sr = selectionRangeRef.current;
          if (!sr) return;
          const minR = Math.min(sr.start.row, sr.end.row);
          const maxR = Math.max(sr.start.row, sr.end.row);
          const minC = Math.min(sr.start.col, sr.end.col);
          const maxC = Math.max(sr.start.col, sr.end.col);
          const sheet = activeSheetRef.current;
          
          const rows = [];
          for (let r = minR; r <= maxR; r++) {
            const rowData = [];
            for (let c = minC; c <= maxC; c++) {
              const cell = sheet.getCell(r, c);
              rowData.push({ value: cell.value, format: cell.format, formula: cell.formula });
            }
            rows.push(rowData);
          }
          
          rows.sort((a, b) => {
            const valA = String(a[0].value || '').toLowerCase();
            const valB = String(b[0].value || '').toLowerCase();
            if (!valA && valB) return 1;
            if (valA && !valB) return -1;
            if (valA < valB) return -1;
            if (valA > valB) return 1;
            return 0;
          });
          
          for (let r = minR; r <= maxR; r++) {
            for (let c = minC; c <= maxC; c++) {
              const data = rows[r - minR][c - minC];
              calcEngine.updateCell(sheet, r, c, String(data.formula || data.value || ''));
              sheet.getCell(r, c).format = data.format;
            }
          }
          setVersion(v => v + 1);
          saveSnapshot();
        }
      },
      {
        id: 'EXCEL.DATA.SORT_DESC', name: 'Sort Z to A', handler: () => {
          const sr = selectionRangeRef.current;
          if (!sr) return;
          const minR = Math.min(sr.start.row, sr.end.row);
          const maxR = Math.max(sr.start.row, sr.end.row);
          const minC = Math.min(sr.start.col, sr.end.col);
          const maxC = Math.max(sr.start.col, sr.end.col);
          const sheet = activeSheetRef.current;
          
          const rows = [];
          for (let r = minR; r <= maxR; r++) {
            const rowData = [];
            for (let c = minC; c <= maxC; c++) {
              const cell = sheet.getCell(r, c);
              rowData.push({ value: cell.value, format: cell.format, formula: cell.formula });
            }
            rows.push(rowData);
          }
          
          rows.sort((a, b) => {
            const valA = String(a[0].value || '').toLowerCase();
            const valB = String(b[0].value || '').toLowerCase();
            if (!valA && valB) return 1;
            if (valA && !valB) return -1;
            if (valA < valB) return 1;
            if (valA > valB) return -1;
            return 0;
          });
          
          for (let r = minR; r <= maxR; r++) {
            for (let c = minC; c <= maxC; c++) {
              const data = rows[r - minR][c - minC];
              calcEngine.updateCell(sheet, r, c, String(data.formula || data.value || ''));
              sheet.getCell(r, c).format = data.format;
            }
          }
          setVersion(v => v + 1);
          saveSnapshot();
        }
      },
      {
        id: 'EXCEL.DATA.FILTER_BY_VALUE', name: 'Filter by Value', handler: () => {
          const ac = activeCellRef.current;
          const sheet = activeSheetRef.current;
          const map = sheet.getCellsMap();
          const targetCell = map.get(`${ac.row},${ac.col}`);
          const targetValue = targetCell ? (targetCell.value || '') : '';
          
          setRowHeights(prev => {
            const next = { ...prev };
            let maxRow = 100;
            map.forEach((cell, key) => {
              if (cell.col === ac.col && cell.row > maxRow) maxRow = cell.row;
            });
            if (maxRow > 1000) maxRow = 1000;
            for (let r = 1; r <= maxRow; r++) {
               if (r === ac.row) {
                  if (next[r] === 0) delete next[r];
                  continue;
               }
               const cell = map.get(`${r},${ac.col}`);
               const cellVal = cell ? (cell.value || '') : '';
               if (cellVal !== targetValue) {
                 next[r] = 0;
               } else {
                 if (next[r] === 0) delete next[r];
               }
            }
            return next;
          });
        }
      },
      {
        id: 'EXCEL.DATA.FILTER_BY_COLOR', name: 'Filter by Color', handler: () => {
          const ac = activeCellRef.current;
          const sheet = activeSheetRef.current;
          const map = sheet.getCellsMap();
          const targetCell = map.get(`${ac.row},${ac.col}`);
          const targetColor = targetCell && targetCell.format ? (targetCell.format.backgroundColor || '') : '';
          
          setRowHeights(prev => {
            const next = { ...prev };
            let maxRow = 100;
            map.forEach((cell) => { if (cell.col === ac.col && cell.row > maxRow) maxRow = cell.row; });
            if (maxRow > 1000) maxRow = 1000;
            for (let r = 1; r <= maxRow; r++) {
               if (r === ac.row) {
                  if (next[r] === 0) delete next[r];
                  continue;
               }
               const cell = map.get(`${r},${ac.col}`);
               const cellColor = cell && cell.format ? (cell.format.backgroundColor || '') : '';
               if (cellColor !== targetColor) {
                 next[r] = 0;
               } else {
                 if (next[r] === 0) delete next[r];
               }
            }
            return next;
          });
        }
      },
      {
        id: 'EXCEL.DATA.FILTER_BY_TEXT_COLOR', name: 'Filter by Text Color', handler: () => {
          const ac = activeCellRef.current;
          const sheet = activeSheetRef.current;
          const map = sheet.getCellsMap();
          const targetCell = map.get(`${ac.row},${ac.col}`);
          const targetColor = targetCell && targetCell.format ? (targetCell.format.color || '') : '';
          
          setRowHeights(prev => {
            const next = { ...prev };
            let maxRow = 100;
            map.forEach((cell) => { if (cell.col === ac.col && cell.row > maxRow) maxRow = cell.row; });
            if (maxRow > 1000) maxRow = 1000;
            for (let r = 1; r <= maxRow; r++) {
               if (r === ac.row) {
                  if (next[r] === 0) delete next[r];
                  continue;
               }
               const cell = map.get(`${r},${ac.col}`);
               const cellColor = cell && cell.format ? (cell.format.color || '') : '';
               if (cellColor !== targetColor) {
                 next[r] = 0;
               } else {
                 if (next[r] === 0) delete next[r];
               }
            }
            return next;
          });
        }
      },
      {
        id: 'EXCEL.DATA.FILTER_BY_ICON', name: 'Filter by Icon', handler: () => {
          console.log("Filter by Icon clicked");
        }
      },
      {
        id: 'EXCEL.EDIT.CLEAR_ALL', name: 'Clear All', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const sheet = activeSheetRef.current;
          let changed = false;
          
          if (sr) {
            const minR = Math.min(sr.start.row, sr.end.row);
            const maxR = Math.max(sr.start.row, sr.end.row);
            const minC = Math.min(sr.start.col, sr.end.col);
            const maxC = Math.max(sr.start.col, sr.end.col);
            for (let r = minR; r <= maxR; r++) {
              for (let c = minC; c <= maxC; c++) {
                if (sheet.getCell(r, c).value !== '' || sheet.getCell(r, c).format) {
                  calcEngine.updateCell(sheet, r, c, '');
                  delete sheet.getCell(r, c).format;
                  changed = true;
                }
              }
            }
          } else {
            if (sheet.getCell(ac.row, ac.col).value !== '' || sheet.getCell(ac.row, ac.col).format) {
              calcEngine.updateCell(sheet, ac.row, ac.col, '');
              delete sheet.getCell(ac.row, ac.col).format;
              changed = true;
            }
          }
          if (changed) {
            setFormulaBarText(sheet.getCell(ac.row, ac.col).formula || sheet.getCell(ac.row, ac.col).value || '');
            setVersion(v => v + 1);
            saveSnapshot();
          }
        }
      },
      {
        id: 'EXCEL.EDIT.CLEAR_FORMATS', name: 'Clear Formats', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const sheet = activeSheetRef.current;
          let changed = false;
          
          if (sr) {
            const minR = Math.min(sr.start.row, sr.end.row);
            const maxR = Math.max(sr.start.row, sr.end.row);
            const minC = Math.min(sr.start.col, sr.end.col);
            const maxC = Math.max(sr.start.col, sr.end.col);
            for (let r = minR; r <= maxR; r++) {
              for (let c = minC; c <= maxC; c++) {
                if (sheet.getCell(r, c).format) {
                  delete sheet.getCell(r, c).format;
                  changed = true;
                }
              }
            }
          } else {
            if (sheet.getCell(ac.row, ac.col).format) {
              delete sheet.getCell(ac.row, ac.col).format;
              changed = true;
            }
          }
          if (changed) {
            setVersion(v => v + 1);
            saveSnapshot();
          }
        }
      },
      {
        id: 'EXCEL.EDIT.CLEAR_CONTENTS', name: 'Clear Contents', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const sheet = activeSheetRef.current;
          let changed = false;
          
          if (sr) {
            const minR = Math.min(sr.start.row, sr.end.row);
            const maxR = Math.max(sr.start.row, sr.end.row);
            const minC = Math.min(sr.start.col, sr.end.col);
            const maxC = Math.max(sr.start.col, sr.end.col);
            for (let r = minR; r <= maxR; r++) {
              for (let c = minC; c <= maxC; c++) {
                if (sheet.getCell(r, c).value !== '') {
                  calcEngine.updateCell(sheet, r, c, '');
                  changed = true;
                }
              }
            }
          } else {
            if (sheet.getCell(ac.row, ac.col).value !== '') {
              calcEngine.updateCell(sheet, ac.row, ac.col, '');
              changed = true;
            }
          }
          if (changed) {
            setFormulaBarText(sheet.getCell(ac.row, ac.col).formula || sheet.getCell(ac.row, ac.col).value || '');
            setVersion(v => v + 1);
            saveSnapshot();
          }
        }
      },
      {
        id: 'EXCEL.EDIT.CLEAR_COMMENTS', name: 'Clear Comments', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const sheet = activeSheetRef.current;
          let changed = false;
          if (sr) {
            const minR = Math.min(sr.start.row, sr.end.row);
            const maxR = Math.max(sr.start.row, sr.end.row);
            const minC = Math.min(sr.start.col, sr.end.col);
            const maxC = Math.max(sr.start.col, sr.end.col);
            for (let r = minR; r <= maxR; r++) {
              for (let c = minC; c <= maxC; c++) {
                const cell = sheet.getCell(r, c) as any;
                if (cell.comment !== undefined) { delete cell.comment; changed = true; }
              }
            }
          } else {
            const cell = sheet.getCell(ac.row, ac.col) as any;
            if (cell.comment !== undefined) { delete cell.comment; changed = true; }
          }
          if (changed) { setVersion(v => v + 1); saveSnapshot(); }
        }
      },
      {
        id: 'EXCEL.EDIT.CLEAR_NOTES', name: 'Clear Notes', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const sheet = activeSheetRef.current;
          let changed = false;
          if (sr) {
            const minR = Math.min(sr.start.row, sr.end.row);
            const maxR = Math.max(sr.start.row, sr.end.row);
            const minC = Math.min(sr.start.col, sr.end.col);
            const maxC = Math.max(sr.start.col, sr.end.col);
            for (let r = minR; r <= maxR; r++) {
              for (let c = minC; c <= maxC; c++) {
                const cell = sheet.getCell(r, c) as any;
                if (cell.note !== undefined) { delete cell.note; changed = true; }
              }
            }
          } else {
            const cell = sheet.getCell(ac.row, ac.col) as any;
            if (cell.note !== undefined) { delete cell.note; changed = true; }
          }
          if (changed) { setVersion(v => v + 1); saveSnapshot(); }
        }
      },
      {
        id: 'EXCEL.EDIT.REMOVE_HYPERLINKS', name: 'Remove Hyperlinks', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const sheet = activeSheetRef.current;
          let changed = false;
          if (sr) {
            const minR = Math.min(sr.start.row, sr.end.row);
            const maxR = Math.max(sr.start.row, sr.end.row);
            const minC = Math.min(sr.start.col, sr.end.col);
            const maxC = Math.max(sr.start.col, sr.end.col);
            for (let r = minR; r <= maxR; r++) {
              for (let c = minC; c <= maxC; c++) {
                const cell = sheet.getCell(r, c) as any;
                if (cell.hyperlink !== undefined) { delete cell.hyperlink; changed = true; }
              }
            }
          } else {
            const cell = sheet.getCell(ac.row, ac.col) as any;
            if (cell.hyperlink !== undefined) { delete cell.hyperlink; changed = true; }
          }
          if (changed) { setVersion(v => v + 1); saveSnapshot(); }
        }
      },
      {
        id: 'EXCEL.EDIT.FILL_DOWN', name: 'Fill Down', handler: () => {
          const sr = selectionRangeRef.current;
          if (!sr) return;
          const minR = Math.min(sr.start.row, sr.end.row);
          const maxR = Math.max(sr.start.row, sr.end.row);
          const minC = Math.min(sr.start.col, sr.end.col);
          const maxC = Math.max(sr.start.col, sr.end.col);
          if (minR === maxR) return;
          const sheet = activeSheetRef.current;
          let changed = false;
          for (let c = minC; c <= maxC; c++) {
            const srcCell = sheet.getCell(minR, c);
            for (let r = minR + 1; r <= maxR; r++) {
              calcEngine.updateCell(sheet, r, c, String(srcCell.formula || srcCell.value || ''));
              const target = sheet.getCell(r, c);
              if (srcCell.format) target.format = { ...srcCell.format };
              changed = true;
            }
          }
          if (changed) { setVersion(v => v + 1); saveSnapshot(); }
        }
      },
      {
        id: 'EXCEL.EDIT.FILL_RIGHT', name: 'Fill Right', handler: () => {
          const sr = selectionRangeRef.current;
          if (!sr) return;
          const minR = Math.min(sr.start.row, sr.end.row);
          const maxR = Math.max(sr.start.row, sr.end.row);
          const minC = Math.min(sr.start.col, sr.end.col);
          const maxC = Math.max(sr.start.col, sr.end.col);
          if (minC === maxC) return;
          const sheet = activeSheetRef.current;
          let changed = false;
          for (let r = minR; r <= maxR; r++) {
            const srcCell = sheet.getCell(r, minC);
            for (let c = minC + 1; c <= maxC; c++) {
              calcEngine.updateCell(sheet, r, c, String(srcCell.formula || srcCell.value || ''));
              const target = sheet.getCell(r, c);
              if (srcCell.format) target.format = { ...srcCell.format };
              changed = true;
            }
          }
          if (changed) { setVersion(v => v + 1); saveSnapshot(); }
        }
      },
      {
        id: 'EXCEL.EDIT.FILL_UP', name: 'Fill Up', handler: () => {
          const sr = selectionRangeRef.current;
          if (!sr) return;
          const minR = Math.min(sr.start.row, sr.end.row);
          const maxR = Math.max(sr.start.row, sr.end.row);
          const minC = Math.min(sr.start.col, sr.end.col);
          const maxC = Math.max(sr.start.col, sr.end.col);
          if (minR === maxR) return;
          const sheet = activeSheetRef.current;
          let changed = false;
          for (let c = minC; c <= maxC; c++) {
            const srcCell = sheet.getCell(maxR, c);
            for (let r = maxR - 1; r >= minR; r--) {
              calcEngine.updateCell(sheet, r, c, String(srcCell.formula || srcCell.value || ''));
              const target = sheet.getCell(r, c);
              if (srcCell.format) target.format = { ...srcCell.format };
              changed = true;
            }
          }
          if (changed) { setVersion(v => v + 1); saveSnapshot(); }
        }
      },
      {
        id: 'EXCEL.EDIT.FILL_LEFT', name: 'Fill Left', handler: () => {
          const sr = selectionRangeRef.current;
          if (!sr) return;
          const minR = Math.min(sr.start.row, sr.end.row);
          const maxR = Math.max(sr.start.row, sr.end.row);
          const minC = Math.min(sr.start.col, sr.end.col);
          const maxC = Math.max(sr.start.col, sr.end.col);
          if (minC === maxC) return;
          const sheet = activeSheetRef.current;
          let changed = false;
          for (let r = minR; r <= maxR; r++) {
            const srcCell = sheet.getCell(r, maxC);
            for (let c = maxC - 1; c >= minC; c--) {
              calcEngine.updateCell(sheet, r, c, String(srcCell.formula || srcCell.value || ''));
              const target = sheet.getCell(r, c);
              if (srcCell.format) target.format = { ...srcCell.format };
              changed = true;
            }
          }
          if (changed) { setVersion(v => v + 1); saveSnapshot(); }
        }
      },
      { id: 'EXCEL.VIEW.TOGGLE_FORMAT_SIDEBAR', name: 'Toggle Format Sidebar', handler: () => setShowFormatSidebar(v => !v) },
      { id: 'EXCEL.VIEW.OPEN_INSERT_FUNCTION', name: 'Open Insert Function Dialog', handler: () => setIsInsertFunctionOpen(true) },
      { id: 'EXCEL.INSERT.PIVOT_TABLE', name: 'Open Pivot Table Dialog', handler: () => { console.log('PIVOT HANDLER CALLED'); setIsPivotTableOpen(true); } },
      { id: 'EXCEL.INSERT.AUTOSUM', name: 'Smart AutoSum', handler: (_api, payload: any) => {
          if (payload && payload.funcName) {
            const sheet = activeSheetRef.current;
            const sr = selectionRangeRef.current;
            const ac = activeCellRef.current;

            let targetRow: number;
            let targetCol: number;
            let rangeStr = '';

            const hasValue = (r: number, c: number) => {
              const v = sheet.getCell(r, c).value;
              return v !== undefined && v !== null && v !== '' && !isNaN(parseFloat(v as string));
            };

            // Case 1: User has a multi-cell selection → place formula just below/right of selection
            if (sr && (sr.start.row !== sr.end.row || sr.start.col !== sr.end.col)) {
              const minR = Math.min(sr.start.row, sr.end.row);
              const maxR = Math.max(sr.start.row, sr.end.row);
              const minC = Math.min(sr.start.col, sr.end.col);
              const maxC = Math.max(sr.start.col, sr.end.col);

              // Prefer placing below (vertical range)
              if (maxR - minR >= maxC - minC) {
                targetRow = maxR + 1;
                targetCol = minC;
                while (hasValue(targetRow, targetCol)) targetRow++;
                rangeStr = `${getColName(minC)}${minR}:${getColName(maxC)}${maxR}`;
              } else {
                targetRow = minR;
                targetCol = maxC + 1;
                while (hasValue(targetRow, targetCol)) targetCol++;
                rangeStr = `${getColName(minC)}${minR}:${getColName(maxC)}${maxR}`;
              }
            } else {
              // Case 2: Single cell selected
              const row = ac.row;
              const col = ac.col;

              // Check if active cell itself has data → move to next empty cell
              if (hasValue(row, col)) {
                const rowHasNext = hasValue(row, col + 1);
                const colHasNext = hasValue(row + 1, col);

                if (rowHasNext && !colHasNext) {
                  // Scan rightward for end of row data
                  let endCol = col;
                  while (hasValue(row, endCol + 1)) endCol++;
                  targetRow = row;
                  targetCol = endCol + 1;
                  rangeStr = `${getColName(col)}${row}:${getColName(endCol)}${row}`;
                } else {
                  // Scan downward for end of column data
                  let endRow = row;
                  while (hasValue(endRow + 1, col)) endRow++;
                  targetRow = endRow + 1;
                  targetCol = col;
                  rangeStr = `${getColName(col)}${row}:${getColName(col)}${endRow}`;
                }
              } else {
                // Active cell is empty → scan upward for data
                targetRow = row;
                targetCol = col;

                let startRow = row - 1;
                while (startRow > 0 && hasValue(startRow, col)) startRow--;
                startRow++;

                if (startRow < row) {
                  rangeStr = `${getColName(col)}${startRow}:${getColName(col)}${row - 1}`;
                } else {
                  // No data above → try left
                  let startCol = col - 1;
                  while (startCol > 0 && hasValue(row, startCol)) startCol--;
                  startCol++;
                  if (startCol < col) {
                    rangeStr = `${getColName(startCol)}${row}:${getColName(col - 1)}${row}`;
                  }
                }
              }
            }

            const text = `=${payload.funcName}(${rangeStr})`;
            engineRef.current.updateCell(sheet, targetRow, targetCol, text);

            // Move active cell to target
            setActiveCell({ row: targetRow, col: targetCol });
            setSelectionRange({ start: { row: targetRow, col: targetCol }, end: { row: targetRow, col: targetCol } });
            setFormulaBarText(text);
            setDismissTooltip(false);
            saveSnapshot();
            setVersion(v => v + 1);

            setTimeout(() => {
              setIsEditing(true);
              const input = document.getElementById(`cell-input-${targetRow}-${targetCol}`) as HTMLInputElement;
              if (input) {
                input.focus();
                if (rangeStr) {
                  const startIdx = payload.funcName.length + 2;
                  input.setSelectionRange(startIdx, startIdx + rangeStr.length);
                }
              }
            }, 50);
          }
      }},
      { id: 'EXCEL.INSERT.ARITHMETIC', name: 'Insert Arithmetic', handler: (_api, payload: any) => {
          if (payload && payload.operator) {
            const sheet = activeSheetRef.current;
            const ac = activeCellRef.current;
            const op = payload.operator;
            let targetRow = ac.row;
            let targetCol = ac.col;

            const hasValue = (r: number, c: number) => {
              const v = sheet.getCell(r, c).value;
              return v !== undefined && v !== null && v !== '' && !isNaN(parseFloat(v as string));
            };

            const sr = selectionRangeRef.current;
            const cells: string[] = [];

            if (sr && (sr.start.row !== sr.end.row || sr.start.col !== sr.end.col)) {
              const minR = Math.min(sr.start.row, sr.end.row);
              const maxR = Math.max(sr.start.row, sr.end.row);
              const minC = Math.min(sr.start.col, sr.end.col);
              const maxC = Math.max(sr.start.col, sr.end.col);

              // Prefer placing below (vertical range)
              if (maxR - minR >= maxC - minC) {
                targetRow = maxR + 1;
                targetCol = minC;
                while (hasValue(targetRow, targetCol)) targetRow++;
              } else {
                targetRow = minR;
                targetCol = maxC + 1;
                while (hasValue(targetRow, targetCol)) targetCol++;
              }

              for (let r = minR; r <= maxR; r++) {
                for (let c = minC; c <= maxC; c++) {
                  cells.push(`${getColName(c)}${r}`);
                }
              }
            } else {
              // Single cell logic
              if (hasValue(targetRow, targetCol)) {
                const rowHasNext = hasValue(targetRow, targetCol + 1);
                const colHasNext = hasValue(targetRow + 1, targetCol);

                if (rowHasNext && !colHasNext) {
                  while (hasValue(targetRow, targetCol)) targetCol++;
                } else {
                  while (hasValue(targetRow, targetCol)) targetRow++;
                }
              }

              // Look upward from targetRow: find all contiguous numeric cells above
              let r = targetRow - 1;
              while (r >= 1 && hasValue(r, targetCol)) {
                cells.unshift(`${getColName(targetCol)}${r}`);
                r--;
              }

              // If no cells above, look left
              if (cells.length === 0) {
                let c = targetCol - 1;
                while (c >= 1 && hasValue(targetRow, c)) {
                  cells.unshift(`${getColName(c)}${targetRow}`);
                  c--;
                }
              }
            }

            const text = cells.length > 0 ? `=${cells.join(op)}` : `=${op}`;
            engineRef.current.updateCell(sheet, targetRow, targetCol, text);
            setActiveCell({ row: targetRow, col: targetCol });
            setSelectionRange({ start: { row: targetRow, col: targetCol }, end: { row: targetRow, col: targetCol } });
            setFormulaBarText(text);
            setDismissTooltip(false);
            saveSnapshot();
            setVersion(v => v + 1);
            setIsEditing(true);
            setTimeout(() => {
              const input = document.getElementById(`cell-input-${targetRow}-${targetCol}`) as HTMLInputElement;
              if (input) { input.focus(); input.setSelectionRange(text.length, text.length); }
            }, 50);
          }
      }},
      { id: 'EXCEL.INSERT.FORMULA', name: 'Insert Formula', handler: (_api, payload: any) => {
          if (payload && payload.text) {
            engineRef.current.updateCell(activeSheetRef.current, activeCellRef.current.row, activeCellRef.current.col, payload.text); 
            setFormulaBarText(payload.text);
            saveSnapshot();
            setVersion(v => v + 1);
            setTimeout(() => {
              const input = document.getElementById(`cell-input-${activeCellRef.current.row}-${activeCellRef.current.col}`);
              if (input) {
                input.focus();
                if (input instanceof HTMLInputElement) {
                   input.selectionStart = input.selectionEnd = input.value.length;
                }
              }
            }, 0);
          }
      }},
      {
        id: 'EXCEL.FORMAT.APPLY_PRESET', name: 'Apply Preset Format', handler: (_api, payload) => {
          if (payload && payload.format) {
            const sr = selectionRangeRef.current;
            const ac = activeCellRef.current;
            const sheet = activeSheetRef.current;
            const applyTo = (updater: (cell: any) => void) => {
              if (sr) {
                const minR = Math.min(sr.start.row, sr.end.row);
                const maxR = Math.max(sr.start.row, sr.end.row);
                const minC = Math.min(sr.start.col, sr.end.col);
                const maxC = Math.max(sr.start.col, sr.end.col);
                for (let r = minR; r <= maxR; r++)
                  for (let c = minC; c <= maxC; c++)
                    updater(sheet.getCell(r, c));
              } else {
                updater(sheet.getCell(ac.row, ac.col));
              }
            };
            applyTo(cell => {
              if (!cell.format) cell.format = {};
              Object.assign(cell.format, payload.format);
            });
            saveSnapshot();
            setVersion(v => v + 1);
          }
        }
      },
      { id: 'EXCEL.FORMAT.FONT_FAMILY', name: 'Font Family', handler: (_, payload) => applyFormatRef.current('fontFamily', payload) },
      { id: 'EXCEL.FORMAT.FONT_SIZE', name: 'Font Size', handler: (_, payload) => applyFormatRef.current('fontSize', payload) },
      { id: 'EXCEL.FORMAT.BOLD', name: 'Bold', handler: () => toggleFormatRef.current('fontWeight', 'bold') },
      { id: 'EXCEL.FORMAT.ITALIC', name: 'Italic', handler: () => toggleFormatRef.current('fontStyle', 'italic') },
      { id: 'EXCEL.FORMAT.UNDERLINE', name: 'Underline', handler: () => toggleFormatRef.current('textDecoration', 'underline') },
      { id: 'EXCEL.FORMAT.FILL_COLOR', name: 'Fill Color', handler: (_, payload) => applyFormatRef.current('backgroundColor', payload) },
      { id: 'EXCEL.FORMAT.TEXT_COLOR', name: 'Text Color', handler: (_, payload) => applyFormatRef.current('color', payload) },
      { id: 'EXCEL.FORMAT.ALIGN_LEFT', name: 'Align Left', handler: () => applyFormatRef.current('textAlign', 'left') },
      { id: 'EXCEL.FORMAT.ALIGN_CENTER', name: 'Align Center', handler: () => applyFormatRef.current('textAlign', 'center') },
      { id: 'EXCEL.FORMAT.ALIGN_RIGHT', name: 'Align Right', handler: () => applyFormatRef.current('textAlign', 'right') },

      { id: 'EXCEL.CF.HIGHLIGHT', name: 'Highlight Cells Rules', handler: () => setCfDialogState('highlight') },
      { id: 'EXCEL.CF.TOP_BOTTOM', name: 'Top/Bottom Rules', handler: () => setCfDialogState('topBottom') },
      {
        id: 'EXCEL.CF.DATA_BARS', name: 'Data Bars', handler: () => {
          cfEngine.addRule({ id: 'cf_' + Date.now(), type: 'dataBar', priority: 1, appliesTo: 'A1:Z100', dataBar: { percent: 0, color: '#3b82f6' } });
          setVersion(v => v + 1);
        }
      },
      {
        id: 'EXCEL.CF.COLOR_SCALES', name: 'Color Scales', handler: () => {
          cfEngine.addRule({ id: 'cf_' + Date.now(), type: 'colorScale', priority: 1, appliesTo: 'A1:Z100' });
          setVersion(v => v + 1);
        }
      },
      {
        id: 'EXCEL.CF.ICON_SETS', name: 'Icon Sets', handler: () => {
          cfEngine.addRule({ id: 'cf_' + Date.now(), type: 'iconSet', priority: 1, appliesTo: 'A1:Z100' });
          setVersion(v => v + 1);
        }
      },
      { id: 'EXCEL.CF.NEW_RULE', name: 'New Rule', handler: () => setCfDialogState('newRule') },
      {
        id: 'EXCEL.CF.CLEAR_RULES', name: 'Clear Rules', handler: () => {
          cfEngine.clearRules();
          setVersion(v => v + 1);
        }
      },
      { id: 'EXCEL.CF.MANAGE_RULES', name: 'Manage Rules', handler: () => setCfDialogState('manageRules') },

      // ── Insert / Delete ──────────────────────────────────────
      {
        id: 'EXCEL.CELL.INSERT_ROWS_ABOVE', name: 'Insert Rows Above', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const r = sr ? Math.min(sr.start.row, sr.end.row) : ac.row;
          activeSheetRef.current.insertRow(r);
          saveSnapshot(); setVersion(v => v + 1);
        }
      },
      {
        id: 'EXCEL.CELL.INSERT_ROWS_BELOW', name: 'Insert Rows Below', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const r = sr ? Math.max(sr.start.row, sr.end.row) : ac.row;
          activeSheetRef.current.insertRow(r + 1);
          saveSnapshot(); setVersion(v => v + 1);
        }
      },
      {
        id: 'EXCEL.CELL.INSERT_COLS_LEFT', name: 'Insert Cols Left', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const c = sr ? Math.min(sr.start.col, sr.end.col) : ac.col;
          activeSheetRef.current.insertColumn(c);
          saveSnapshot(); setVersion(v => v + 1);
        }
      },
      {
        id: 'EXCEL.CELL.INSERT_COLS_RIGHT', name: 'Insert Cols Right', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const c = sr ? Math.max(sr.start.col, sr.end.col) : ac.col;
          activeSheetRef.current.insertColumn(c + 1);
          saveSnapshot(); setVersion(v => v + 1);
        }
      },
      {
        id: 'EXCEL.CELL.INSERT_CELLS', name: 'Insert Cells', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const r = sr ? Math.min(sr.start.row, sr.end.row) : ac.row;
          activeSheetRef.current.insertRow(r);
          saveSnapshot(); setVersion(v => v + 1);
        }
      },
      {
        id: 'EXCEL.CELL.DELETE_ROWS', name: 'Delete Rows', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const r = sr ? Math.min(sr.start.row, sr.end.row) : ac.row;
          activeSheetRef.current.deleteRow(r);
          saveSnapshot(); setVersion(v => v + 1);
        }
      },
      {
        id: 'EXCEL.CELL.DELETE_COLS', name: 'Delete Cols', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const c = sr ? Math.min(sr.start.col, sr.end.col) : ac.col;
          activeSheetRef.current.deleteColumn(c);
          saveSnapshot(); setVersion(v => v + 1);
        }
      },
      {
        id: 'EXCEL.CELL.DELETE_CELLS', name: 'Delete Cells', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const r = sr ? Math.min(sr.start.row, sr.end.row) : ac.row;
          activeSheetRef.current.deleteRow(r);
          saveSnapshot(); setVersion(v => v + 1);
        }
      },

      // ── Row / Col sizing ─────────────────────────────────────
      {
        id: 'EXCEL.ROW.HEIGHT', name: 'Row Height', handler: () => {
          setPromptDialog({
            title: 'Nhập chiều cao hàng (px):',
            defaultValue: '24',
            onConfirm: (h) => {
              if (h && !isNaN(Number(h))) {
                const sr = selectionRangeRef.current;
                const ac = activeCellRef.current;
                const r = sr ? Math.min(sr.start.row, sr.end.row) : ac.row;
                setRowHeights(prev => ({ ...prev, [r]: Number(h) }));
                setVersion(v => v + 1);
              }
            }
          });
        }
      },
      {
        id: 'EXCEL.ROW.AUTOFIT', name: 'AutoFit Row Height', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const r = sr ? Math.min(sr.start.row, sr.end.row) : ac.row;
          setRowHeights(prev => { const n = { ...prev }; delete n[r]; return n; });
          setVersion(v => v + 1);
        }
      },
      {
        id: 'EXCEL.COL.WIDTH', name: 'Column Width', handler: () => {
          setPromptDialog({
            title: 'Nhập chiều rộng cột (px):',
            defaultValue: '96',
            onConfirm: (w) => {
              if (w && !isNaN(Number(w))) {
                const sr = selectionRangeRef.current;
                const ac = activeCellRef.current;
                const c = sr ? Math.min(sr.start.col, sr.end.col) : ac.col;
                setColWidths(prev => ({ ...prev, [c]: Number(w) }));
                setVersion(v => v + 1);
              }
            }
          });
        }
      },
      {
        id: 'EXCEL.COL.AUTOFIT', name: 'AutoFit Col Width', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const c = sr ? Math.min(sr.start.col, sr.end.col) : ac.col;
          setColWidths(prev => { const n = { ...prev }; delete n[c]; return n; });
          setVersion(v => v + 1);
        }
      },

      // ── Hide / Unhide ────────────────────────────────────────
      {
        id: 'EXCEL.ROW.HIDE', name: 'Hide Row', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const r = sr ? Math.min(sr.start.row, sr.end.row) : ac.row;
          setRowHeights(prev => ({ ...prev, [r]: 0 }));
          setVersion(v => v + 1);
        }
      },
      {
        id: 'EXCEL.ROW.UNHIDE', name: 'Unhide Row', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const r = sr ? Math.min(sr.start.row, sr.end.row) : ac.row;
          setRowHeights(prev => { const n = { ...prev }; delete n[r]; return n; });
          setVersion(v => v + 1);
        }
      },
      {
        id: 'EXCEL.COL.HIDE', name: 'Hide Col', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const c = sr ? Math.min(sr.start.col, sr.end.col) : ac.col;
          setColWidths(prev => ({ ...prev, [c]: 0 }));
          setVersion(v => v + 1);
        }
      },
      {
        id: 'EXCEL.COL.UNHIDE', name: 'Unhide Col', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          const c = sr ? Math.min(sr.start.col, sr.end.col) : ac.col;
          setColWidths(prev => { const n = { ...prev }; delete n[c]; return n; });
          setVersion(v => v + 1);
        }
      },

      // ── Table format (also via ref) ───────────────────────────
      {
        id: 'EXCEL.TABLE.FORMAT_AS_TABLE', name: 'Format as Table', handler: (_api, payload) => {
          if (!payload?.style) return;
          const style = payload.style;
          let minR, maxR, minC, maxC;

          const sheet = activeSheetRef.current;

          if (payload.range) {
            minR = payload.range.start.row;
            maxR = payload.range.end.row;
            minC = payload.range.start.col;
            maxC = payload.range.end.col;
          } else {
            const sr = selectionRangeRef.current;
            const ac = activeCellRef.current;
            if (sr) {
                minR = Math.min(sr.start.row, sr.end.row);
                maxR = Math.max(sr.start.row, sr.end.row);
                minC = Math.min(sr.start.col, sr.end.col);
                maxC = Math.max(sr.start.col, sr.end.col);
            } else {
                minR = maxR = ac.row;
                minC = maxC = ac.col;
            }

            if (minR === maxR && minC === maxC) {
              setFormatAsTableState({ 
                show: true, 
                style
              });
              return; 
            }
          }

          const hasHeaders = payload.hasHeaders !== undefined ? payload.hasHeaders : true;

          if (!hasHeaders) {
             sheet.insertRow(minR);
             maxR++;
             for (let c = minC; c <= maxC; c++) {
                engineRef.current.updateCell(sheet, minR, c, `Cột${c - minC + 1}`);
             }
          } else if (payload.isInsertTable) {
             for (let c = minC; c <= maxC; c++) {
                const cellVal = sheet.getCell(minR, c).value;
                if (cellVal === undefined || cellVal === null || cellVal === '') {
                   engineRef.current.updateCell(sheet, minR, c, `Cột${c - minC + 1}`);
                }
             }
          }

          // Register TableData
          const tableId = Math.random().toString(36).substr(2, 9);
          const tableName = `Table${(sheet.tables?.length || 0) + 1}`;
          if (!sheet.tables) sheet.tables = [];
          sheet.tables.push({
            id: tableId,
            name: tableName,
            range: { start: { row: minR, col: minC }, end: { row: maxR, col: maxC } },
            hasHeaders: true
          });

          for (let r = minR; r <= maxR; r++) {
            for (let c = minC; c <= maxC; c++) {
              const cell = sheet.getCell(r, c);
              if (!cell.format) cell.format = {};
              if (r === minR) {
                cell.format.backgroundColor = style.headerBg;
                cell.format.color = style.headerText;
                cell.format.fontWeight = 'bold';
              } else {
                const isOdd = (r - minR) % 2 === 1;
                cell.format.backgroundColor = isOdd ? style.row1Bg : style.row2Bg;
                cell.format.color = isOdd ? style.oddRowText : style.evenRowText;
                cell.format.borderColor = style.borderColor;
              }
            }
          }
          saveSnapshot();
          setVersion(v => v + 1);
        }
      },
      {
        id: 'EXCEL.DIALOG.INSERT_TABLE', name: 'Open Insert Table Dialog', handler: () => {
          const sr = selectionRangeRef.current;
          const ac = activeCellRef.current;
          let minR, maxR, minC, maxC;
          if (sr) {
              minR = Math.min(sr.start.row, sr.end.row);
              maxR = Math.max(sr.start.row, sr.end.row);
              minC = Math.min(sr.start.col, sr.end.col);
              maxC = Math.max(sr.start.col, sr.end.col);
          } else {
              minR = maxR = ac.row;
              minC = maxC = ac.col;
          }
          
          setInsertTableState({ 
            show: true, 
            style: { id: 'medium2', headerBg: '#4472C4', headerText: '#FFFFFF', row1Bg: '#FFFFFF', row2Bg: '#D9E1F2', oddRowText: '#000000', evenRowText: '#000000', borderColor: '#FFFFFF' },
            range: { start: { row: minR, col: minC }, end: { row: maxR === minR ? minR + 3 : maxR, col: maxC === minC ? minC + 3 : maxC } }
          });
        }
      },
      {
        id: 'EXCEL.INSERT.SHAPE', name: 'Insert Shape', handler: (_api, payload) => {
          if (!payload?.type) return;
          const sheet = activeSheetRef.current;
          
          // Get current viewport center (approximate for MVP)
          const scrollLeft = gridPanelRef.current?.scrollLeft || 0;
          const scrollTop = gridPanelRef.current?.scrollTop || 0;
          const viewportWidth = gridPanelRef.current?.clientWidth || 800;
          const viewportHeight = gridPanelRef.current?.clientHeight || 600;

          // Default dimensions
          let w = 100;
          let h = 100;
          if (payload.type === 'line') h = 10;
          if (payload.type === 'rect' && payload.width) w = payload.width;
          if (payload.type === 'rect' && payload.height) h = payload.height;

          const centerX = scrollLeft + (viewportWidth / 2) - (w / 2);
          const centerY = scrollTop + (viewportHeight / 2) - (h / 2);

          const colors = [
            { fill: '#E3F2FD', stroke: '#1976D2', text: '#0D47A1' }, // Blue
            { fill: '#FCE4EC', stroke: '#C2185B', text: '#880E4F' }, // Pink
            { fill: '#E8F5E9', stroke: '#388E3C', text: '#1B5E20' }, // Green
            { fill: '#FFF3E0', stroke: '#F57C00', text: '#E65100' }, // Orange
            { fill: '#F3E5F5', stroke: '#7B1FA2', text: '#4A148C' }, // Purple
            { fill: '#E0F7FA', stroke: '#0097A7', text: '#006064' }  // Cyan
          ];
          const color = colors[Math.floor(Math.random() * colors.length)];

          const newShape = {
            id: 'shape_' + Date.now() + Math.random().toString(36).substring(2, 9),
            type: payload.type,
            x: Math.max(0, centerX),
            y: Math.max(0, centerY),
            width: w,
            height: h,
            fill: color.fill,
            stroke: color.stroke,
            strokeWidth: 2,
            text: '',
            textColor: color.text
          };

          if (!sheet.shapes) sheet.shapes = [];
          sheet.shapes.push(newShape);
          saveSnapshot();
          setVersion(v => v + 1);
        }
      },

      {
        id: 'EXCEL.INSERT.CHECKBOX', name: 'Insert Checkbox', handler: () => {
          const sheet = activeSheetRef.current;
          const ac = activeCellRef.current;
          // Apply to entire selection range
          const range = selectionRangeRef.current;
          const minR = range ? Math.min(range.start.row, range.end.row) : ac.row;
          const maxR = range ? Math.max(range.start.row, range.end.row) : ac.row;
          const minC = range ? Math.min(range.start.col, range.end.col) : ac.col;
          const maxC = range ? Math.max(range.start.col, range.end.col) : ac.col;
          for (let rr = minR; rr <= maxR; rr++) {
            for (let cc = minC; cc <= maxC; cc++) {
              const cell = sheet.getCell(rr, cc);
              if (!cell.format) cell.format = {};
              (cell.format as any).checkbox = true;
              // If cell is empty or not TRUE/FALSE, default to FALSE
              if (cell.value !== true && cell.value !== false && cell.value !== 'TRUE' && cell.value !== 'FALSE') {
                cell.value = false;
              }
            }
          }
          saveSnapshot();
          setVersion(v => v + 1);
        }
      },

      {
        id: 'EXCEL.INSERT.CHART', name: 'Insert Chart', handler: (_api, payload) => {
          if (!payload?.type) return;
          const sheet = activeSheetRef.current;
          const scrollLeft = gridPanelRef.current?.scrollLeft || 0;
          const scrollTop = gridPanelRef.current?.scrollTop || 0;
          const viewportWidth = gridPanelRef.current?.clientWidth || 800;
          const viewportHeight = gridPanelRef.current?.clientHeight || 600;
          const w = 400, h = 280;
          const cx = scrollLeft + (viewportWidth / 2) - (w / 2);
          const cy = scrollTop + (viewportHeight / 2) - (h / 2);

          const isPie = payload.type === 'pie' || payload.type === 'donut';
          const isRadar = payload.type === 'radar';
          const isWaterfall = payload.type === 'waterfall';

          let series: any[], labels: string[];
          if (isPie) {
            series = [{ name: 'Dữ liệu', values: [35, 25, 20, 15, 5] }];
            labels = ['Nhóm A', 'Nhóm B', 'Nhóm C', 'Nhóm D', 'Nhóm E'];
          } else if (isRadar) {
            series = [
              { name: 'Quý 1', values: [80, 60, 70, 85, 90, 75], color: '#3B82F6' },
              { name: 'Quý 2', values: [65, 80, 55, 70, 60, 88], color: '#EF4444' },
            ];
            labels = ['Doanh số', 'Chi phí', 'Lợi nhuận', 'KH mới', 'Hài lòng', 'Tăng trưởng'];
          } else if (isWaterfall) {
            series = [{ name: 'Thay đổi', values: [120, 45, -20, 30, -15, 80] }];
            labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
          } else {
            series = [
              { name: 'Doanh thu', values: [120, 190, 150, 210, 180, 240], color: '#3B82F6' },
              { name: 'Chi phí',   values: [80,  130, 110, 155, 130, 175], color: '#EF4444' },
              { name: 'Lợi nhuận', values: [40,  60,  40,  55,  50,  65],  color: '#10B981' },
            ];
            labels = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'];
          }

          const typeNames: Record<string, string> = {
            bar: 'Biểu đồ Cột', line: 'Biểu đồ Đường', area: 'Biểu đồ Vùng',
            pie: 'Biểu đồ Tròn', donut: 'Biểu đồ Donut', scatter: 'Biểu đồ Phân tán',
            radar: 'Biểu đồ Radar', waterfall: 'Biểu đồ Thác nước', column: 'Biểu đồ Cột',
            'bar-horizontal': 'Biểu đồ Ngang', combo: 'Biểu đồ Kết hợp',
          };

          const newChart = {
            id: 'chart_' + Date.now() + Math.random().toString(36).substring(2, 8),
            type: payload.type,
            title: typeNames[payload.type] || 'Biểu đồ',
            x: Math.max(0, cx), y: Math.max(0, cy),
            width: w, height: h,
            series, labels,
            showLegend: true, showGrid: true,
          };

          if (!sheet.charts) sheet.charts = [];
          sheet.charts.push(newChart);
          saveSnapshot();
          setVersion(v => v + 1);
        }
      },

      {
        id: 'EXCEL.SHEET.RENAME', name: 'Rename Sheet', handler: () => {
          const sheet = activeSheetRef.current;
          setPromptDialog({
            title: 'Nhập tên trang tính mới:',
            defaultValue: sheet.name,
            onConfirm: (newName) => {
              if (newName && newName.trim() !== '') {
                sheet.name = newName.trim();
                setSheetsVersion(v => v + 1); // trigger tab bar update
              }
            }
          });
        }
      },
      {
        id: 'EXCEL.SHEET.COPY', name: 'Copy Sheet', handler: () => {
          const sheet = activeSheetRef.current;
          const clonedSheet = sheet.clone(sheet.name + ' (Copy)');
          workbook.sheets.push(clonedSheet);
          setSheetsVersion(v => v + 1);
          switchSheet(clonedSheet.id);
        }
      },
      {
        id: 'EXCEL.SHEET.DELETE', name: 'Delete Sheet', handler: (api, payload: any) => {
          const targetId = payload?.sheetId || activeSheetId;
          if (workbook.sheets.length <= 1) {
            setPromptDialog({ title: 'Lỗi', defaultValue: 'Không thể xóa trang tính cuối cùng!', onConfirm: () => { } });
            return;
          }
          setPromptDialog({
            title: 'Xóa trang tính',
            defaultValue: 'Bạn có chắc chắn muốn xóa trang tính này không? Hành động này không thể hoàn tác.',
            isConfirm: true,
            onConfirm: () => {
              const index = workbook.sheets.findIndex(s => s.id === targetId);
              if (index === -1) return;
              workbook.sheets.splice(index, 1);
              setSheetsVersion(v => v + 1);
              if (activeSheetId === targetId) {
                const newIndex = Math.max(0, index - 1);
                switchSheet(workbook.sheets[newIndex].id);
              }
            }
          });
        }
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [undo, redo, mergeCellsAndCenter, mergeCellsAcross, mergeCellsOnly, unmergeCells, toggleFormat, currentFormat, cfEngine]);

  useEffect(() => {
    KeyboardManager.setEditingState(isEditing);
  }, [isEditing]);

  return (
    <div className="flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden font-sans"
         onClick={() => setContextMenuPos(null)}
         onContextMenu={(e) => {
           // Only show context menu if right clicked inside the grid area
           // Actually, Excel shows different menus for ribbon vs grid. For simplicity, 
           // we'll just intercept it if it's not explicitly stopped.
           e.preventDefault();
           setContextMenuPos({ x: e.clientX, y: e.clientY });
         }}>
      {contextMenuPos && (
        <CellContextMenu 
          x={contextMenuPos.x} 
          y={contextMenuPos.y} 
          onClose={() => setContextMenuPos(null)} 
          fontState={fontState}
          currentFormat={currentFormat}
          activeCell={activeCell}
          activeCellValue={activeSheet.getCellsMap().get(`${activeCell.row},${activeCell.col}`)?.value}
        />
      )}
      {/* Title Bar */}
      <div className="h-8 bg-green-600 text-white flex items-center px-2 shadow-sm shrink-0" style={{ WebkitAppRegion: 'drag' } as any}>
        <div className="flex items-center gap-2">
          <IconExcel size={16} />
          <span className="text-xs font-semibold">
            {isModifiedIndicator ? `${workbookName}* - OfficeX Excel` : `${workbookName} - OfficeX Excel`}
          </span>
        </div>
        <div className="ml-4 flex items-center gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-white/20"
            title="Lưu (Ctrl+S)"
            onClick={() => {
              setIsModifiedIndicator(false);
              CommandDispatcher.dispatch('EXCEL.FILE.SAVE');
            }}
          >
            <IconSave size={14} />
          </Button>
        </div>

        <div className="ml-auto flex items-center" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <button className="h-8 w-10 hover:bg-white/20 flex items-center justify-center transition-colors" onClick={minimizeWindow}>—</button>
          <button className="h-8 w-10 hover:bg-white/20 flex items-center justify-center transition-colors" onClick={maximizeWindow}>□</button>
          <button className="h-8 w-10 hover:bg-red-500 flex items-center justify-center transition-colors" onClick={closeWindow}>✕</button>
        </div>
      </div>

      {/* Ribbon */}
      <div className="bg-card border-b border-border shrink-0">
        <Ribbon tabs={ribbonTabs} activeTab={activeTab} onChange={(tab) => {
          if (tab === 'file') {
            setShowFileMenu(true);
            return;
          }
          setActiveTab(tab);
        }} />

        <div className="flex items-start">
          {activeTab === 'home' && <HomeRibbon
            currentFormat={currentFormat}
            toggleFormat={toggleFormat}
            applyFormat={applyFormat}
            fontState={fontState}
            onFontChange={handleFontChange}
            formatPainterActive={!!formatPainter}
            onFormatPainterToggle={() => {
              if (formatPainter) {
                setFormatPainter(null);
              } else {
                setFormatPainter(currentFormat);
              }
            }}
          />}
          {activeTab === 'insert' && <InsertRibbon />}
          {activeTab === 'ai' && <AIRibbon 
            isPanelOpen={isAIPanelOpen} 
            onPanelToggle={() => setIsAIPanelOpen(!isAIPanelOpen)} 
            isTranslateOpen={isTranslateOpen}
            onTranslateToggle={() => setIsTranslateOpen(!isTranslateOpen)} 
            onAskAI={(msg) => {
              setIsAIPanelOpen(true);
              setAiInitialMessage(msg);
              // Clear initial message after a short delay so it can be re-triggered
              setTimeout(() => setAiInitialMessage(undefined), 100);
            }} 
          />}
        </div>
      </div>

      {/* Formula Bar */}
      <div className="h-8 border-b border-border bg-card flex items-center px-2 shrink-0">
        <div className="w-20 border border-border px-2 text-sm h-6 flex items-center bg-background">{getCellRef(activeCell.row, activeCell.col)}</div>
        <div 
          className="w-8 flex justify-center text-slate-700 hover:text-green-700 hover:bg-slate-100 cursor-pointer border-r border-border pr-2 mx-2 italic font-serif transition-colors"
          onClick={() => CommandDispatcher.dispatch('EXCEL.VIEW.OPEN_INSERT_FUNCTION')}
          title="Chèn hàm"
        >
          fx
        </div>
        <input
          type="text"
          value={formulaBarText}
          onChange={handleFormulaBarChange}
          onFocus={() => setIsEditing(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              setIsEditing(false);
              const nextRow = Math.min(rowCount, activeCell.row + 1);
              handleCellClickWithFont(nextRow, activeCell.col);
            }
          }}
          className="flex-1 bg-background border border-border h-6 px-2 text-sm outline-none focus:border-green-500"
        />

        {insertTableState.show && (() => {
          const r = insertTableState.range;
          const minR = Math.min(r.start.row, r.end.row);
          const maxR = Math.max(r.start.row, r.end.row);
          const minC = Math.min(r.start.col, r.end.col);
          const maxC = Math.max(r.start.col, r.end.col);
          const defaultRangeStr = `$${getColName(minC)}$${minR}:$${getColName(maxC)}$${maxR}`;

          const getColIndex = (colName: string) => {
            let index = 0;
            for (let i = 0; i < colName.length; i++) {
              index = index * 26 + colName.charCodeAt(i) - 64;
            }
            return index;
          };

          const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const form = e.currentTarget;
            const hasHeaders = (form.elements.namedItem('hasHeaders') as HTMLInputElement).checked;
            const rangeStr = (form.elements.namedItem('rangeStr') as HTMLInputElement).value;
            
            let finalRange = r;
            const match = rangeStr.match(/\$?([a-zA-Z]+)\$?(\d+):\$?([a-zA-Z]+)\$?(\d+)/i);
            if (match) {
               const c1 = getColIndex(match[1].toUpperCase());
               const r1 = parseInt(match[2]);
               const c2 = getColIndex(match[3].toUpperCase());
               const r2 = parseInt(match[4]);
               finalRange = { start: { row: r1, col: c1 }, end: { row: r2, col: c2 } };
            }

            setInsertTableState({ show: false, style: null, range: null });
            CommandDispatcher.dispatch('EXCEL.TABLE.FORMAT_AS_TABLE', { 
              style: insertTableState.style,
              range: finalRange,
              hasHeaders,
              isInsertTable: true
            });
          };

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
              <div className="bg-white p-5 rounded shadow-[0_4px_24px_rgba(0,0,0,0.15)] w-[360px] font-sans border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[16px] font-semibold text-[#107C41]">Tạo Bảng</h3>
                    <button type="button" onClick={() => setInsertTableState({ show: false, style: null, range: null })} className="text-slate-400 hover:text-slate-600">
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={onSubmit}>
                  <div className="mb-4">
                    <label className="block text-[13px] mb-2 text-slate-800">Dữ liệu cho bảng của bạn nằm trong vùng sau:</label>
                    <input type="text" name="rangeStr" defaultValue={defaultRangeStr} className="w-full border border-slate-300 bg-white rounded px-2 py-1 outline-none text-[13px] text-slate-700 font-mono focus:border-[#107C41]" />
                  </div>
                  <div className="mb-6 flex items-center gap-2">
                    <input type="checkbox" id="hasHeaders" name="hasHeaders" defaultChecked className="w-3.5 h-3.5 cursor-pointer accent-[#107C41]" />
                    <label htmlFor="hasHeaders" className="text-[13px] text-slate-800 cursor-pointer select-none">Bảng của tôi có tiêu đề</label>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <button type="submit" className="px-5 py-1.5 bg-[#107C41] hover:bg-[#0c5c30] text-white rounded text-[13px] min-w-[70px] shadow-sm">OK</button>
                    <button type="button" onClick={() => setInsertTableState({ show: false, style: null, range: null })} className="px-5 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 rounded text-[13px] min-w-[70px] shadow-sm">Hủy bỏ</button>
                  </div>
                </form>
              </div>
            </div>
          );
        })()}

        {formatAsTableState.show && (() => {
          const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const form = e.currentTarget;
            const rows = parseInt((form.elements.namedItem('rows') as HTMLInputElement).value) || 3;
            const cols = parseInt((form.elements.namedItem('cols') as HTMLInputElement).value) || 3;
            const ac = activeCellRef.current;
            setFormatAsTableState({ show: false, style: null });
            CommandDispatcher.dispatch('EXCEL.TABLE.FORMAT_AS_TABLE', { 
              style: formatAsTableState.style,
              range: { start: ac, end: { row: ac.row + rows - 1, col: ac.col + cols - 1 } }
            });
          };

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white p-6 rounded shadow-xl w-[300px]">
                <h3 className="text-lg font-semibold mb-4">Tạo Bảng</h3>
                <form onSubmit={onSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm mb-1 text-slate-700">Số cột (Columns):</label>
                    <input type="number" name="cols" defaultValue={3} min={1} className="w-full border border-slate-300 rounded px-2 py-1 outline-none focus:border-blue-500" />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm mb-1 text-slate-700">Số hàng (Rows):</label>
                    <input type="number" name="rows" defaultValue={4} min={2} className="w-full border border-slate-300 rounded px-2 py-1 outline-none focus:border-blue-500" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button type="button" onClick={() => setFormatAsTableState({ show: false, style: null })} className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 rounded text-sm text-slate-800">Hủy</button>
                    <button type="submit" className="px-4 py-1.5 bg-[#107C41] hover:bg-[#0c5c30] text-white rounded text-sm">Tạo</button>
                  </div>
                </form>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Main Grid Canvas - Two-panel layout for proper sticky row numbers */}
      <div className="flex-1 flex overflow-hidden bg-background">

        {/* LEFT PANEL: Row numbers - never scrolls horizontally */}
        <div className="flex-shrink-0 flex flex-col bg-card border-r border-border" style={{ width: 40 }}>
          {/* Corner cell - aligns with column header row */}
          <div className="border-b border-border bg-card" style={{ height: 28, minHeight: 28 }}></div>
          {/* Row number list - synced vertically with grid panel */}
          <div ref={rowNumPanelRef} className="overflow-hidden flex-1">
            {Array.from({ length: rowCount }).map((_, rIndex) => {
              const r = rIndex + 1;
              const h = rowHeights[r] ?? 24;
              return (
                <div key={r} className="border-b border-border text-center text-xs text-slate-500 hover:bg-slate-100 cursor-pointer relative select-none flex items-center justify-center" style={{ height: h, minHeight: h }}>
                  {r}
                  <div
                    className="absolute bottom-0 left-0 w-full h-1 cursor-row-resize hover:bg-green-500 z-20"
                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setResizingRow({ index: r, startY: e.clientY, startHeight: h }); }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANEL: Column headers (fixed top) + Cell body (scrollable) */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Column header strip - never scrolls vertically, synced horizontally */}
          <div ref={colHeaderRef} className="overflow-hidden flex-shrink-0" style={{ zoom }}>
            <table className="border-collapse text-sm select-none">
              <thead>
                <tr>
                  {Array.from({ length: colCount }).map((_, i) => {
                    const c = i + 1;
                    const width = colWidths[c] || 96;
                    return (
                      <th key={i} className="bg-card border border-border font-normal py-1 z-10 text-center hover:bg-white/5 cursor-pointer relative" style={{ width, minWidth: width, maxWidth: width }}>
                        {getColName(c)}
                        <div
                          className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-green-500 z-20"
                          onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setResizingCol({ index: c, startX: e.clientX, startWidth: width }); }}
                        />
                      </th>
                    );
                  })}
                </tr>
              </thead>
            </table>
          </div>

          {/* Cell body - scrolls freely in both directions */}
          <div
            ref={gridPanelRef}
            className={`flex-1 overflow-auto relative ${drawMode === 'erase' ? 'cursor-cell' : drawMode ? 'cursor-crosshair' : ''}`}
            onScroll={handleGridScroll}
            style={{ zoom }}
          >
            <FloatingShapesLayer 
              shapes={activeSheet.shapes || []} 
              zoom={zoom} 
              onUpdateShape={(id, updates) => {
                const shape = activeSheet.shapes?.find(s => s.id === id);
                if (shape) {
                  Object.assign(shape, updates);
                  saveSnapshot();
                  setVersion(v => v + 1);
                }
              }}
              onDeleteShape={(id) => {
                if (activeSheet.shapes) {
                  activeSheet.shapes = activeSheet.shapes.filter(s => s.id !== id);
                  saveSnapshot();
                  setVersion(v => v + 1);
                }
              }}
            />
            <FloatingChartLayer
              charts={activeSheet.charts || []}
              zoom={zoom}
              onUpdateChart={(id, updates) => {
                const chart = activeSheet.charts?.find(c => c.id === id);
                if (chart) { Object.assign(chart, updates); saveSnapshot(); setVersion(v => v + 1); }
              }}
              onDeleteChart={(id) => {
                if (activeSheet.charts) {
                  activeSheet.charts = activeSheet.charts.filter(c => c.id !== id);
                  saveSnapshot(); setVersion(v => v + 1);
                }
              }}
            />
            <table className="border-collapse text-sm select-none border-b border-r border-border cursor-cell">
              <tbody>
                {(() => {
                  // Precompute CF Context once per render to prevent O(N^2) lag
                  const rangeCache = new Map<string, any[]>();
                  const cfContext: CFContext = {
                    getCellValue: (row, col) => activeSheet.getCell(row, col).value,
                    getRangeValues: (appliesTo) => {
                      if (rangeCache.has(appliesTo)) return rangeCache.get(appliesTo)!;
                      const result = [];
                      for (let rr = 1; rr <= rowCount; rr++) {
                        for (let cc = 1; cc <= colCount; cc++) {
                          const val = activeSheet.getCell(rr, cc).value;
                          if (val !== undefined && val !== '') result.push(val);
                        }
                      }
                      rangeCache.set(appliesTo, result);
                      return result;
                    },
                    evalFormula: (f, row, col) => calcEngine.evaluateFormula(f, row, col)
                  };

                  return Array.from({ length: rowCount }).map((_, rIndex) => {
                    const r = rIndex + 1;
                    if (activeSheet.hiddenRows?.has(r)) return null;
                    return (
                      <tr key={r}>
                        {Array.from({ length: colCount }).map((_, cIndex) => {
                          const c = cIndex + 1;

                          const mergedArea = (activeSheet.mergedCells || []).find(m => r >= m.start.row && r <= m.end.row && c >= m.start.col && c <= m.end.col);

                          if (mergedArea && (mergedArea.start.row !== r || mergedArea.start.col !== c)) {
                            return null;
                          }

                          const rowSpan = mergedArea ? mergedArea.end.row - mergedArea.start.row + 1 : 1;
                          const colSpan = mergedArea ? mergedArea.end.col - mergedArea.start.col + 1 : 1;

                          let cellW = 0;
                          for (let i = c; i < c + colSpan; i++) cellW += colWidths[i] || 96;
                          let cellH = 0;
                          for (let i = r; i < r + rowSpan; i++) cellH += rowHeights[i] ?? 24;

                          const activeTable = activeSheet.tables?.find(t => r >= t.range.start.row && r <= t.range.end.row && c >= t.range.start.col && c <= t.range.end.col);
                          const isTableHeader = activeTable?.hasHeaders && r === activeTable.range.start.row;

                          const isActive = activeCell.row >= (mergedArea?.start.row || r) && activeCell.row <= (mergedArea?.end.row || r) &&
                            activeCell.col >= (mergedArea?.start.col || c) && activeCell.col <= (mergedArea?.end.col || c);

                          const cell = activeSheet.getCell(r, c);
                          const displayVal = cell.value !== undefined && cell.value !== null && cell.value !== '' ? String(cell.value) : '';
                          const isSelected = isCellSelected(r, c) || (mergedArea && isCellSelected(mergedArea.start.row, mergedArea.start.col));

                          let boxShadow = '';
                          if (isSelected) {
                            let minR, maxR, minC, maxC;
                            if (selectionRange) {
                              minR = Math.min(selectionRange.start.row, selectionRange.end.row);
                              maxR = Math.max(selectionRange.start.row, selectionRange.end.row);
                              minC = Math.min(selectionRange.start.col, selectionRange.end.col);
                              maxC = Math.max(selectionRange.start.col, selectionRange.end.col);
                            } else {
                              minR = maxR = activeCell.row;
                              minC = maxC = activeCell.col;
                            }
                            if (r === minR) boxShadow += 'inset 0 2px 0 0 #22c55e, ';
                            if (r + rowSpan - 1 === maxR) boxShadow += 'inset 0 -2px 0 0 #22c55e, ';
                            if (c === minC) boxShadow += 'inset 2px 0 0 0 #22c55e, ';
                            if (c + colSpan - 1 === maxC) boxShadow += 'inset -2px 0 0 0 #22c55e, ';
                          }

                          // Highlight formula ranges
                          if (isActive && formulaRanges.length > 0 && !(r === activeCell.row && c === activeCell.col)) {
                            for (const fr of formulaRanges) {
                              if (r >= fr.minR && r <= fr.maxR && c >= fr.minC && c <= fr.maxC) {
                                if (r === fr.minR) boxShadow += `inset 0 2px 0 0 ${fr.color}, `;
                                if (r === fr.maxR) boxShadow += `inset 0 -2px 0 0 ${fr.color}, `;
                                if (c === fr.minC) boxShadow += `inset 2px 0 0 0 ${fr.color}, `;
                                if (c === fr.maxC) boxShadow += `inset -2px 0 0 0 ${fr.color}, `;
                                // Add a slightly visible background color matching the border
                                cellStyle.backgroundColor = `${fr.color}15`;
                                break;
                              }
                            }
                          }

                          if (boxShadow) boxShadow = boxShadow.slice(0, -2);

                          const cfStyleResult = cfEngine.evaluateCell(r, c, displayVal, cfContext);

                          const cellStyle: any = {
                            fontWeight: cfStyleResult?.bold ? 'bold' : (cell.format?.fontWeight || 'normal'),
                            fontStyle: cfStyleResult?.italic ? 'italic' : (cell.format?.fontStyle || 'normal'),
                            textDecoration: cfStyleResult?.strikethrough ? 'line-through' : (cfStyleResult?.underline ? 'underline' : (cell.format?.textDecoration || 'none')),
                            textAlign: cell.format?.textAlign || 'left',
                            fontFamily: cell.format?.fontFamily || 'Calibri, sans-serif',
                            fontSize: cell.format?.fontSize ? `${cell.format?.fontSize}pt` : '11pt',
                            color: cfStyleResult?.fontColor || cell.format?.color || '#000000',
                            backgroundColor: cfStyleResult?.backgroundColor || (cell.format?.backgroundColor && cell.format.backgroundColor !== 'transparent' ? cell.format.backgroundColor : undefined),
                            whiteSpace: cell.format?.whiteSpace || 'nowrap',
                            wordWrap: cell.format?.whiteSpace === 'normal' ? 'break-word' : 'normal',
                          };

                          if (cfStyleResult?.borders) {
                            const b = cfStyleResult.borders;
                            if (b.top) cellStyle.borderTop = b.top;
                            if (b.bottom) cellStyle.borderBottom = b.bottom;
                            if (b.left) cellStyle.borderLeft = b.left;
                            if (b.right) cellStyle.borderRight = b.right;
                          } else if (cell.format?.borders) {
                            const b = cell.format.borders;
                            if (b.top) cellStyle.borderTop = b.top;
                            if (b.bottom) cellStyle.borderBottom = b.bottom;
                            if (b.left) cellStyle.borderLeft = b.left;
                            if (b.right) cellStyle.borderRight = b.right;
                          }

                          if (clipboardState) {
                            const cbRange = clipboardState.range;
                            const minR = Math.min(cbRange.start.row, cbRange.end.row);
                            const maxR = Math.max(cbRange.start.row, cbRange.end.row);
                            const minC = Math.min(cbRange.start.col, cbRange.end.col);
                            const maxC = Math.max(cbRange.start.col, cbRange.end.col);
                            if (r >= minR && r <= maxR && c >= minC && c <= maxC) {
                              const dash = clipboardState.type === 'cut' ? '2px dashed #ef4444' : '2px dashed #22c55e';
                              if (r === minR) cellStyle.borderTop = dash;
                              if (r + rowSpan - 1 === maxR) cellStyle.borderBottom = dash;
                              if (c === minC) cellStyle.borderLeft = dash;
                              if (c + colSpan - 1 === maxC) cellStyle.borderRight = dash;
                            }
                          }

                          return (
                            <td
                              key={c}
                              rowSpan={rowSpan > 1 ? rowSpan : undefined}
                              colSpan={colSpan > 1 ? colSpan : undefined}
                              onMouseDown={(e) => { handleCellClickWithFont(r, c, true); }}
                              onMouseEnter={() => handleCellMouseEnter(r, c)}
                              onContextMenu={(e) => {
                                if (!isCellSelected(r, c) && !(r === activeCell.row && c === activeCell.col)) {
                                  handleCellClickWithFont(r, c, false);
                                } else {
                                  setIsEditing(false);
                                }
                              }}
                              className={`border-t border-l border-border p-0 m-0 ${isActive ? 'z-30 relative bg-white' : isSelected ? 'bg-blue-500/20' : ''}`}
                              style={{ width: cellW, minWidth: cellW, maxWidth: cellW, height: cellH, boxShadow, ...cellStyle }}
                            >
                              {isActive ? (
                                <div className="relative w-full h-full">
                                  {!isEditing && (
                                    <div className="w-full h-full px-1 py-0.5 overflow-hidden absolute inset-0 flex items-center z-10 pointer-events-none">
                                      {cfStyleResult?.dataBar && (
                                        <div
                                          className="absolute top-1 bottom-1 opacity-75 rounded-sm"
                                          style={{
                                            left: '4px',
                                            width: `calc(${cfStyleResult.dataBar.percent}% - 8px)`,
                                            backgroundColor: cfStyleResult.dataBar.color,
                                            zIndex: 0
                                          }}
                                        />
                                      )}
                                      {cfStyleResult?.iconSet && (
                                        <div className="mr-1 relative z-10 flex-shrink-0">
                                          {cfStyleResult.iconSet.icon === 'ArrowUp' && <ArrowUp size={14} className="text-green-500" />}
                                          {cfStyleResult.iconSet.icon === 'ArrowDown' && <ArrowDown size={14} className="text-red-500" />}
                                          {cfStyleResult.iconSet.icon === 'ArrowRight' && <ArrowRight size={14} className="text-yellow-500" />}
                                          {cfStyleResult.iconSet.icon === 'Circle' && <Circle size={14} className="text-slate-400" />}
                                        </div>
                                      )}
                                      {/* Checkbox render (active cell) */}
                                      {(cell.format as any)?.checkbox ? (
                                        <span
                                          className="relative z-10 flex items-center justify-center w-full"
                                          onMouseDown={(e) => e.stopPropagation()}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const cur = cell.value === true || cell.value === 'TRUE';
                                            cell.value = !cur;
                                            saveSnapshot();
                                            setVersion(v => v + 1);
                                          }}
                                        >
                                          <input
                                            type="checkbox"
                                            readOnly
                                            checked={cell.value === true || cell.value === 'TRUE'}
                                            className="w-4 h-4 cursor-pointer accent-[#107C41] pointer-events-none"
                                          />
                                        </span>
                                      ) : (
                                        <span className="relative z-10 w-full truncate pr-4">{displayVal}</span>
                                      )}
                                    </div>
                                  )}
                                  <input
                                    id={`cell-input-${r}-${c}`}
                                    type="text"
                                    value={isEditing ? formulaBarText : ''}
                                    onChange={(e) => {
                                      if (!isEditing) setIsEditing(true);
                                      handleFormulaBarChange(e);
                                    }}
                                    onDoubleClick={() => setIsEditing(true)}
                                    onMouseDown={(e) => {
                                      if (isEditing) {
                                        e.stopPropagation(); // Allow moving text cursor when editing
                                      }
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleCellNavigation(e.shiftKey ? -1 : 1, 0, false, false);
                                      } else if (e.key === 'Tab') {
                                        e.preventDefault();
                                        handleCellNavigation(0, e.shiftKey ? -1 : 1, false, false);
                                      } else if (e.key === 'F2') {
                                        e.preventDefault();
                                        setIsEditing(true);
                                      } else if (!isEditing && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
                                        setIsEditing(true);
                                      } else if (e.key === 'ArrowUp' && !isEditing) {
                                        e.preventDefault();
                                        handleCellNavigation(-1, 0, e.shiftKey, e.ctrlKey);
                                      } else if (e.key === 'ArrowDown' && !isEditing) {
                                        e.preventDefault();
                                        handleCellNavigation(1, 0, e.shiftKey, e.ctrlKey);
                                      } else if (e.key === 'ArrowLeft' && !isEditing) {
                                        e.preventDefault();
                                        handleCellNavigation(0, -1, e.shiftKey, e.ctrlKey);
                                      } else if (e.key === 'ArrowRight' && !isEditing) {
                                        e.preventDefault();
                                        handleCellNavigation(0, 1, e.shiftKey, e.ctrlKey);
                                      } else if (e.key === 'Escape') {
                                        if (isEditing) {
                                          setIsEditing(false);
                                          e.preventDefault();
                                        } else if (!dismissTooltip && formulaBarText.startsWith('=')) {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setDismissTooltip(true);
                                        }
                                      }
                                    }}
                                    className={`w-full h-full bg-transparent outline-none px-1 py-0.5 ${isEditing ? 'cursor-text' : 'cursor-cell'}`}
                                    style={{
                                      fontFamily: `${cellStyle.fontFamily}, sans-serif`,
                                      fontSize: cellStyle.fontSize,
                                      fontWeight: cellStyle.fontWeight,
                                      fontStyle: cellStyle.fontStyle,
                                      textDecoration: cellStyle.textDecoration,
                                      color: isEditing ? (cellStyle.color || '#000') : 'transparent',
                                      caretColor: isEditing ? '#000' : 'transparent',
                                      textAlign: cellStyle.textAlign as any,
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      height: '100%',
                                      minWidth: '100%',
                                      width: `${Math.max(cellW, formulaBarText.length * 8 + 16)}px`,
                                      zIndex: 40,
                                      backgroundColor: isEditing ? ((cell.format?.backgroundColor && cell.format?.backgroundColor !== 'transparent') ? cell.format.backgroundColor : '#ffffff') : 'transparent',
                                      boxShadow: (formulaBarText.length * 8 + 16 > cellW) ? '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' : 'none'
                                    }}
                                  />
                                  <ValuePreviewTooltip
                                    inputId={`cell-input-${r}-${c}`}
                                    formulaText={formulaBarText}
                                    getCellValue={(ref) => engineRef.current.getCellValue(activeSheet, ref)}
                                  />
                                  {!dismissTooltip && <FormulaTooltip value={formulaBarText} onClose={() => setDismissTooltip(true)} />}
                                  {isTableHeader && displayVal && (
                                    <button 
                                      className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border border-slate-300 rounded shadow-sm flex items-center justify-center hover:bg-slate-100 pointer-events-auto"
                                      style={{ zIndex: 50 }}
                                      onMouseDown={(e) => {
                                        e.preventDefault(); // Prevent blur of input
                                        e.stopPropagation();
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const menuX = Math.max(10, rect.right - 260);
                                        setOpenFilterCol({ row: r, col: c, tableId: activeTable.id, x: menuX, y: rect.bottom + 2 });
                                      }}
                                    >
                                      <ChevronDown size={10} className="text-slate-600" />
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div className="w-full h-full px-1 py-0.5 overflow-hidden relative flex items-center">
                                  {cfStyleResult?.dataBar && (
                                    <div
                                      className="absolute top-1 bottom-1 opacity-75 rounded-sm"
                                      style={{
                                        left: '4px',
                                        width: `calc(${cfStyleResult.dataBar.percent}% - 8px)`,
                                        backgroundColor: cfStyleResult.dataBar.color,
                                        zIndex: 0
                                      }}
                                    />
                                  )}
                                  {cfStyleResult?.iconSet && (
                                    <div className="mr-1 relative z-10 flex-shrink-0">
                                      {cfStyleResult.iconSet.icon === 'ArrowUp' && <ArrowUp size={14} className="text-green-500" />}
                                      {cfStyleResult.iconSet.icon === 'ArrowDown' && <ArrowDown size={14} className="text-red-500" />}
                                      {cfStyleResult.iconSet.icon === 'ArrowRight' && <ArrowRight size={14} className="text-yellow-500" />}
                                      {cfStyleResult.iconSet.icon === 'Circle' && <Circle size={14} className="text-slate-400" />}
                                    </div>
                                  )}
                                  {/* Checkbox render (non-active cell) */}
                                  {(cell.format as any)?.checkbox ? (
                                    <span
                                      className="relative z-10 flex items-center justify-center w-full"
                                      onMouseDown={(e) => e.stopPropagation()}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const cur = cell.value === true || cell.value === 'TRUE';
                                        cell.value = !cur;
                                        saveSnapshot();
                                        setVersion(v => v + 1);
                                      }}
                                    >
                                      <input
                                        type="checkbox"
                                        readOnly
                                        checked={cell.value === true || cell.value === 'TRUE'}
                                        className="w-4 h-4 cursor-pointer accent-[#107C41] pointer-events-none"
                                      />
                                    </span>
                                  ) : (
                                    <span className="relative z-10 w-full truncate pr-4">{displayVal}</span>
                                  )}
                                  {isTableHeader && displayVal && (
                                    <button 
                                      className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 bg-white border border-slate-300 rounded shadow-sm flex items-center justify-center hover:bg-slate-100 z-20 pointer-events-auto"
                                      onMouseDown={(e) => {
                                        e.stopPropagation();
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        setOpenFilterCol({ row: r, col: c, tableId: activeTable.id, x: Math.max(10, rect.right - 260), y: rect.bottom + 2 });
                                      }}
                                    >
                                      <ChevronDown size={10} className="text-slate-600" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>

          <AIPanel 
            isOpen={isAIPanelOpen} 
            onClose={() => setIsAIPanelOpen(false)}
            initialMessage={aiInitialMessage}
            getSheetContext={() => {
              const sheet = activeSheetRef.current;
              if (!sheet || !sheet.cells) return 'Bảng tính trống.';
              
              // Extract a simplified context of the current data range (first 10 rows, first 5 cols max)
              let context = `Tên bảng: ${sheet.name}\n`;
              let dataRows = [];
              for (let r = 0; r < 10; r++) {
                let rowData = [];
                for (let c = 0; c < 5; c++) {
                  const cell = sheet.getCell(r, c);
                  rowData.push(cell.value || cell.formula || '');
                }
                if (rowData.some(v => v !== '')) {
                  dataRows.push(rowData.join(' | '));
                }
              }
              if (dataRows.length > 0) {
                context += 'Dữ liệu mẫu:\n' + dataRows.join('\n');
              } else {
                context += 'Bảng tính hiện chưa có dữ liệu.';
              }
              return context;
            }}
          />
          <AITranslatePane
            isOpen={isTranslateOpen}
            onClose={() => setIsTranslateOpen(false)}
            activeCellRefText={String(activeSheet.getCell(activeCell.row, activeCell.col).value || '')}
            activeCellCoord={activeCell}
            onReplaceCell={handleReplaceCell}
            onInsertAdjacentCol={handleInsertAdjacentCol}
            onTranslateSheet={handleTranslateSheet}
          />
        </div>
      </div>

      {/* Sheet Tabs */}
      <div className="h-8 bg-card border-t border-b border-border flex items-center px-2 text-sm overflow-x-auto shrink-0 gap-1">
        {workbook.sheets.map(sheet => {
          const isActive = sheet.id === activeSheetId;
          return (
            <div
              key={sheet.id}
              onClick={() => switchSheet(sheet.id)}
              className={`group flex items-center gap-1.5 px-4 py-1 cursor-pointer transition-colors ${isActive ? 'bg-background border-b-2 border-green-500 text-green-500 font-semibold' : 'hover:bg-slate-100 text-slate-600'}`}
            >
              <span>{sheet.name}</span>
              <div
                className={`flex items-center justify-center w-4 h-4 rounded-full transition-all ${isActive ? 'text-green-600 hover:bg-green-100' : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 hover:bg-red-50'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  CommandDispatcher.dispatch('EXCEL.SHEET.DELETE', { sheetId: sheet.id });
                }}
              >
                <X size={12} strokeWidth={2.5} />
              </div>
            </div>
          );
        })}
        <div
          onClick={() => {
            const newSheet = workbook.addSheet(`Sheet${workbook.sheets.length + 1}`);
            setActiveSheetId(newSheet.id);
            setSheetsVersion(v => v + 1);
          }}
          className="px-4 py-1 hover:bg-slate-100 cursor-pointer font-bold text-slate-500 transition-colors rounded-sm"
        >
          +
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-6 bg-green-600 text-white flex items-center px-4 text-xs shrink-0">
        <div className="flex items-center gap-4">
          <span>Ready</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <span>{Math.round(zoom * 100)}%</span>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={zoom}
            onChange={e => setZoom(parseFloat(e.target.value))}
            className="w-24 accent-white cursor-pointer"
          />
        </div>
      </div>

      {/* Format Cells Sidebar - Fixed position, not affected by grid scroll */}
      {showFormatSidebar && (
        <div style={{ position: 'fixed', top: 164, right: 0, bottom: 56, zIndex: 100, overflowY: 'auto', width: 320 }}>
          <FormatCellsSidebar
            onClose={() => setShowFormatSidebar(false)}
            format={currentFormat}
            onChange={applyFormat}
            drawMode={drawMode}
            penColor={penColor}
            penStyle={penStyle}
          />
        </div>
      )}

      {showFileMenu && <FileMenu initialSection={fileMenuSection} onClose={() => { setShowFileMenu(false); setActiveTab('home'); setFileMenuSection('new'); }} />}

      {cfDialogState && (
        <CFDialog
          isOpen={!!cfDialogState}
          mode={cfDialogState}
          onClose={() => setCfDialogState(null)}
          onApply={(rule: CFRule) => {
            console.log('Applying CF Rule:', rule);
            // TODO: Wire to ConditionalFormattingEngine instance and re-render grid
          }}
        />
      )}

      {/* Custom Prompt Dialog */}
      {promptDialog && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-md shadow-xl w-80 overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 font-semibold text-sm">
              {promptDialog.title}
            </div>
            <div className="p-4">
              {promptDialog.isConfirm ? (
                <div className="text-sm text-slate-700">{promptDialog.defaultValue}</div>
              ) : (
                <input
                  autoFocus
                  type="text"
                  className="w-full border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-green-500"
                  defaultValue={promptDialog.defaultValue}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      promptDialog.onConfirm(e.currentTarget.value);
                      setPromptDialog(null);
                    } else if (e.key === 'Escape') {
                      setPromptDialog(null);
                    }
                  }}
                />
              )}
            </div>
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setPromptDialog(null)}>Hủy</Button>
              <Button size="sm" onClick={(e) => {
                if (promptDialog.isConfirm) {
                  promptDialog.onConfirm('yes');
                } else {
                  const input = e.currentTarget.parentElement?.previousElementSibling?.querySelector('input');
                  promptDialog.onConfirm(input?.value || '');
                }
                setPromptDialog(null);
              }}>
                {promptDialog.isConfirm ? 'Xóa' : 'OK'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Insert Function Dialog */}
      <InsertFunctionDialog 
        isOpen={isInsertFunctionOpen} 
        onClose={() => setIsInsertFunctionOpen(false)} 
      />

      {/* Pivot Table Dialog */}
      {isPivotTableOpen && (
        <PivotTableDialog onClose={() => setIsPivotTableOpen(false)} />
      )}

      {/* AutoFilter Menu */}
      {openFilterCol && (
        <AutoFilterMenu
          x={openFilterCol.x}
          y={openFilterCol.y}
          columnName={activeSheet.getCell(openFilterCol.row, openFilterCol.col).value?.toString() || `Cột${openFilterCol.col}`}
          uniqueValues={(() => {
            const table = activeSheet.tables?.find(t => t.id === openFilterCol.tableId);
            if (!table) return [];
            const vals = new Set<string>();
            for (let r = table.range.start.row + (table.hasHeaders ? 1 : 0); r <= table.range.end.row; r++) {
              vals.add(activeSheet.getCell(r, openFilterCol.col).value?.toString() || '');
            }
            return Array.from(vals);
          })()}
          onClose={() => setOpenFilterCol(null)}
          onApplySort={(dir) => {
            const table = activeSheet.tables?.find(t => t.id === openFilterCol.tableId);
            if (!table) return;
            const startR = table.range.start.row + (table.hasHeaders ? 1 : 0);
            const endR = table.range.end.row;
            
            // Extract all rows
            const rowsData = [];
            for (let r = startR; r <= endR; r++) {
              const rowData = [];
              for (let c = table.range.start.col; c <= table.range.end.col; c++) {
                rowData.push(activeSheet.getCell(r, c).value);
              }
              rowsData.push(rowData);
            }
            
            // Sort
            const colIndex = openFilterCol.col - table.range.start.col;
            rowsData.sort((a, b) => {
              const va = a[colIndex] || '';
              const vb = b[colIndex] || '';
              if (va < vb) return dir === 'asc' ? -1 : 1;
              if (va > vb) return dir === 'asc' ? 1 : -1;
              return 0;
            });

            // Put back
            for (let i = 0; i < rowsData.length; i++) {
              for (let c = table.range.start.col; c <= table.range.end.col; c++) {
                engineRef.current.updateCell(activeSheet, startR + i, c, String(rowsData[i][c - table.range.start.col] ?? ''));
              }
            }
            saveSnapshot();
            setVersion(v => v + 1);
          }}
          onApplyFilter={(selected) => {
            const table = activeSheet.tables?.find(t => t.id === openFilterCol.tableId);
            if (!table) return;
            const startR = table.range.start.row + (table.hasHeaders ? 1 : 0);
            const endR = table.range.end.row;
            
            if (!activeSheet.hiddenRows) activeSheet.hiddenRows = new Set();
            
            const selectedSet = new Set(selected);
            for (let r = startR; r <= endR; r++) {
              const val = activeSheet.getCell(r, openFilterCol.col).value?.toString() || '';
              if (!selectedSet.has(val)) {
                activeSheet.hiddenRows.add(r);
              } else {
                activeSheet.hiddenRows.delete(r);
              }
            }
            saveSnapshot();
            setVersion(v => v + 1);
          }}
        />
      )}
    </div>
  );
};

const App = () => (
  <ExcelEngineProvider>
    <ExcelApp />
  </ExcelEngineProvider>
);

export default App;
