/**
 * OfficeX Word — Complete Document Engine
 *
 * Pipeline:
 *   Input → DocumentController → DocModel
 *   DocModel → LayoutEngine (canvas measureText) → LayoutResult
 *   LayoutResult → PaginationEngine → PageBox[]
 *   PageBox[] + Caret + Selection → RenderEngine → DOM
 *
 * External:
 *   Registers IEditorAPI on mount → Ribbon calls through EditorAPI singleton
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRibbonState, RibbonController } from './RibbonController';
import { CommandDispatcher } from './CommandDispatcher';
import * as API from './api';
import { EditorAPI, EditorState } from './editorApi';
import { Align } from './api';
import { ClipboardEngine } from './ClipboardEngine';
import { InsertPictureEngine } from './insert/InsertPictureEngine';
import { useViewport } from './viewport/useViewport';
import { ViewportEngine } from './viewport/ViewportEngine';
import { HitTestEngine } from './hittest/HitTestEngine';
import { HorizontalRuler } from './rulers/HorizontalRuler';
import { VerticalRuler } from './rulers/VerticalRuler';
import { PaginationEngine } from './pagination/PaginationEngine';
import { PageBox } from './pagination/PaginationTypes';
import { LayoutEngine } from './layout/LayoutEngine';
import { SectionEngine } from './section/SectionEngine';
import { DEF_FONT, DEF_SIZE } from './layout/Measurer';
import { LayoutResult, LayoutLine, LayoutToken, LayoutPara } from './layout/LayoutTypes';
import { RenderEngine } from './render/RenderEngine';
import { DocModel, DocPara, DocRun, Caret, SelRange, RunFmt, ParaFmt, STYLES } from './document/DocumentTypes';
import { defaultDoc, paraText, paraLen, insertText, splitPara, deleteSelection, applyRunFmt, applyParaFmt, getRunFmtAt, getParaFmtAt, isFmtActive, normalizeSel, delBack, delFwd, createSmartArt, addSmartArtNode, promoteSmartArtNode, demoteSmartArtNode, deleteSmartArt, deleteSmartArtNode } from './document/DocumentEngine';
import { useHistory } from './document/HistoryEngine';
import { MiniToolbar } from './MiniToolbar';
import { DrawingModal } from './insert/DrawingModal';
import { FileEngine } from './file/FileEngine';
import { detectTableFromClipboard, parseHtmlMixedContent, ParsedTableData, MixedContentBlock } from './table/TableParser';

// ╔══════════════════════════════════════════════════════════════╗
// ║  A. DOCUMENT MODEL                                           ║
// ╚══════════════════════════════════════════════════════════════╝

// Extracted to document/DocumentTypes.ts, document/DocumentEngine.ts, and document/HistoryEngine.ts

// Coordinate operations delegated to LayoutEngine

// Hit testing delegated to LayoutEngine

// ╔══════════════════════════════════════════════════════════════╗
// ║  K. REACT COMPONENT (CanvasEditor)                           ║
// ╚══════════════════════════════════════════════════════════════╝

const FONT_SIZES = [8,9,10,11,12,14,16,18,20,22,24,28,32,36,40,48,60,72];
const LIST_BULLETS = ['•', '◦', '▪'];

export function CanvasEditor() {
  const [tick,  setTick]  = useState(0);
  const [doc,   setDoc]   = useState<DocModel>(defaultDoc);
  const [caret, setCaret] = useState<Caret>({ paraIdx: 0, charOffset: 0 });
  const [sel,   setSel]   = useState<SelRange | null>(null);
  const [composing, setComposing] = useState(false);
  const [showFind, setShowFind]   = useState(false);
  const [isEditingHeaderFooter, setIsEditingHeaderFooter] = useState(false);
  const saveHeaderFooter = (updates: Partial<{ headerL: string, headerC: string, headerR: string, footerL: string, footerC: string, footerR: string }>, pageIdx: number) => {
    const newDoc = {
      ...doc,
      sections: doc.sections.map((sec, i) => {
        if (i !== 0) return sec;
        const ph = sec.pageSetup.pageHeaders || {};
        const pf = sec.pageSetup.pageFooters || {};
        return {
          ...sec,
          pageSetup: {
            ...sec.pageSetup,
            pageHeaders: {
              ...ph,
              [pageIdx]: {
                ...ph[pageIdx],
                ...(updates.headerL !== undefined && { L: updates.headerL }),
                ...(updates.headerC !== undefined && { C: updates.headerC }),
                ...(updates.headerR !== undefined && { R: updates.headerR })
              }
            },
            pageFooters: {
              ...pf,
              [pageIdx]: {
                ...pf[pageIdx],
                ...(updates.footerL !== undefined && { L: updates.footerL }),
                ...(updates.footerC !== undefined && { C: updates.footerC }),
                ...(updates.footerR !== undefined && { R: updates.footerR })
              }
            }
          }
        };
      })
    };
    commit(newDoc, caret, sel);
  };
  const [findText, setFindText]   = useState('');
  const [replaceText, setReplaceText] = useState('');
  const compBuf = useRef('');
  const dragging = useRef(false);
  const mouseAnchor = useRef<Caret | null>(null);

  const inputRef  = useRef<HTMLTextAreaElement>(null);
        const [formatPainterState, setFormatPainterState] = useState<{runFmt: RunFmt, paraFmt: ParaFmt} | null>(null);
  const [clipboardPanelOpen, setClipboardPanelOpen] = useState(false);
  const [livePreviewFmt, setLivePreviewFmt] = useState<Partial<RunFmt> | null>(null);
  const [livePreviewParaFmt, setLivePreviewParaFmt] = useState<Partial<ParaFmt> | null>(null);
  const [formatMarks, setFormatMarks] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{paraIdx: number; runIdx: number} | null>(null);
  const [selectedSmartArtId, setSelectedSmartArtId] = useState<string | undefined>(undefined);
  const [selectedSmartArtNodeId, setSelectedSmartArtNodeId] = useState<string | undefined>(undefined);
  const [editingSmartArtNode, setEditingSmartArtNode] = useState<{ saId: string, nodeId: string, x: number, y: number, w: number, h: number } | null>(null);
  const [showMiniToolbar, setShowMiniToolbar] = useState(false);
  const [showDrawingModal, setShowDrawingModal] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const hist = useHistory(doc);

  useEffect(() => {
    const handleBeforePrint = () => setIsPrinting(true);
    const handleAfterPrint = () => setIsPrinting(false);
    window.addEventListener('beforeprint', handleBeforePrint);
    window.addEventListener('afterprint', handleAfterPrint);
    document.addEventListener('officex:preparing-print', handleBeforePrint);
    document.addEventListener('officex:finish-print', handleAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', handleBeforePrint);
      window.removeEventListener('afterprint', handleAfterPrint);
      document.removeEventListener('officex:preparing-print', handleBeforePrint);
      document.removeEventListener('officex:finish-print', handleAfterPrint);
    };
  }, []);

  // ── Layout & Pagination ──────────────────────────────────────────
  // Safe doc ensuring doc.paras is never empty or corrupt
  const safeDoc = useMemo(() => {
    if (!doc || !Array.isArray(doc.paras) || doc.paras.length === 0) {
      return defaultDoc();
    }
    if (doc.paras[0]?.fmt?.pageBreak) {
      const cleanParas = doc.paras.map((p, idx) => idx === 0 ? { ...p, fmt: { ...p.fmt, pageBreak: undefined } } : p);
      return { ...doc, paras: cleanParas };
    }
    return doc;
  }, [doc]);

  const safeCaret = useMemo(() => {
    const numParas = safeDoc.paras.length;
    const pIdx = Math.max(0, Math.min(numParas - 1, caret?.paraIdx ?? 0));
    const pLen = paraLen(safeDoc.paras[pIdx]);
    const cOff = Math.max(0, Math.min(pLen, caret?.charOffset ?? 0));
    return { paraIdx: pIdx, charOffset: cOff };
  }, [safeDoc, caret]);

  const projectedDoc = useMemo(() => {
    if (!livePreviewFmt && !livePreviewParaFmt) return safeDoc;
    let newDoc = safeDoc;
    if (livePreviewFmt && sel) {
      for (const key of Object.keys(livePreviewFmt)) {
        newDoc = applyRunFmt(newDoc, sel, safeCaret, { [key]: (livePreviewFmt as any)[key] });
      }
    }
    if (livePreviewParaFmt && sel) {
      newDoc = applyParaFmt(newDoc, sel, safeCaret, livePreviewParaFmt);
    }
    return newDoc;
  }, [safeDoc, sel, safeCaret, livePreviewFmt, livePreviewParaFmt]);

  const layout = useMemo(() => LayoutEngine.get().calculate(projectedDoc),   [projectedDoc]);
  const pages  = useMemo(() => PaginationEngine.get().paginate(projectedDoc, layout), [projectedDoc, layout]);
  
  const defaultPageSetup = pages[0]?.section?.pageSetup || { width: 816, height: 1056, marginTop: 96, marginBottom: 96, marginLeft: 96, marginRight: 96 };
  const { width: PW, height: PH, marginTop, marginBottom, marginLeft, marginRight } = defaultPageSetup;

  const sc     = useMemo(() => HitTestEngine.get().getScreenCaret(safeCaret, layout, defaultPageSetup, pages), [safeCaret, layout, defaultPageSetup, pages]);
  const { zoom, setZoom, vis, scrollRef, hRulerRef, vRulerRef, onScroll, PAGE_GAP } = useViewport(pages, sc);

  // ── Word count ────────────────────────────────────────────────────
  const wordCount = useMemo(() =>
    safeDoc.paras.map(paraText).join(' ').trim().split(/\s+/).filter(Boolean).length, [safeDoc]);

  // ── Notify EditorAPI of state changes ─────────────────────────────
  const rs = { isInTable: !!(safeDoc.paras[safeCaret.paraIdx]?.fmt?.tableId) };

  useEffect(() => {
    const unsubOpen = CommandDispatcher.subscribe('WORD.INSERT.HEADER.DIALOG', () => setIsEditingHeaderFooter(true));
    const unsubClose = CommandDispatcher.subscribe('WORD.HEADER_FOOTER.CLOSE', () => setIsEditingHeaderFooter(false));
    return () => { unsubOpen(); unsubClose(); };
  }, []);

  useEffect(() => {
    const rf = getRunFmtAt(safeDoc, safeCaret);
    const pf = getParaFmtAt(safeDoc, safeCaret);
    const state: EditorState = {
      bold:       isFmtActive(safeDoc, sel, safeCaret, 'bold'),
      italic:     isFmtActive(safeDoc, sel, safeCaret, 'italic'),
      underline:  isFmtActive(safeDoc, sel, safeCaret, 'underline'),
      strike:     isFmtActive(safeDoc, sel, safeCaret, 'strike'),
      doubleUnderline: isFmtActive(safeDoc, sel, safeCaret, 'doubleUnderline'),
      doubleStrike:    isFmtActive(safeDoc, sel, safeCaret, 'doubleStrike'),
      superscript: isFmtActive(safeDoc, sel, safeCaret, 'superscript'),
      subscript:  isFmtActive(safeDoc, sel, safeCaret, 'subscript'),
      smallCaps:  isFmtActive(safeDoc, sel, safeCaret, 'smallCaps'),
      allCaps:    isFmtActive(safeDoc, sel, safeCaret, 'allCaps'),
      hiddenText: isFmtActive(safeDoc, sel, safeCaret, 'hiddenText'),
      fontFamily: rf.fontFamily ?? DEF_FONT,
      fontSize:   rf.fontSize   ?? DEF_SIZE,
      color:      rf.color ?? '#000000',
      highlightColor: rf.highlight ?? 'transparent',
      letterSpacing: rf.letterSpacing ?? 0,
      fontScale:  rf.fontScale ?? 100,
      align:      pf.align ?? 'left',
      bullets:    pf.listType === 'bullet',
      numbering:  pf.listType === 'number',
      canUndo:    hist.canUndo(),
      canRedo:    hist.canRedo(),
      pageCount:  pages.length,
      currentPage: (sc?.pageIdx ?? 0) + 1,
      wordCount,
      formatPainterActive: formatPainterState !== null,
      clipboardPanelOpen,
      zoom: zoom * 100,
      isInTable: rs.isInTable,
      selectedSmartArtId,
      selectedSmartArtNodeId,
      currentParaFmt: pf,
      currentRunFmt: rf
    };
    EditorAPI.notify(state);
  }, [doc, caret, sel, pages, sc, wordCount, formatPainterState, clipboardPanelOpen, zoom, selectedSmartArtId, selectedSmartArtNodeId, rs.isInTable]);

  // ── Commit to history before mutation ─────────────────────────────
  const commit = useCallback((newDoc: DocModel, newCaret: Caret, newSel: SelRange | null = null) => {
    hist.push({ doc: newDoc, caret: newCaret, sel: newSel });
    setDoc(newDoc); setCaret(newCaret); setSel(newSel);
    try { FileEngine.markModified(); } catch {}
  }, [hist]);

  // ── Input focus ───────────────────────────────────────────────────
  const focus = useCallback(() => {
    setShowMiniToolbar(false);
    if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus({ preventScroll: true });
    }
  }, []);

  // Trigger mini toolbar after selection
  useEffect(() => {
    const unsubDrawing = CommandDispatcher.subscribe('WORD.INSERT.DRAWING', () => setShowDrawingModal(true));

    const handleMouseUp = () => {
      const hasSel = sel && (sel.anchor.paraIdx !== sel.focus.paraIdx || sel.anchor.charOffset !== sel.focus.charOffset);
      if (hasSel || rs.isInTable) {
        setShowMiniToolbar(true);
      }
    };
    window.addEventListener('mouseup', handleMouseUp);
    return () => { 
      window.removeEventListener('mouseup', handleMouseUp);
      unsubDrawing();
    };
  }, [doc, caret, sel, composing, projectedDoc]);

  // ── Toggle run format (bold/italic etc.) ─────────────────────────
  const toggleRunFmt = useCallback((prop: keyof RunFmt, value: unknown = true) => {
    const isActive = isFmtActive(doc, sel, caret, prop);
    const newDoc = applyRunFmt(doc, sel, caret, { [prop]: isActive ? undefined : value });
    commit(newDoc, caret, sel);
  }, [doc, sel, caret, commit]);

  // ── Mouse events for selection ────────────────────────────────────
  const onPageMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, pIdx: number) => {
    if (e.button !== 0) return;
    // Deselect any selected image or smartart when clicking the page canvas
    setSelectedImage(null);
    setSelectedSmartArtId(undefined);
    setSelectedSmartArtNodeId(undefined);
    setEditingSmartArtNode(null);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const newCaret = ViewportEngine.get().hitTest(e.clientX, e.clientY, rect, pIdx, pages, zoom);
    
    // Triple Click: Select Paragraph
    if (e.detail === 3) {
      const pLen = paraLen(doc.paras[newCaret.paraIdx]);
      setSel({
        anchor: { paraIdx: newCaret.paraIdx, charOffset: 0 },
        focus:  { paraIdx: newCaret.paraIdx, charOffset: pLen }
      });
      setCaret({ paraIdx: newCaret.paraIdx, charOffset: pLen });
      e.preventDefault();
      return;
    }

    // Double Click: Select Word
    if (e.detail === 2) {
      const text = paraText(doc.paras[newCaret.paraIdx]);
      let start = newCaret.charOffset;
      let end = newCaret.charOffset;
      // expand left
      while (start > 0 && !/\s/.test(text[start - 1])) start--;
      // expand right
      while (end < text.length && !/\s/.test(text[end])) end++;
      
      setSel({
        anchor: { paraIdx: newCaret.paraIdx, charOffset: start },
        focus:  { paraIdx: newCaret.paraIdx, charOffset: end }
      });
      setCaret({ paraIdx: newCaret.paraIdx, charOffset: end });
      e.preventDefault();
      return;
    }

    if (e.shiftKey && (caret.paraIdx !== newCaret.paraIdx || caret.charOffset !== newCaret.charOffset)) {
      setSel({ anchor: caret, focus: newCaret });
    } else {
      setCaret(newCaret); setSel(null);
    }
    mouseAnchor.current = newCaret;
    dragging.current = true;
    focus();
    e.preventDefault();
  }, [zoom, pages, layout, caret, focus, doc]);

  const onPageMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>, pIdx: number) => {
    if (!dragging.current || !mouseAnchor.current) return;
    if (e.buttons === 0) {
      dragging.current = false;
      return;
    }
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const focus_ = ViewportEngine.get().hitTest(e.clientX, e.clientY, rect, pIdx, pages, zoom);
    setCaret(focus_);
    setSel({ anchor: mouseAnchor.current, focus: focus_ });
  }, [zoom, pages]);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
    
    // Format Painter apply logic
    if (formatPainterState) {
      if (sel && !(sel.anchor.paraIdx === sel.focus.paraIdx && sel.anchor.charOffset === sel.focus.charOffset)) {
        // Apply formats to selection
        const nd1 = applyRunFmt(doc, sel, caret, formatPainterState.runFmt);
        const nd2 = applyParaFmt(nd1, sel, caret, formatPainterState.paraFmt);
        commit(nd2, caret, sel);
      }
      setFormatPainterState(null); // Clear format painter after one use
    }
  }, [formatPainterState, sel, doc, caret, commit]);

  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp);
    return () => window.removeEventListener('mouseup', onMouseUp);
  }, [onMouseUp]);

  // ── Insert Table / Mixed Content helpers (must be before onKeyDown) ──
  const buildTableParas = (tableData: ParsedTableData): DocPara[] => {
    const { title, rows } = tableData;
    if (!rows || rows.length === 0) return [];

    const rowCount = rows.length;
    const colCount = Math.max(...rows.map(r => r.length));
    if (colCount === 0) return [];

    const tableId = crypto.randomUUID();
    const totalW = 476;
    const colW = totalW / colCount;
    const colWidths = new Array(colCount).fill(colW);

    const tableParas: DocPara[] = [];

    for (let r = 0; r < rowCount; r++) {
      const rowId = crypto.randomUUID();
      const isHeader = r === 0;

      for (let c = 0; c < colCount; c++) {
        const cellId = crypto.randomUUID();
        const cellData = rows[r]?.[c];
        const cellText = cellData?.text ?? '';
        const isBold = cellData?.bold ?? isHeader;

        tableParas.push({
          id: crypto.randomUUID(),
          runs: [{
            id: crypto.randomUUID(),
            text: cellText,
            fmt: isBold ? { bold: true } : {},
          }],
          fmt: {
            tableId,
            tableRowId: rowId,
            tableCellId: cellId,
            tableRowIdx: r,
            tableColIdx: c,
            tableColSpan: 1,
            tableRowSpan: 1,
            tableColWidths: colWidths,
            tableStyleId: 'Style7',
            tableHeaderRow: isHeader,
            tableBandedRows: true,
            tableFirstColumn: false,
            tableCellPadding: 6,
            tableBg: isHeader ? '#f1f5f9' : (r % 2 === 1 ? '#ffffff' : '#f8fafc'),
            shading: isHeader ? '#f1f5f9' : (r % 2 === 1 ? '#ffffff' : '#f8fafc'),
            spaceAfter: 0,
            spaceBefore: 0,
            align: 'left',
            borders: {
              top: { width: 1, style: 'solid' as any, color: '#cbd5e1' },
              bottom: { width: 1, style: 'solid' as any, color: '#cbd5e1' },
              left: { width: 1, style: 'solid' as any, color: '#cbd5e1' },
              right: { width: 1, style: 'solid' as any, color: '#cbd5e1' },
            },
          },
        });
      }
    }

    const result: DocPara[] = [];
    if (title && title.trim()) {
      result.push({
        id: crypto.randomUUID(),
        runs: [{ id: crypto.randomUUID(), text: title.trim(), fmt: { bold: true, fontSize: 13 } }],
        fmt: { spaceAfter: 6, spaceBefore: 6, align: 'left' },
      });
    }
    result.push(...tableParas);
    return result;
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const doInsertTableWithData = useCallback((tableData: ParsedTableData) => {
    const caretPos = caret || { paraIdx: 0, charOffset: 0 };
    const insertedParas = buildTableParas(tableData);
    if (insertedParas.length === 0) return;

    const trailingPara: DocPara = {
      id: crypto.randomUUID(),
      runs: [{ id: crypto.randomUUID(), text: tableData.trailingText || '', fmt: {} }],
      fmt: { spaceAfter: 0, spaceBefore: 6, align: 'left' },
    };

    const currentPara = doc.paras[caretPos.paraIdx];
    const isCurrentEmpty = currentPara && !currentPara.fmt?.tableId && (currentPara.runs.length === 0 || (currentPara.runs.length === 1 && currentPara.runs[0].text === ''));

    let newParas: DocPara[];
    let newCaretParaIdx: number;

    if (isCurrentEmpty) {
      newParas = [
        ...doc.paras.slice(0, caretPos.paraIdx),
        ...insertedParas,
        trailingPara,
        ...doc.paras.slice(caretPos.paraIdx + 1),
      ];
      newCaretParaIdx = caretPos.paraIdx + insertedParas.length;
    } else {
      newParas = [
        ...doc.paras.slice(0, caretPos.paraIdx + 1),
        ...insertedParas,
        trailingPara,
        ...doc.paras.slice(caretPos.paraIdx + 1),
      ];
      newCaretParaIdx = caretPos.paraIdx + 1 + insertedParas.length;
    }

    const newDoc = { ...doc, paras: newParas };
    commit(newDoc, { paraIdx: newCaretParaIdx, charOffset: 0 }, null);
  }, [doc, caret, commit]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const doInsertMixedContent = useCallback((blocks: MixedContentBlock[]) => {
    const caretPos = caret || { paraIdx: 0, charOffset: 0 };
    const allInserted: DocPara[] = [];

    for (const block of blocks) {
      if (block.type === 'text') {
        const lines = block.text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        for (const line of lines) {
          allInserted.push({
            id: crypto.randomUUID(),
            runs: [{ id: crypto.randomUUID(), text: line, fmt: {} }],
            fmt: { spaceAfter: 4, spaceBefore: 0, align: 'left' },
          });
        }
      } else {
        const tableParas = buildTableParas(block.tableData);
        allInserted.push(...tableParas);
        allInserted.push({
          id: crypto.randomUUID(),
          runs: [{ id: crypto.randomUUID(), text: '', fmt: {} }],
          fmt: { spaceAfter: 0, spaceBefore: 6, align: 'left' },
        });
      }
    }

    if (allInserted.length === 0) return;

    const currentPara = doc.paras[caretPos.paraIdx];
    const isCurrentEmpty = currentPara && !currentPara.fmt?.tableId && (currentPara.runs.length === 0 || (currentPara.runs.length === 1 && currentPara.runs[0].text === ''));

    let newParas: DocPara[];
    let newCaretParaIdx: number;

    if (isCurrentEmpty) {
      newParas = [
        ...doc.paras.slice(0, caretPos.paraIdx),
        ...allInserted,
        ...doc.paras.slice(caretPos.paraIdx + 1),
      ];
      newCaretParaIdx = caretPos.paraIdx + allInserted.length - 1;
    } else {
      newParas = [
        ...doc.paras.slice(0, caretPos.paraIdx + 1),
        ...allInserted,
        ...doc.paras.slice(caretPos.paraIdx + 1),
      ];
      newCaretParaIdx = caretPos.paraIdx + allInserted.length;
    }

    const newDoc = { ...doc, paras: newParas };
    commit(newDoc, { paraIdx: newCaretParaIdx, charOffset: 0 }, null);
  }, [doc, caret, commit]);

  // ── Keyboard ──────────────────────────────────────────────────────
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    setShowMiniToolbar(false);
    if (composing && e.key !== 'Enter') return;
    const { key, ctrlKey, shiftKey, altKey } = e;

    // Handle delete of selection first
    const hasSel = sel && !(sel.anchor.paraIdx === sel.focus.paraIdx && sel.anchor.charOffset === sel.focus.charOffset);
    const delSel = () => {
      if (!hasSel) return null;
      const r = deleteSelection(doc, sel!);
      commit(r.doc, r.caret, null);
      return r;
    };

    // Ctrl shortcuts
    if (ctrlKey && !altKey) {
      switch (key.toLowerCase()) {
        case 's': e.preventDefault(); FileEngine.save();         return;
        case 'b': e.preventDefault(); toggleRunFmt('bold');      return;
        case 'i': e.preventDefault(); toggleRunFmt('italic');    return;
        case 'u': e.preventDefault(); toggleRunFmt('underline'); return;
        case 'z': e.preventDefault(); if (!shiftKey) { const f = hist.undo(); if (f) { setDoc(f.doc); setCaret(f.caret); setSel(f.sel); } } return;
        case 'y': e.preventDefault(); const f2 = hist.redo(); if (f2) { setDoc(f2.doc); setCaret(f2.caret); setSel(f2.sel); } return;
        case 'a': e.preventDefault(); {
          const last = doc.paras[doc.paras.length - 1];
          setSel({ anchor: { paraIdx: 0, charOffset: 0 }, focus: { paraIdx: doc.paras.length - 1, charOffset: paraLen(last) } });
          return;
        }
        case 'c': e.preventDefault(); (async () => {
          if (!hasSel) return;
          const ns = normalizeSel(sel!);
          let text = '';
          for (let pi = ns.startPara; pi <= ns.endPara; pi++) {
            const from = pi === ns.startPara ? ns.startChar : 0;
            const to   = pi === ns.endPara   ? ns.endChar   : paraLen(doc.paras[pi]);
            text += paraText(doc.paras[pi]).slice(from, to);
            if (pi < ns.endPara) text += '\n';
          }
          await navigator.clipboard.writeText(text);
        })(); return;
        case 'x': e.preventDefault(); (async () => {
          if (!hasSel) return;
          const ns = normalizeSel(sel!);
          let text = '';
          for (let pi = ns.startPara; pi <= ns.endPara; pi++) {
            const from = pi === ns.startPara ? ns.startChar : 0;
            const to   = pi === ns.endPara   ? ns.endChar   : paraLen(doc.paras[pi]);
            text += paraText(doc.paras[pi]).slice(from, to);
            if (pi < ns.endPara) text += '\n';
          }
          await navigator.clipboard.writeText(text);
          delSel();
        })(); return;
        case 'v': e.preventDefault(); (async () => {
          let cur = hasSel ? (() => { const r = deleteSelection(doc, sel!); return { doc: r.doc, caret: r.caret }; })() : { doc, caret };

          // ── Helper: fetch any URL → data URL ──────────────────────────────
          const toDataUrl = async (src: string): Promise<string | null> => {
            try {
              if (src.startsWith('data:')) return src;
              const resp = await fetch(src);
              if (!resp.ok) return null;
              const blob = await resp.blob();
              return await new Promise(res => { const rd = new FileReader(); rd.onload = () => res(rd.result as string); rd.readAsDataURL(blob); });
            } catch { return null; }
          };

          // ── Helper: get image dimensions from data URL ────────────────────
          const imgDims = (dataUrl: string): Promise<{w: number, h: number}> =>
            new Promise(res => {
              const i = new Image();
              i.onload = () => { const maxW = 600; let w = i.width || 400, h = i.height || 300; if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; } res({w, h}); };
              i.onerror = () => res({w: 400, h: 300});
              i.src = dataUrl;
            });

          // ── Helper: splice an image run into doc at caret position ────────
          const spliceImgRun = (d: any, c: any, dataUrl: string, w: number, h: number) => {
            const imgRun = { id: `run_${Date.now()}_${Math.random().toString(36).slice(2)}_img`, text: '\uFFFC', fmt: { inlineImage: dataUrl, imageWidth: w, imageHeight: h } };
            const newParas = d.paras.map((p: any, pi: number) => {
              if (pi !== c.paraIdx) return p;
              const runs = [...p.runs];
              let offset = 0, splitIdx = runs.length - 1, splitChar = 0;
              for (let i = 0; i < runs.length; i++) {
                if (offset + runs[i].text.length >= c.charOffset) { splitIdx = i; splitChar = c.charOffset - offset; break; }
                offset += runs[i].text.length;
              }
              const tr = runs[splitIdx];
              const before = tr.text.slice(0, splitChar);
              const after  = tr.text.slice(splitChar);
              const newRuns = [];
              if (before) newRuns.push({ ...tr, id: tr.id + '_b', text: before });
              newRuns.push(imgRun);
              newRuns.push({ ...tr, id: tr.id + '_a', text: after });
              runs.splice(splitIdx, 1, ...newRuns);
              return { ...p, runs };
            });
            return { doc: { ...d, paras: newParas }, caret: { paraIdx: c.paraIdx, charOffset: c.charOffset + 1 } };
          };

          try {
            const electronAPI = (window as any).electronAPI;
            const cb = electronAPI?.readClipboardAll ? await electronAPI.readClipboardAll() : null;

            let html = cb?.html || '';
            let text = cb?.text || '';

            if (!html && !text && navigator.clipboard) {
              try {
                if (navigator.clipboard.read) {
                  const items = await navigator.clipboard.read();
                  for (const item of items) {
                    if (item.types.includes('text/html')) {
                      const b = await item.getType('text/html');
                      html = await b.text();
                    }
                    if (item.types.includes('text/plain')) {
                      const b = await item.getType('text/plain');
                      text = await b.text();
                    }
                  }
                }
              } catch {}
              if (!text && navigator.clipboard.readText) {
                text = await navigator.clipboard.readText().catch(() => '');
              }
            }

            // 1. Check for Mixed HTML content (multiple tables + text) first!
            if (html) {
              const mixed = parseHtmlMixedContent(html);
              if (mixed) {
                doInsertMixedContent(mixed);
                return;
              }
            }

            // 2. Check for single table (TSV or fallback HTML)
            const tableData = detectTableFromClipboard(html, text);
            if (tableData) {
              doInsertTableWithData(tableData);
              return;
            }

            if (html && html.trim()) {
              // ── Parse HTML to segments ──────────────────────────────────────
              type Seg = { type: 'text'; text: string } | { type: 'img'; src: string };
              const segments: Seg[] = [];
              const htmlDoc2 = new DOMParser().parseFromString(html, 'text/html');

              const walk = (node: Node) => {
                if (node.nodeType === Node.TEXT_NODE) {
                  const t = (node.textContent || '').replace(/\s+/g, ' ').trim();
                  if (t) { const last = segments[segments.length - 1]; if (last?.type === 'text') last.text += ' ' + t; else segments.push({ type: 'text', text: t }); }
                } else if ((node as Element).tagName === 'IMG') {
                  const src = (node as HTMLImageElement).src || (node as HTMLImageElement).getAttribute('src') || '';
                  if (src && !src.startsWith('data:text')) segments.push({ type: 'img', src });
                } else if (['P','DIV','LI','H1','H2','H3','H4','H5','H6'].includes((node as Element).tagName)) {
                  const last = segments[segments.length - 1];
                  if (last?.type === 'text') last.text = last.text.trimEnd() + '\n';
                  node.childNodes.forEach(walk);
                } else if ((node as Element).tagName === 'BR') {
                  const last = segments[segments.length - 1];
                  if (last?.type === 'text') last.text += '\n';
                } else {
                  node.childNodes.forEach(walk);
                }
              };
              htmlDoc2.body.childNodes.forEach(walk);

              const hasImages = segments.some(s => s.type === 'img');

              if (hasImages) {
                // ── PRE-FETCH all images first ──────────────────────────────
                const dataUrlMap = new Map<string, string | null>();
                await Promise.all(segments.filter(s => s.type === 'img').map(async s => {
                  if (s.type === 'img') dataUrlMap.set(s.src, await toDataUrl(s.src));
                }));

                // ── Build full doc model in ONE synchronous pass ────────────
                let first = true;
                for (const seg of segments) {
                  if (seg.type === 'text') {
                    const lines = seg.text.split('\n');
                    for (let li = 0; li < lines.length; li++) {
                      const line = lines[li].trim();
                      if (li > 0 || !first) {
                        const sp = splitPara(cur.doc, cur.caret); cur = { doc: sp.doc, caret: sp.caret };
                      }
                      if (line) { const ins = insertText(cur.doc, cur.caret, line); cur = { doc: ins.doc, caret: ins.caret }; }
                      first = false;
                    }
                  } else if (seg.type === 'img') {
                    const dataUrl = dataUrlMap.get(seg.src);
                    if (dataUrl) {
                      const { w, h } = await imgDims(dataUrl);
                      cur = spliceImgRun(cur.doc, cur.caret, dataUrl, w, h);
                      first = false;
                    }
                  }
                }
                commit(cur.doc, cur.caret, null); // ← only ONE commit
                return;
              }
            }

            // ── No HTML images: paste plain text ───────────────────────────
            if (text?.trim()) {
              const lines = text.split('\n');
              for (let li = 0; li < lines.length; li++) {
                if (li > 0) { const sp = splitPara(cur.doc, cur.caret); cur = { doc: sp.doc, caret: sp.caret }; }
                if (lines[li]) { const ins = insertText(cur.doc, cur.caret, lines[li]); cur = { doc: ins.doc, caret: ins.caret }; }
              }
              commit(cur.doc, cur.caret, null);
              return;
            }

            // ── Last resort: standalone image (screenshot) ─────────────────
            if (cb?.image) {
              const { w, h } = await imgDims(cb.image);
              cur = spliceImgRun(cur.doc, cur.caret, cb.image, w, h);
              commit(cur.doc, cur.caret, null);
            }
          } catch (_err) {
            const text = await navigator.clipboard.readText().catch(() => '');
            if (text) {
              const tableData = detectTableFromClipboard(undefined, text);
              if (tableData) {
                doInsertTableWithData(tableData);
                return;
              }
              const lines = text.split('\n');
              for (let li = 0; li < lines.length; li++) {
                if (li > 0) { const sp = splitPara(cur.doc, cur.caret); cur = { doc: sp.doc, caret: sp.caret }; }
                if (lines[li]) { const ins = insertText(cur.doc, cur.caret, lines[li]); cur = { doc: ins.doc, caret: ins.caret }; }
              }
              commit(cur.doc, cur.caret, null);
            }
          }
        })(); return;
        case 'l': e.preventDefault(); { const nd = applyParaFmt(doc, sel, caret, { align: 'left'    }); commit(nd, caret, sel); } return;
        case 'e': e.preventDefault(); { const nd = applyParaFmt(doc, sel, caret, { align: 'center'  }); commit(nd, caret, sel); } return;
        case 'r': e.preventDefault(); { const nd = applyParaFmt(doc, sel, caret, { align: 'right'   }); commit(nd, caret, sel); } return;
        case 'j': e.preventDefault(); { const nd = applyParaFmt(doc, sel, caret, { align: shiftKey ? 'distributed' : 'justify' }); commit(nd, caret, sel); } return;
        case 'f': e.preventDefault(); setShowFind(true); return;
        case 'h': e.preventDefault(); setShowFind(true); return;
        case 'm': e.preventDefault(); {
          if (shiftKey) { const nd = applyParaFmt(doc, sel, caret, { leftIndent: Math.max(0, (getParaFmtAt(doc, caret).leftIndent ?? 0) - 24) }); commit(nd, caret, sel); }
          else           { const nd = applyParaFmt(doc, sel, caret, { leftIndent: (getParaFmtAt(doc, caret).leftIndent ?? 0) + 24 }); commit(nd, caret, sel); }
          return;
        }
      }
      return;
    }

    switch (key) {
      case 'Enter': {
        e.preventDefault();
        const base = hasSel ? (() => { const r = deleteSelection(doc, sel!); return r; })() : { doc, caret };
        const r = splitPara(base.doc, base.caret);
        commit(r.doc, r.caret, null);
        break;
      }
      case 'Backspace': {
        // Delete selected image
        if (selectedImage) {
          e.preventDefault();
          const { paraIdx, runIdx } = selectedImage;
          const p = doc.paras[paraIdx];
          if (p) {
            const newRuns = p.runs.filter((_, i) => i !== runIdx);
            const newDoc = { ...doc, paras: doc.paras.map((para, pi) => pi === paraIdx ? { ...para, runs: newRuns } : para) };
            commit(newDoc, { paraIdx, charOffset: Math.max(0, runIdx) }, null);
          }
          setSelectedImage(null);
          break;
        }
        if (selectedSmartArtId) {
          e.preventDefault();
          if (selectedSmartArtNodeId) {
            const nd = deleteSmartArtNode(doc, selectedSmartArtId, selectedSmartArtNodeId);
            commit(nd, caret, sel);
            setSelectedSmartArtNodeId(undefined);
          } else {
            const nd = deleteSmartArt(doc, selectedSmartArtId);
            commit(nd, caret, sel);
            setSelectedSmartArtId(undefined);
          }
          break;
        }
        e.preventDefault();
        if (hasSel) { delSel(); break; }
        const r = delBack(doc, caret);
        commit(r.doc, r.caret, null);
        break;
      }
      case 'Delete': {
        // Delete selected image
        if (selectedImage) {
          e.preventDefault();
          const { paraIdx, runIdx } = selectedImage;
          const p = doc.paras[paraIdx];
          if (p) {
            const newRuns = p.runs.filter((_, i) => i !== runIdx);
            const newDoc = { ...doc, paras: doc.paras.map((para, pi) => pi === paraIdx ? { ...para, runs: newRuns } : para) };
            commit(newDoc, { paraIdx, charOffset: Math.max(0, runIdx) }, null);
          }
          setSelectedImage(null);
          break;
        }
        if (selectedSmartArtId) {
          e.preventDefault();
          if (selectedSmartArtNodeId) {
            const nd = deleteSmartArtNode(doc, selectedSmartArtId, selectedSmartArtNodeId);
            commit(nd, caret, sel);
            setSelectedSmartArtNodeId(undefined);
          } else {
            const nd = deleteSmartArt(doc, selectedSmartArtId);
            commit(nd, caret, sel);
            setSelectedSmartArtId(undefined);
          }
          break;
        }
        e.preventDefault();
        if (hasSel) { delSel(); break; }
        const r = delFwd(doc, caret);
        commit(r.doc, r.caret, null);
        break;
      }
      case 'Tab': {
        e.preventDefault();
        const p = doc.paras[caret.paraIdx];
        if (shiftKey) {
            const newLevel = Math.max(0, (p.fmt.listLevel || 0) - 1);
            const nd = applyParaFmt(doc, sel, caret, { listLevel: newLevel });
            commit(nd, caret, sel);
        } else if (p.fmt.listType && caret.charOffset === 0) {
            const newLevel = Math.min(8, (p.fmt.listLevel || 0) + 1);
            const nd = applyParaFmt(doc, sel, caret, { listLevel: newLevel });
            commit(nd, caret, sel);
        } else {
            const base2 = hasSel ? (() => { const r = deleteSelection(doc, sel!); return r; })() : { doc, caret };
            const r2 = insertText(base2.doc, base2.caret, '\t');
            commit(r2.doc, r2.caret, null);
        }
        break;
      }
      case 'ArrowLeft': {
        e.preventDefault();
        const newC = caret.charOffset > 0
          ? { paraIdx: caret.paraIdx, charOffset: caret.charOffset - 1 }
          : caret.paraIdx > 0
            ? { paraIdx: caret.paraIdx - 1, charOffset: paraLen(doc.paras[caret.paraIdx - 1]) }
            : caret;
        if (shiftKey) setSel(s => s ? { anchor: s.anchor, focus: newC } : { anchor: caret, focus: newC });
        else { setSel(null); setCaret(newC); }
        break;
      }
      case 'ArrowRight': {
        e.preventDefault();
        const len = paraLen(doc.paras[caret.paraIdx]);
        const newC = caret.charOffset < len
          ? { paraIdx: caret.paraIdx, charOffset: caret.charOffset + 1 }
          : caret.paraIdx < doc.paras.length - 1
            ? { paraIdx: caret.paraIdx + 1, charOffset: 0 }
            : caret;
        if (shiftKey) setSel(s => s ? { anchor: s.anchor, focus: newC } : { anchor: caret, focus: newC });
        else { setSel(null); setCaret(newC); }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const lp = layout.paras[caret.paraIdx];
        const cl = lp?.lines.find(l => caret.charOffset >= l.charStart && caret.charOffset <= l.charEnd);
        const newC = cl && cl.lineIdx > 0
          ? { paraIdx: caret.paraIdx, charOffset: lp.lines[cl.lineIdx - 1].charStart }
          : caret.paraIdx > 0
            ? { paraIdx: caret.paraIdx - 1, charOffset: layout.paras[caret.paraIdx - 1]?.lines.slice(-1)[0]?.charEnd ?? 0 }
            : caret;
        if (shiftKey) setSel(s => s ? { anchor: s.anchor, focus: newC } : { anchor: caret, focus: newC });
        else { setSel(null); setCaret(newC); }
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        const lp2 = layout.paras[caret.paraIdx];
        const cl2 = lp2?.lines.find(l => caret.charOffset >= l.charStart && caret.charOffset <= l.charEnd);
        const newC = cl2 && cl2.lineIdx < lp2.lines.length - 1
          ? { paraIdx: caret.paraIdx, charOffset: lp2.lines[cl2.lineIdx + 1].charEnd }
          : caret.paraIdx < doc.paras.length - 1
            ? { paraIdx: caret.paraIdx + 1, charOffset: 0 }
            : caret;
        if (shiftKey) setSel(s => s ? { anchor: s.anchor, focus: newC } : { anchor: caret, focus: newC });
        else { setSel(null); setCaret(newC); }
        break;
      }
      case 'Home': {
        e.preventDefault();
        const lp3 = layout.paras[caret.paraIdx];
        const cl3 = lp3?.lines.find(l => caret.charOffset >= l.charStart && caret.charOffset <= l.charEnd);
        const newC = { paraIdx: caret.paraIdx, charOffset: cl3?.charStart ?? 0 };
        if (shiftKey) setSel(s => s ? { anchor: s.anchor, focus: newC } : { anchor: caret, focus: newC });
        else { setSel(null); setCaret(newC); }
        break;
      }
      case 'End': {
        e.preventDefault();
        const lp4 = layout.paras[caret.paraIdx];
        const cl4 = lp4?.lines.find(l => caret.charOffset >= l.charStart && caret.charOffset <= l.charEnd);
        const newC = { paraIdx: caret.paraIdx, charOffset: cl4?.charEnd ?? paraLen(doc.paras[caret.paraIdx]) };
        if (shiftKey) setSel(s => s ? { anchor: s.anchor, focus: newC } : { anchor: caret, focus: newC });
        else { setSel(null); setCaret(newC); }
        break;
      }
    }
  }, [doc, caret, sel, composing, hist, commit, layout, toggleRunFmt, doInsertMixedContent]);

  // ── Text input ────────────────────────────────────────────────────
  const onInput = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    setShowMiniToolbar(false);
    if (composing) return;
    const ta = e.currentTarget; const text = ta.value; ta.value = '';
    if (!text) return;
    const hasSel = sel && !(sel.anchor.paraIdx === sel.focus.paraIdx && sel.anchor.charOffset === sel.focus.charOffset);
    const base = hasSel ? (() => { const r = deleteSelection(doc, sel!); return r; })() : { doc, caret };
    const r = insertText(base.doc, base.caret, text);
    commit(r.doc, r.caret, null);
  }, [doc, caret, sel, composing, commit]);

  // ── Text input paste handler ───────────────────────────────────────
  const onPaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const cd = e.clipboardData;
    if (!cd) return;

    // 1. Image
    const items = Array.from(cd.items || []);
    const hasImage = items.some(item => item.kind === 'file' && item.type.startsWith('image/'));
    if (hasImage) {
      e.preventDefault();
      InsertPictureEngine.handlePaste(e.nativeEvent);
      return;
    }

    const html = cd.getData('text/html');
    const text = cd.getData('text/plain');

    // 2. Mixed content (multiple tables + text from web page)
    if (html) {
      const mixed = parseHtmlMixedContent(html);
      if (mixed) {
        e.preventDefault();
        if (inputRef.current) inputRef.current.value = '';
        doInsertMixedContent(mixed);
        return;
      }
    }

    // 3. Single table (TSV or line-separated)
    const tableData = detectTableFromClipboard(undefined, text);
    if (tableData) {
      e.preventDefault();
      if (inputRef.current) inputRef.current.value = '';
      doInsertTableWithData(tableData);
      return;
    }
  }, [doInsertTableWithData, doInsertMixedContent]);

  // ── Document-level paste listener — backup for non-Ctrl+V paste (e.g. right-click Paste) ──
  useEffect(() => {
    const handleDocPaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const cd = e.clipboardData;

      // 1. Image
      const items = Array.from(cd.items || []);
      const hasImage = items.some(item => item.kind === 'file' && item.type.startsWith('image/'));
      if (hasImage) {
        e.preventDefault();
        e.stopPropagation();
        InsertPictureEngine.handlePaste(e);
        return;
      }

      const html = cd.getData('text/html');
      const text = cd.getData('text/plain');

      // 2. Mixed content (multiple tables + text)
      if (html) {
        const mixed = parseHtmlMixedContent(html);
        if (mixed) {
          e.preventDefault();
          e.stopPropagation();
          if (inputRef.current) inputRef.current.value = '';
          doInsertMixedContent(mixed);
          return;
        }
      }

      // 3. Single table (TSV or line-separated)
      const tableData = detectTableFromClipboard(undefined, text);
      if (tableData) {
        e.preventDefault();
        e.stopPropagation();
        if (inputRef.current) inputRef.current.value = '';
        doInsertTableWithData(tableData);
        return;
      }
    };
    document.addEventListener('paste', handleDocPaste, true);
    return () => document.removeEventListener('paste', handleDocPaste, true);
  }, [doInsertTableWithData, doInsertMixedContent]);

  // ── IME ───────────────────────────────────────────────────────────
  const onCompositionStart = useCallback(() => { setComposing(true); compBuf.current = ''; }, []);
  const onCompositionUpdate = useCallback((e: React.CompositionEvent) => { compBuf.current = e.data; }, []);
  const onCompositionEnd   = useCallback((e: React.CompositionEvent) => {
    setComposing(false);
    if (inputRef.current) inputRef.current.value = '';
    if (!e.data) return;
    const hasSel = sel && !(sel.anchor.paraIdx === sel.focus.paraIdx && sel.anchor.charOffset === sel.focus.charOffset);
    const base = hasSel ? (() => { const r = deleteSelection(doc, sel!); return r; })() : { doc, caret };
    const r = insertText(base.doc, base.caret, e.data);
    commit(r.doc, r.caret, null);
  }, [doc, caret, sel, commit]);

  // ── Register EditorAPI ─────────────────────────────────────────────
  useEffect(() => {
    const api: API.IEditorAPI = {
      toggleBold:      () => { const nd = applyRunFmt(doc, sel, caret, { bold:        isFmtActive(doc, sel, caret, 'bold')        ? undefined : true }); commit(nd, caret, sel); },
      toggleItalic:    () => { const nd = applyRunFmt(doc, sel, caret, { italic:      isFmtActive(doc, sel, caret, 'italic')      ? undefined : true }); commit(nd, caret, sel); },
      toggleUnderline: () => { const nd = applyRunFmt(doc, sel, caret, { underline:   isFmtActive(doc, sel, caret, 'underline')   ? undefined : true }); commit(nd, caret, sel); },
      toggleStrike:    () => { const nd = applyRunFmt(doc, sel, caret, { strike:      isFmtActive(doc, sel, caret, 'strike')      ? undefined : true }); commit(nd, caret, sel); },
      toggleSuperscript: () => { const nd = applyRunFmt(doc, sel, caret, { superscript: isFmtActive(doc, sel, caret, 'superscript') ? undefined : true }); commit(nd, caret, sel); },
      toggleSubscript:   () => { const nd = applyRunFmt(doc, sel, caret, { subscript:   isFmtActive(doc, sel, caret, 'subscript')   ? undefined : true }); commit(nd, caret, sel); },
      increaseFontSize: () => {
        const cur = getRunFmtAt(doc, caret).fontSize ?? DEF_SIZE;
        const next = FONT_SIZES.find(s => s > cur) ?? cur + 2;
        const nd = applyRunFmt(doc, sel, caret, { fontSize: next }); commit(nd, caret, sel);
      },
      decreaseFontSize: () => {
        const cur = getRunFmtAt(doc, caret).fontSize ?? DEF_SIZE;
        const prev = [...FONT_SIZES].reverse().find(s => s < cur) ?? Math.max(6, cur - 2);
        const nd = applyRunFmt(doc, sel, caret, { fontSize: prev }); commit(nd, caret, sel);
      },
      setFontFamily: (name) => { const nd = applyRunFmt(doc, sel, caret, { fontFamily: name }); commit(nd, caret, sel); },
      setFontSize:   (pt)   => { const nd = applyRunFmt(doc, sel, caret, { fontSize: pt }); commit(nd, caret, sel); },
      setFontColor:  (c)    => { const nd = applyRunFmt(doc, sel, caret, { color: c }); commit(nd, caret, sel); },
      setHighlight:  (c)    => { const nd = applyRunFmt(doc, sel, caret, { highlight: c }); commit(nd, caret, sel); },
      clearFormatting: () => {
        const nd = applyRunFmt(doc, sel, caret, { bold: undefined, italic: undefined, underline: undefined, strike: undefined, color: undefined, highlight: undefined, superscript: undefined, subscript: undefined });
        const nd2 = applyParaFmt(nd, sel, caret, { align: 'left', leftIndent: 0, listType: null });
        commit(nd2, caret, sel);
      },
      setAlign:       (a)   => { const nd = applyParaFmt(doc, sel, caret, { align: a }); commit(nd, caret, sel); },
      indentIncrease: ()    => { const cur = getParaFmtAt(doc, caret).leftIndent ?? 0; const nd = applyParaFmt(doc, sel, caret, { leftIndent: cur + 24 }); commit(nd, caret, sel); },
      indentDecrease: ()    => { const cur = getParaFmtAt(doc, caret).leftIndent ?? 0; const nd = applyParaFmt(doc, sel, caret, { leftIndent: Math.max(0, cur - 24) }); commit(nd, caret, sel); },
      setLeftIndent:  (v)   => { const nd = applyParaFmt(doc, sel, caret, { leftIndent: v }); commit(nd, caret, sel); },
      setRightIndent: (v)   => { const nd = applyParaFmt(doc, sel, caret, { rightIndent: v }); commit(nd, caret, sel); },
      setFirstLineIndent: (v) => { const nd = applyParaFmt(doc, sel, caret, { firstLineIndent: v }); commit(nd, caret, sel); },
      setHangingIndent: (v) => { const nd = applyParaFmt(doc, sel, caret, { hangingIndent: v }); commit(nd, caret, sel); },
      previewIndentIncrease: () => { const cur = getParaFmtAt(doc, caret).leftIndent ?? 0; setLivePreviewParaFmt({ leftIndent: cur + 24 }); },
      previewIndentDecrease: () => { const cur = getParaFmtAt(doc, caret).leftIndent ?? 0; setLivePreviewParaFmt({ leftIndent: Math.max(0, cur - 24) }); },
      toggleBullets:  ()    => {
        const cur = getParaFmtAt(doc, caret).listType;
        const nd = applyParaFmt(doc, sel, caret, { listType: cur === 'bullet' ? null : 'bullet', bulletType: 'symbol' });
        commit(nd, caret, sel);
      },
      setBulletChar: (char, font) => {
        const nd = applyParaFmt(doc, sel, caret, { listType: 'bullet', bulletType: 'symbol', bulletChar: char, bulletFont: font });
        commit(nd, caret, sel);
      },
      setBulletImage: (src) => {
        const nd = applyParaFmt(doc, sel, caret, { listType: 'bullet', bulletType: 'image', bulletImage: src });
        commit(nd, caret, sel);
      },
      setBulletColor: (c) => {
        const nd = applyParaFmt(doc, sel, caret, { listType: 'bullet', bulletColor: c });
        commit(nd, caret, sel);
      },
      setBulletSize: (pct) => {
        const nd = applyParaFmt(doc, sel, caret, { listType: 'bullet', bulletSize: pct });
        commit(nd, caret, sel);
      },
      toggleNumbering: ()   => {
        const cur = getParaFmtAt(doc, caret).listType;
        const nd = applyParaFmt(doc, sel, caret, { listType: cur === 'number' ? null : 'number', listFormat: 'decimal' });
        commit(nd, caret, sel);
      },
      promoteListLevel: () => {
        const cur = getParaFmtAt(doc, caret);
        if (!cur.listType) return;
        const newLevel = Math.max(0, (cur.listLevel || 0) - 1);
        const nd = applyParaFmt(doc, sel, caret, { listLevel: newLevel });
        commit(nd, caret, sel);
      },
      demoteListLevel: () => {
        const cur = getParaFmtAt(doc, caret);
        if (!cur.listType) return;
        const newLevel = Math.min(8, (cur.listLevel || 0) + 1);
        const nd = applyParaFmt(doc, sel, caret, { listLevel: newLevel });
        commit(nd, caret, sel);
      },
      setNumberingFormat: (format, prefix, suffix) => {
        const nd = applyParaFmt(doc, sel, caret, { listType: 'number', listFormat: format, numberPrefix: prefix, numberSuffix: suffix });
        commit(nd, caret, sel);
      },
      setNumberingStart: (startAt) => {
        const nd = applyParaFmt(doc, sel, caret, { listType: 'number', listStartAt: startAt, listRestart: true });
        commit(nd, caret, sel);
      },
      setLineSpacing: (n)   => { const nd = applyParaFmt(doc, sel, caret, { lineSpacing: n }); commit(nd, caret, sel); },
      setParaFmt: (fmt)     => { const nd = applyParaFmt(doc, sel, caret, fmt); commit(nd, caret, sel); },
      setRunFmt:  (fmt)     => { const nd = applyRunFmt(doc, sel, caret, fmt); commit(nd, caret, sel); },
      
      setBorders: (b: any) => { const nd = applyParaFmt(doc, sel, caret, { borders: b || undefined }); commit(nd, caret, sel); },
      setBorder: (type, def) => {
        const cur = getParaFmtAt(doc, caret).borders || {};
        const newB = { ...cur };
        if (type === 'none') {
          ['top', 'bottom', 'left', 'right', 'between'].forEach(k => delete (newB as any)[k]);
        } else if (type === 'outside') {
          newB.top = def; newB.bottom = def; newB.left = def; newB.right = def;
        } else if (type === 'inside') {
          newB.between = def;
        } else if (type === 'all') {
          newB.top = def; newB.bottom = def; newB.left = def; newB.right = def; newB.between = def;
        } else {
          if (def) (newB as any)[type] = def;
          else delete (newB as any)[type];
        }
        const nd = applyParaFmt(doc, sel, caret, { borders: newB });
        commit(nd, caret, sel);
      },
      applyLivePreviewPara: (fmt) => setLivePreviewParaFmt(fmt),
      sortParagraphs: (options) => {
        // Simple ascending sort of selected paragraphs for V1
        if (!sel) return;
        const { startPara, endPara } = normalizeSel(sel);
        if (startPara === endPara) return;
        
        const parasToSort = doc.paras.slice(startPara, endPara + 1);
        parasToSort.sort((a, b) => {
          const tA = paraText(a); const tB = paraText(b);
          return tA.localeCompare(tB);
        });
        
        const newParas = [...doc.paras.slice(0, startPara), ...parasToSort, ...doc.paras.slice(endPara + 1)];
        commit({ ...doc, paras: newParas }, caret, sel);
      },
      toggleFormatMarks: () => setFormatMarks(v => !v),
      applyStyle: (name) => {
        const style = STYLES[name];
        if (!style) return;
        const nd1 = applyRunFmt(doc, sel, caret, style.runFmt);
        const nd2 = applyParaFmt(nd1, sel, caret, style.paraFmt);
        commit(nd2, caret, sel);
      },
      copy:  async () => {
        if (!sel) return;
        const ns = normalizeSel(sel);
        const paras: DocPara[] = [];
        let text = '';
        for (let pi = ns.startPara; pi <= ns.endPara; pi++) {
          const from = pi === ns.startPara ? ns.startChar : 0;
          const to   = pi === ns.endPara   ? ns.endChar   : paraLen(doc.paras[pi]);
          
          // Slice paragraph text and runs
          const p = doc.paras[pi];
          text += paraText(p).slice(from, to);
          if (pi < ns.endPara) text += '\n';

          // Basic slice for clipboard json
          paras.push(JSON.parse(JSON.stringify(p))); 
        }
        await ClipboardEngine.copy(paras, text);
      },
      cut: async () => {
        if (!sel) return;
        await api.copy();
        const r = deleteSelection(doc, sel); commit(r.doc, r.caret, null);
      },
      paste: async () => {
        const item = await ClipboardEngine.paste();
        if (!item) return;

        if (item.type === 'table') {
          doInsertTableWithData(item.tableData);
          return;
        }

        const hasSel = sel && !(sel.anchor.paraIdx === sel.focus.paraIdx && sel.anchor.charOffset === sel.focus.charOffset);
        const base = hasSel ? (() => { const r = deleteSelection(doc, sel!); return { doc: r.doc, caret: r.caret }; })() : { doc, caret };
        
        if (item.type === 'internal') {
          let text = '';
          for (const p of item.paras) text += p.runs.map((r: any) => r.text).join('') + '\n';
          text = text.trimEnd();
          
          const lines = text.split('\n');
          let cur = base;
          for (let li = 0; li < lines.length; li++) {
            if (li > 0) { const sp = splitPara(cur.doc, cur.caret); cur = { doc: sp.doc, caret: sp.caret }; }
            if (lines[li]) { const ins = insertText(cur.doc, cur.caret, lines[li]); cur = { doc: ins.doc, caret: ins.caret }; }
          }
          commit(cur.doc, cur.caret, null);
        } else {
          // Check if plain text / html is a table
          const tableData = detectTableFromClipboard(item.html, item.text);
          if (tableData) {
            doInsertTableWithData(tableData);
            return;
          }

          // Plain text paste
          const text = item.text;
          const lines = text.split('\n');
          let cur = base;
          for (let li = 0; li < lines.length; li++) {
            if (li > 0) { const sp = splitPara(cur.doc, cur.caret); cur = { doc: sp.doc, caret: sp.caret }; }
            if (lines[li]) { const ins = insertText(cur.doc, cur.caret, lines[li]); cur = { doc: ins.doc, caret: ins.caret }; }
          }
          commit(cur.doc, cur.caret, null);
        }
      },
      pasteText: async () => {
        const text = await navigator.clipboard.readText();
        if (!text) return;

        const tableData = detectTableFromClipboard(undefined, text);
        if (tableData) {
          doInsertTableWithData(tableData);
          return;
        }

        const hasSel = sel && !(sel.anchor.paraIdx === sel.focus.paraIdx && sel.anchor.charOffset === sel.focus.charOffset);
        const base = hasSel ? (() => { const r = deleteSelection(doc, sel!); return { doc: r.doc, caret: r.caret }; })() : { doc, caret };
        const lines = text.split('\n');
        let cur = base;
        for (let li = 0; li < lines.length; li++) {
          if (li > 0) { const sp = splitPara(cur.doc, cur.caret); cur = { doc: sp.doc, caret: sp.caret }; }
          if (lines[li]) { const ins = insertText(cur.doc, cur.caret, lines[li]); cur = { doc: ins.doc, caret: ins.caret }; }
        }
        commit(cur.doc, cur.caret, null);
      },
      pasteHTML: async () => {
        await api.paste(); // Placeholder
      },
      pasteSpecial: () => {
        // Typically opens a dialog; for now we'll just pasteText
        api.pasteText();
      },
      toggleFormatPainter: () => {
        if (formatPainterState) {
          setFormatPainterState(null);
        } else {
          setFormatPainterState({
            runFmt: getRunFmtAt(doc, caret),
            paraFmt: getParaFmtAt(doc, caret)
          });
        }
      },
      toggleClipboardPanel: () => {
        setClipboardPanelOpen(v => !v);
      },
      applyLivePreview: (fmt) => setLivePreviewFmt(fmt),
      clearLivePreview: () => { setLivePreviewFmt(null); setLivePreviewParaFmt(null); },
      setTypography: (props) => { const nd = applyRunFmt(doc, sel, caret, props); commit(nd, caret, sel); },
      setTextEffects: (props) => { const nd = applyRunFmt(doc, sel, caret, { effects: props }); commit(nd, caret, sel); },
      toggleDoubleUnderline: () => { const k = 'doubleUnderline'; const nd = applyRunFmt(doc, sel, caret, { [k]: !isFmtActive(doc, sel, caret, k) }); commit(nd, caret, sel); },
      toggleDoubleStrike: () => { const k = 'doubleStrike'; const nd = applyRunFmt(doc, sel, caret, { [k]: !isFmtActive(doc, sel, caret, k) }); commit(nd, caret, sel); },
      toggleSmallCaps: () => { const k = 'smallCaps'; const nd = applyRunFmt(doc, sel, caret, { [k]: !isFmtActive(doc, sel, caret, k) }); commit(nd, caret, sel); },
      toggleAllCaps: () => { const k = 'allCaps'; const nd = applyRunFmt(doc, sel, caret, { [k]: !isFmtActive(doc, sel, caret, k) }); commit(nd, caret, sel); },
      toggleHidden: () => { const k = 'hiddenText'; const nd = applyRunFmt(doc, sel, caret, { [k]: !isFmtActive(doc, sel, caret, k) }); commit(nd, caret, sel); },

      undo: () => { const f = hist.undo(); if (f) { setDoc(f.doc); setCaret(f.caret); setSel(f.sel); } },
      redo: () => { const f = hist.redo(); if (f) { setDoc(f.doc); setCaret(f.caret); setSel(f.sel); } },
      selectAll: () => {
        const last = doc.paras[doc.paras.length - 1];
        setSel({ anchor: { paraIdx: 0, charOffset: 0 }, focus: { paraIdx: doc.paras.length - 1, charOffset: paraLen(last) } });
      },
      showFind:    () => setShowFind(true),
      showReplace: () => setShowFind(true),

      setSelection: (paraIdxOrId, startOffset, endOffset) => {
        let pIdx = typeof paraIdxOrId === 'number' ? paraIdxOrId : doc.paras.findIndex(p => p.id === paraIdxOrId);
        if (pIdx < 0) pIdx = 0;
        if (pIdx >= doc.paras.length) pIdx = doc.paras.length - 1;
        setSel({ anchor: { paraIdx: pIdx, charOffset: startOffset }, focus: { paraIdx: pIdx, charOffset: endOffset } });
        setCaret({ paraIdx: pIdx, charOffset: endOffset });
      },
      goToPage: (pageNum) => {
        // Find which paragraph is on this page
        // Page num is 1-based
        const targetPage = Math.max(0, Math.min(pageNum - 1, pages.length - 1));
        const page = pages[targetPage];
        if (page && page.lines.length > 0) {
          const firstLine = page.lines[0];
          setSel(null);
          setCaret({ paraIdx: firstLine.paraIdx, charOffset: firstLine.charStart });
        }
      },
      goToLine: (lineNum) => {
        // lineNum is absolute line number across entire document (1-based)
        let currLine = 0;
        for (const p of layout.paras) {
          for (const l of p.lines) {
            currLine++;
            if (currLine === lineNum) {
              setSel(null);
              setCaret({ paraIdx: l.paraIdx, charOffset: l.charStart });
              return;
            }
          }
        }
      },

      getSelectedText: () => {
        if (!sel) return '';
        const ns = normalizeSel(sel);
        let text = '';
        for (let pi = ns.startPara; pi <= ns.endPara; pi++) {
          const from = pi === ns.startPara ? ns.startChar : 0;
          const to   = pi === ns.endPara   ? ns.endChar   : paraLen(doc.paras[pi]);
          text += paraText(doc.paras[pi]).slice(from, to);
          if (pi < ns.endPara) text += '\n';
        }
        return text;
      },
      getFullDocumentText: () => {
        return doc.paras.map(p => paraText(p)).join('\n');
      },
      getPagesData: () => {
        return { doc, layout, pages };
      },
      getDocumentMetadata: () => {
        return {
          title: 'OfficeX Document',
          author: 'Current User',
          pageCount: String(pages.length),
          wordCount: String(EditorAPI.getState().wordCount),
          lastModified: new Date().toISOString(),
        };
      },
      getPreviousParagraph: () => {
        if (!sel && !caret) return '';
        const pIdx = sel ? normalizeSel(sel).startPara : caret.paraIdx;
        if (pIdx === 0) return '';
        return paraText(doc.paras[pIdx - 1]);
      },
      getCurrentParagraph: () => {
        if (!sel && !caret) return '';
        const pIdx = sel ? normalizeSel(sel).startPara : caret.paraIdx;
        return paraText(doc.paras[pIdx]);
      },
      getNextParagraph: () => {
        if (!sel && !caret) return '';
        const pIdx = sel ? normalizeSel(sel).endPara : caret.paraIdx;
        if (pIdx >= doc.paras.length - 1) return '';
        return paraText(doc.paras[pIdx + 1]);
      },
      getSelectionFormatting: () => {
        const state = EditorAPI.getState();
        return {
          isBold: state.bold,
          isItalic: state.italic,
          isUnderline: state.underline,
          font: state.fontFamily,
          style: 'Normal' // Placeholder
        };
      },
      setContent: (textOrJson: string) => {
        let newDoc: DocModel | null = null;
        if (typeof textOrJson === 'string' && textOrJson.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(textOrJson);
            if (parsed && Array.isArray(parsed.paras)) {
              newDoc = parsed;
            }
          } catch {}
        }
        if (!newDoc) {
          const lines = (textOrJson || '').split('\n');
          const paras = lines.map((line, idx) => ({
            id: `para_${Date.now()}_${idx}`,
            runs: [{ id: `run_${Date.now()}_${idx}`, text: line, fmt: {} }],
            fmt: {}
          }));
          newDoc = {
            sections: doc.sections,
            paras: paras.length > 0 ? paras : [{ id: `para_${Date.now()}`, runs: [{ id: `run_${Date.now()}`, text: '', fmt: {} }], fmt: {} }]
          };
        }
        setDoc(newDoc);
        setCaret({ paraIdx: 0, charOffset: 0 });
        setSel(null);
        hist.reset(newDoc);
        try { FileEngine.resetModified(); } catch {}
      },

      setDocModel: (newDoc: DocModel) => {
        if (newDoc && Array.isArray(newDoc.paras)) {
          setDoc(newDoc);
          setCaret({ paraIdx: 0, charOffset: 0 });
          setSel(null);
          hist.reset(newDoc);
          try { FileEngine.resetModified(); } catch {}
        }
      },

      clearDocument: () => {
        const newDoc: DocModel = {
          sections: doc.sections,
          paras: [{
            id: `para_${Date.now()}`,
            runs: [{ id: `run_${Date.now()}`, text: '', fmt: {} }],
            fmt: {}
          }]
        };
        setDoc(newDoc);
        setCaret({ paraIdx: 0, charOffset: 0 });
        setSel(null);
        hist.reset(newDoc);
        try { FileEngine.resetModified(); } catch {}
      },

      insertTextAtSelection: (text: string) => {
        let validSel = sel;
        if (validSel) {
          const sPara = Math.min(validSel.anchor.paraIdx, validSel.focus.paraIdx);
          const ePara = Math.max(validSel.anchor.paraIdx, validSel.focus.paraIdx);
          if (sPara < 0 || ePara >= doc.paras.length) validSel = null;
        }
        const hasSel = validSel && !(validSel.anchor.paraIdx === validSel.focus.paraIdx && validSel.anchor.charOffset === validSel.focus.charOffset);
        const baseCaret = caret || { paraIdx: 0, charOffset: 0 };
        const base = hasSel ? (() => { const r = deleteSelection(doc, validSel!); return { doc: r.doc, caret: r.caret }; })() : { doc, caret: baseCaret };
        const lines = text.split('\n');
        let cur = base;
        for (let li = 0; li < lines.length; li++) {
          if (li > 0) { const sp = splitPara(cur.doc, cur.caret!); cur = { doc: sp.doc, caret: sp.caret }; }
          if (lines[li]) { const ins = insertText(cur.doc, cur.caret!, lines[li]); cur = { doc: ins.doc, caret: ins.caret }; }
        }
        commit(cur.doc, cur.caret, null);
      },

      insertPageBreak: () => {
        const c = caret || { paraIdx: 0, charOffset: 0 };
        const sp = splitPara(doc, c);
        const nd = applyParaFmt(sp.doc, null, sp.caret, { pageBreak: true });
        commit(nd, sp.caret, null);
      },
      insertBlankPage: () => {
        const c = caret || { paraIdx: 0, charOffset: 0 };
        const sp1 = splitPara(doc, c);
        const nd1 = applyParaFmt(sp1.doc, null, sp1.caret, { pageBreak: true });
        const sp2 = splitPara(nd1, sp1.caret);
        const nd2 = applyParaFmt(sp2.doc, null, sp2.caret, { pageBreak: true });
        commit(nd2, sp1.caret, null);
      },
      insertCoverPage: (templateId: string) => {
        const makePara = (text: string, runFmt: RunFmt, paraFmt: ParaFmt): DocPara => ({
          id: crypto.randomUUID(),
          runs: [{ id: crypto.randomUUID(), text, fmt: runFmt }],
          fmt: paraFmt,
        });

        // Cover page title paragraph
        const titlePara = makePara(
          templateId.charAt(0).toUpperCase() + templateId.slice(1),
          { bold: true, fontSize: 28, fontFamily: 'Calibri Light', color: '#1a1a2e' },
          { align: 'center', spaceBefore: 80, spaceAfter: 12 }
        );
        // Subtitle
        const subtitlePara = makePara(
          '[Document Subtitle]',
          { fontSize: 16, color: '#4a5568', italic: true },
          { align: 'center', spaceAfter: 8 }
        );
        // Author
        const authorPara = makePara(
          '[Author Name]',
          { fontSize: 12, color: '#718096' },
          { align: 'center', spaceAfter: 4 }
        );
        // Date
        const datePara = makePara(
          new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          { fontSize: 11, color: '#718096' },
          { align: 'center', spaceAfter: 80 }
        );
        // Page break separator
        const breakPara = makePara('', {}, { pageBreak: true });

        const newParas = [titlePara, subtitlePara, authorPara, datePara, breakPara, ...doc.paras];
        const newDoc: typeof doc = { ...doc, paras: newParas };
        commit(newDoc, { paraIdx: 0, charOffset: 0 }, null);
      },

      // ─── Tables ───
      setDrawTableMode: () => {},
      insertQuickTable: () => {},
      insertExcelTable: () => {},
      convertTableToText: () => {},
      insertTable: (rows: number, cols: number) => {
        const caretPos = caret || { paraIdx: 0, charOffset: 0 };

        const tableId = crypto.randomUUID();
        // Use full printable width (~476pt for letter with 1in margins)
        const totalW = 476;
        const colW = totalW / cols;
        const colWidths = new Array(cols).fill(colW);
        const tableParas: DocPara[] = [];

        for (let r = 0; r < rows; r++) {
          const rowId = crypto.randomUUID();
          for (let col = 0; col < cols; col++) {
            const cellId = crypto.randomUUID();
            tableParas.push({
              id: crypto.randomUUID(),
              runs: [{ id: crypto.randomUUID(), text: '', fmt: {} }],
              fmt: {
                tableId,
                tableRowId: rowId,
                tableCellId: cellId,
                tableRowIdx: r,
                tableColIdx: col,
                tableColSpan: 1,
                tableRowSpan: 1,
                tableColWidths: colWidths,
                tableStyleId: 'Style7',
                tableHeaderRow: true,
                tableBandedRows: true,
                tableFirstColumn: false,
                tableCellPadding: 5,
                spaceAfter: 0,
                spaceBefore: 0,
                align: 'left',
                borders: {
                  top: { width: 1, style: 'solid' as any, color: '#94a3b8' },
                  bottom: { width: 1, style: 'solid' as any, color: '#94a3b8' },
                  left: { width: 1, style: 'solid' as any, color: '#94a3b8' },
                  right: { width: 1, style: 'solid' as any, color: '#94a3b8' },
                },
              },
            });
          }
        }

        // Trailing empty paragraph so cursor can sit after the table
        const trailingPara: DocPara = {
          id: crypto.randomUUID(),
          runs: [{ id: crypto.randomUUID(), text: '', fmt: {} }],
          fmt: { spaceAfter: 0, spaceBefore: 0, align: 'left' },
        };

        // Insert after current caret paragraph
        const insertAt = caretPos.paraIdx + 1;
        const newParas = [
          ...doc.paras.slice(0, insertAt),
          ...tableParas,
          trailingPara,
          ...doc.paras.slice(insertAt),
        ];

        const newDoc = { ...doc, paras: newParas };
        // Place caret in the first cell of the table
        commit(newDoc, { paraIdx: insertAt, charOffset: 0 }, null);
      },


      setZoom: (level: number) => {
        setZoom(level / 100);
      },

      insertRow: (position: 'above' | 'below') => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.insertRow(doc, caret, position);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      insertColumn: (position: 'left' | 'right') => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.insertColumn(doc, caret, position);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      deleteRow: () => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.deleteRow(doc, caret);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      deleteColumn: () => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.deleteColumn(doc, caret);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      setTableOption: (option: Record<string, boolean>) => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.setTableOption(doc, caret, option);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      setTableStyle: (styleId: string) => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.setTableStyle(doc, caret, styleId);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      setTableShading: (color: string) => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.setTableShading(doc, caret, sel, color);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      setTableBorders: (type: string, width?: number, style?: string, color?: string) => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.setTableBorders(doc, caret, sel, type, width, style, color);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      deleteTable: () => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.deleteTable(doc, caret);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      splitCell: (cols: number = 2, rows: number = 1) => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.splitCell(doc, caret, cols, rows);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      mergeCells: () => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.mergeCells(doc, caret, sel);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      setColumnWidth: (wPx: number) => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.setColumnWidth(doc, caret, wPx);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      setRowHeight: (hPx: number) => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.setRowHeight(doc, caret, hPx);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      distributeColumns: () => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.distributeColumns(doc, caret);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      distributeRows: () => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.distributeRows(doc, caret);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      setCellAlignment: (align: 'left' | 'center' | 'right', vAlign: 'top' | 'middle' | 'bottom') => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.setCellAlignment(doc, caret, sel, align, vAlign);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      sortRowsAscending: () => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.sortRowsAscending(doc, caret);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      sortRowsDescending: () => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.sortRowsDescending(doc, caret);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      setAltText: (altTitle: string, altText: string) => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const res = TableEngine.setAltText(doc, caret, altTitle, altText);
          if (res) commit(res.doc, res.caret, null);
        });
      },
      selectTable: (tableId?: string) => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const s = TableEngine.selectTable(doc, caret);
          if (s) {
            setSel(s);
            setCaret(s.focus);
          }
        });
      },
      selectColumn: () => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const s = TableEngine.selectColumn(doc, caret);
          if (s) {
            setSel(s);
            setCaret(s.focus);
          }
        });
      },
      selectRow: () => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const s = TableEngine.selectRow(doc, caret);
          if (s) {
            setSel(s);
            setCaret(s.focus);
          }
        });
      },
      selectCell: () => {
        import('./table/TableEngine').then(({ TableEngine }) => {
          const s = TableEngine.selectCell(doc, caret);
          if (s) {
            setSel(s);
            setCaret(s.focus);
          }
        });
      },
      insertSmartArt: (type: string, subType: string) => {
        const { doc: nextDocBase, smartArtId } = createSmartArt(doc, type, subType);
        
        const saRun = {
          id: `run_${Date.now()}_sa`,
          text: '\uFFFC',
          fmt: {
            ...EditorAPI.getState().currentRunFmt,
            inlineSmartArtId: smartArtId
          }
        };

        let nextDoc = { ...nextDocBase, paras: [...nextDocBase.paras] };
        const p = nextDoc.paras[caret.paraIdx];
        if (p) {
          const np = { ...p, runs: [...p.runs] };
          let currentOffset = 0;
          let splitRunIdx = -1;
          let splitCharIdx = 0;

          for (let i = 0; i < np.runs.length; i++) {
            const r = np.runs[i];
            if (currentOffset + r.text.length >= caret.charOffset) {
              splitRunIdx = i;
              splitCharIdx = caret.charOffset - currentOffset;
              break;
            }
            currentOffset += r.text.length;
          }

          if (splitRunIdx !== -1) {
            const targetRun = np.runs[splitRunIdx];
            const beforeText = targetRun.text.slice(0, splitCharIdx);
            const afterText = targetRun.text.slice(splitCharIdx);
            
            const newRuns = [];
            if (beforeText) newRuns.push({ ...targetRun, id: targetRun.id + '_b', text: beforeText });
            newRuns.push(saRun);
            if (afterText) newRuns.push({ ...targetRun, id: targetRun.id + '_a', text: afterText });
            else newRuns.push({ ...targetRun, id: targetRun.id + '_a', text: '' }); 

            np.runs.splice(splitRunIdx, 1, ...newRuns);
          } else {
            np.runs.push(saRun);
          }
          nextDoc.paras[caret.paraIdx] = np;
        }
        commit(nextDoc, { paraIdx: caret.paraIdx, charOffset: caret.charOffset + 1 }, null);
      },

      addSmartArtNode: () => {
        if (!selectedSmartArtId || !selectedSmartArtNodeId) return;
        const newDoc = addSmartArtNode(doc, selectedSmartArtId, selectedSmartArtNodeId);
        commit(newDoc, caret, sel);
      },

      promoteSmartArtNode: () => {
        if (!selectedSmartArtId || !selectedSmartArtNodeId) return;
        const newDoc = promoteSmartArtNode(doc, selectedSmartArtId, selectedSmartArtNodeId);
        commit(newDoc, caret, sel);
      },

      demoteSmartArtNode: () => {
        if (!selectedSmartArtId || !selectedSmartArtNodeId) return;
        const newDoc = demoteSmartArtNode(doc, selectedSmartArtId, selectedSmartArtNodeId);
        commit(newDoc, caret, sel);
      },

      insertImage: (src: string, width: number, height: number) => {
        // Create an empty space run with the image formatting
        const imgRun = {
          id: `run_${Date.now()}_img`,
          text: '\uFFFC', // Object Replacement Character
          fmt: {
            ...EditorAPI.getState().currentRunFmt,
            inlineImage: src,
            imageWidth: width,
            imageHeight: height
          }
        };
        // Insert it into the document
        let nextDoc = { ...doc, paras: [...doc.paras] };
        const p = nextDoc.paras[caret.paraIdx];
        if (p) {
          const np = { ...p, runs: [...p.runs] };
          
          // Split the text at the caret
          let currentOffset = 0;
          let inserted = false;
          let splitRunIdx = -1;
          let splitCharIdx = 0;

          for (let i = 0; i < np.runs.length; i++) {
            const r = np.runs[i];
            if (currentOffset + r.text.length >= caret.charOffset) {
              splitRunIdx = i;
              splitCharIdx = caret.charOffset - currentOffset;
              break;
            }
            currentOffset += r.text.length;
          }

          if (splitRunIdx !== -1) {
            const targetRun = np.runs[splitRunIdx];
            const beforeText = targetRun.text.slice(0, splitCharIdx);
            const afterText = targetRun.text.slice(splitCharIdx);
            
            const newRuns = [];
            if (beforeText) newRuns.push({ ...targetRun, id: targetRun.id + '_b', text: beforeText });
            newRuns.push(imgRun);
            if (afterText) newRuns.push({ ...targetRun, id: targetRun.id + '_a', text: afterText });
            else newRuns.push({ ...targetRun, id: targetRun.id + '_a', text: '' }); // keep cursor formatting

            np.runs.splice(splitRunIdx, 1, ...newRuns);
          } else {
            np.runs.push(imgRun);
          }

          nextDoc.paras[caret.paraIdx] = np;
          commit(nextDoc, { paraIdx: caret.paraIdx, charOffset: caret.charOffset + 1 }, null);
        }
      },

      setPageSetup: (setup: Partial<{ marginTop: number; marginBottom: number; marginLeft: number; marginRight: number; width: number; height: number; cols: number; colLayout: 'equal' | 'left' | 'right' }>) => {
        const nextDoc = {
          ...doc,
          sections: doc.sections.map((sec, idx) => {
            if (idx === 0) {
              return {
                ...sec,
                pageSetup: {
                  ...sec.pageSetup,
                  ...setup
                }
              };
            }
            return sec;
          })
        };
        commit(nextDoc, caret, sel);
      },

      insertBreak: (type: string) => {
        const t = (type || '').toLowerCase();
        
        // Step 1: Split current paragraph at caret position
        const splitRes = splitPara(doc, caret);
        let nextDoc = splitRes.doc;
        const newCaret = splitRes.caret;

        if (t === 'page' || t === 'trang' || t === 'column' || t === 'cot' || t === 'cột' || t === 'textwrap') {
          const targetParaIdx = newCaret.paraIdx;
          const targetPara = nextDoc.paras[targetParaIdx];
          if (targetPara) {
            const updatedParas = [...nextDoc.paras];
            updatedParas[targetParaIdx] = {
              ...targetPara,
              fmt: { ...targetPara.fmt, pageBreak: true }
            };
            nextDoc = { ...nextDoc, paras: updatedParas };
          }
          if (nextDoc.sections && nextDoc.sections.length > 0) {
            const updatedSections = nextDoc.sections.map((sec, sIdx) => {
              if (sIdx === nextDoc.sections.length - 1) {
                return { ...sec, endParaIdx: nextDoc.paras.length - 1 };
              }
              return sec;
            });
            nextDoc = { ...nextDoc, sections: updatedSections };
          }
          commit(nextDoc, newCaret, null);
        } else if (t.includes('section') || t === 'evenpage' || t === 'oddpage') {
          let bType: any = 'NextPage';
          if (t.includes('continuous') || t === 'lientuc') bType = 'Continuous';
          else if (t.includes('even') || t === 'trangchan') bType = 'EvenPage';
          else if (t.includes('odd') || t === 'trangle') bType = 'OddPage';

          if (nextDoc.sections && nextDoc.sections.length > 0) {
            const updatedSections = nextDoc.sections.map((sec, sIdx) => {
              if (sIdx === nextDoc.sections.length - 1) {
                return { ...sec, endParaIdx: nextDoc.paras.length - 1 };
              }
              return sec;
            });
            nextDoc = { ...nextDoc, sections: updatedSections };
          }

          const secDoc = SectionEngine.get().InsertSectionBreak(nextDoc, caret.paraIdx, bType);
          commit(secDoc, newCaret, null);
        }
      },

      applyParaFmt: (fmt: any) => {
        const nd = applyParaFmt(doc, sel, caret, fmt);
        commit(nd, caret, sel);
      },

      getPageSetup: () => {
        return safeDoc.sections[0]?.pageSetup || { width: 816, height: 1056, marginTop: 96, marginBottom: 96, marginLeft: 96, marginRight: 96 };
      },

      getState: () => EditorAPI.getState(),

      // Full document model — used by FileEngine to serialize the doc (with images)
      getDocModel: () => doc,
    };
    EditorAPI.registerLegacy(api);
    return () => EditorAPI.registerLegacy(null as any);
  }, [doc, caret, sel, commit, formatPainterState, selectedSmartArtId, selectedSmartArtNodeId]);

  // ── Render ─────────────────────────────────────────────────────────

  const renderPageWrapper = (page: PageBox) => {
    return (
      <div key={`page_wrapper_${page.pageIdx}`} className="page-wrapper" style={{ position: 'relative' }}>
        {RenderEngine.RenderPage({
          page, pages, doc, layout, sel, caret, sc, zoom, formatMarks,
      onMouseDown: onPageMouseDown as any,
      onMouseMove: onPageMouseMove as any,
      forceUpdate: () => setTick(t => t + 1),
      vis: isPrinting ? { start: 0, end: pages.length } : vis,
      showMiniToolbar,
      setShowMiniToolbar,
      isEditingHeaderFooter,
      selectedImage,
      selectedSmartArtId,
      selectedSmartArtNodeId,
      onSmartArtClick: (saId, nodeId) => {
        if (editingSmartArtNode?.nodeId !== nodeId) {
          setEditingSmartArtNode(null);
        }
        setSelectedSmartArtId(saId);
        setSelectedSmartArtNodeId(nodeId);
      },
      onSmartArtDoubleClick: (saId, nodeId, x, y, w, h) => {
        setSelectedSmartArtId(saId);
        setSelectedSmartArtNodeId(nodeId);
        setEditingSmartArtNode({ saId, nodeId, x, y, w, h });
      },
      onImageClick: (paraIdx, runIdx, e) => {
        e?.stopPropagation?.();
        setSelectedImage(prev =>
          prev?.paraIdx === paraIdx && prev?.runIdx === runIdx ? null : { paraIdx, runIdx }
        );
      },
      onImageAction: (action, paraIdx, runIdx) => {
        const p = doc.paras[paraIdx];
        if (!p) return;
        const run = p.runs[runIdx];
        if (!run || !run.fmt.inlineImage) return;

        if (action === 'delete') {
          const newRuns = p.runs.filter((_, i) => i !== runIdx);
          const newDoc = {
            ...doc,
            paras: doc.paras.map((para, pi) =>
              pi === paraIdx ? { ...para, runs: newRuns } : para
            )
          };
          commit(newDoc, caret, null);
          setSelectedImage(null);
          return;
        }

        const curRot = run.fmt.imageRotation ?? 0;
        let newFmt = { ...run.fmt };
        if (action === 'rotateLeft')  newFmt.imageRotation = (curRot - 90 + 360) % 360;
        if (action === 'rotateRight') newFmt.imageRotation = (curRot + 90) % 360;
        if (action === 'flipH') newFmt.imageFlipH = !run.fmt.imageFlipH;
        if (action === 'flipV') newFmt.imageFlipV = !run.fmt.imageFlipV;

        const newDoc = {
          ...doc,
          paras: doc.paras.map((para, pi) =>
            pi === paraIdx ? {
              ...para,
              runs: para.runs.map((r, ri) => ri === runIdx ? { ...r, fmt: newFmt } : r)
            } : para
          )
        };
        commit(newDoc, caret, null);
      },
    })}

      {/* HEADER FOOTER OVERLAY */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 50 }}>
        {/* Header Area */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: page.section.pageSetup.marginTop, pointerEvents: isEditingHeaderFooter ? 'auto' : 'none' }}>
          {isEditingHeaderFooter && (
            <>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderBottom: '1px dashed #b2b2b2' }} />
              <div style={{ position: 'absolute', bottom: 4, right: page.section.pageSetup.marginLeft, fontSize: 11, color: '#b2b2b2', fontFamily: 'sans-serif' }}>Đầu trang</div>
            </>
          )}
          <div style={{ position: 'absolute', top: page.section.pageSetup.marginTop / 2, left: page.section.pageSetup.marginLeft, right: page.section.pageSetup.marginRight, display: 'flex', border: isEditingHeaderFooter ? '1px dashed #ccc' : 'none', height: 32, alignItems: 'center' }}>
            <div style={{ flex: 1, borderRight: isEditingHeaderFooter ? '1px dashed #ccc' : 'none', height: '100%' }}>
              {isEditingHeaderFooter && <input id={`header-input-l-${page.pageIdx}`} value={page.section.pageSetup.pageHeaders?.[page.pageIdx]?.L ?? page.section.pageSetup.headerL ?? ''} onChange={e => saveHeaderFooter({ headerL: e.target.value }, page.pageIdx)} style={{ width: '100%', height: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Arial, sans-serif', fontSize: 14, color: '#000', padding: '0 8px' }} />}
            </div>
            <div style={{ flex: 1, borderRight: isEditingHeaderFooter ? '1px dashed #ccc' : 'none', height: '100%' }}>
              {isEditingHeaderFooter && <input id={`header-input-c-${page.pageIdx}`} value={page.section.pageSetup.pageHeaders?.[page.pageIdx]?.C ?? page.section.pageSetup.headerC ?? ''} onChange={e => saveHeaderFooter({ headerC: e.target.value }, page.pageIdx)} style={{ width: '100%', height: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Arial, sans-serif', fontSize: 14, color: '#000', padding: '0 8px', textAlign: 'center' }} />}
            </div>
            <div style={{ flex: 1, height: '100%' }}>
              {isEditingHeaderFooter && <input id={`header-input-r-${page.pageIdx}`} value={page.section.pageSetup.pageHeaders?.[page.pageIdx]?.R ?? page.section.pageSetup.headerR ?? ''} onChange={e => saveHeaderFooter({ headerR: e.target.value }, page.pageIdx)} style={{ width: '100%', height: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Arial, sans-serif', fontSize: 14, color: '#000', padding: '0 8px', textAlign: 'right' }} />}
            </div>
          </div>
        </div>
        {/* Footer Area */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: page.section.pageSetup.marginBottom, pointerEvents: isEditingHeaderFooter ? 'auto' : 'none' }}>
          {isEditingHeaderFooter && (
            <>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, borderTop: '1px dashed #b2b2b2' }} />
              <div style={{ position: 'absolute', top: 4, right: page.section.pageSetup.marginLeft, fontSize: 11, color: '#b2b2b2', fontFamily: 'sans-serif' }}>Chân trang</div>
            </>
          )}
          <div style={{ position: 'absolute', bottom: page.section.pageSetup.marginBottom / 2, left: page.section.pageSetup.marginLeft, right: page.section.pageSetup.marginRight, display: 'flex', border: isEditingHeaderFooter ? '1px dashed #ccc' : 'none', height: 32, alignItems: 'center' }}>
            <div style={{ flex: 1, borderRight: isEditingHeaderFooter ? '1px dashed #ccc' : 'none', height: '100%' }}>
              {isEditingHeaderFooter && <input id={`footer-input-l-${page.pageIdx}`} value={page.section.pageSetup.pageFooters?.[page.pageIdx]?.L ?? page.section.pageSetup.footerL ?? ''} onChange={e => saveHeaderFooter({ footerL: e.target.value }, page.pageIdx)} style={{ width: '100%', height: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Arial, sans-serif', fontSize: 14, color: '#000', padding: '0 8px' }} />}
            </div>
            <div style={{ flex: 1, borderRight: isEditingHeaderFooter ? '1px dashed #ccc' : 'none', height: '100%' }}>
              {isEditingHeaderFooter && <input id={`footer-input-c-${page.pageIdx}`} value={page.section.pageSetup.pageFooters?.[page.pageIdx]?.C ?? page.section.pageSetup.footerC ?? ''} onChange={e => saveHeaderFooter({ footerC: e.target.value }, page.pageIdx)} style={{ width: '100%', height: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Arial, sans-serif', fontSize: 14, color: '#000', padding: '0 8px', textAlign: 'center' }} />}
            </div>
            <div style={{ flex: 1, height: '100%' }}>
              {isEditingHeaderFooter && <input id={`footer-input-r-${page.pageIdx}`} value={page.section.pageSetup.pageFooters?.[page.pageIdx]?.R ?? page.section.pageSetup.footerR ?? ''} onChange={e => saveHeaderFooter({ footerR: e.target.value }, page.pageIdx)} style={{ width: '100%', height: '100%', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'Arial, sans-serif', fontSize: 14, color: '#000', padding: '0 8px', textAlign: 'right' }} />}
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  };


  // ── Find & Replace panel ───────────────────────────────────────────
  const doFind = useCallback(() => {
    if (!findText) return;
    const txt = findText.toLowerCase();
    for (let pi = caret.paraIdx; pi < doc.paras.length; pi++) {
      const ptext = paraText(doc.paras[pi]);
      const start = pi === caret.paraIdx ? caret.charOffset : 0;
      const idx = ptext.toLowerCase().indexOf(txt, start);
      if (idx !== -1) {
        const anchor = { paraIdx: pi, charOffset: idx };
        const focus  = { paraIdx: pi, charOffset: idx + findText.length };
        setCaret(focus); setSel({ anchor, focus }); focus_(); return;
      }
    }
    // Wrap around
    for (let pi = 0; pi <= caret.paraIdx; pi++) {
      const idx = paraText(doc.paras[pi]).toLowerCase().indexOf(txt);
      if (idx !== -1) {
        const anchor = { paraIdx: pi, charOffset: idx };
        const focus  = { paraIdx: pi, charOffset: idx + findText.length };
        setCaret(focus); setSel({ anchor, focus }); focus_(); return;
      }
    }
  }, [findText, caret, doc]);
  const focus_ = focus;

  const doReplace = useCallback(() => {
    if (!sel || !findText) { doFind(); return; }
    const ns = normalizeSel(sel);
    if (ns.startPara === ns.endPara) {
      const r = deleteSelection(doc, sel);
      const r2 = insertText(r.doc, r.caret, replaceText);
      commit(r2.doc, r2.caret, null);
    }
    doFind();
  }, [sel, findText, replaceText, doc, commit, doFind]);

  return (
    <>
      <style>{`
        @keyframes oxBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        .ox-page { transition: none; }
        @media print {
          @page { margin: 0; }
          /* Hide UI */
          .ox-ribbon, .ox-sidebar, .ox-status-bar, .no-print, #file-menu-overlay, .ox-toolbar {
            display: none !important;
          }
          /* Unconstrain heights so browser prints all pages */
          body, html, #root, .h-screen, .flex-1 {
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            background: #fff !important;
            display: block !important;
          }
          #canvas-editor, #pages-container {
            overflow: visible !important;
            height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            transform: none !important;
          }
          div {
            overflow: visible !important;
          }
          .ox-page-box {
            box-shadow: none !important;
            margin: 0 !important;
            border: none !important;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .page-wrapper {
            page-break-after: always;
            break-after: page;
            height: 100vh !important;
            max-height: 100vh !important;
            overflow: hidden !important;
            display: flex !important;
            justify-content: center !important;
            align-items: flex-start !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .page-wrapper:last-child {
            page-break-after: auto;
            break-after: auto;
          }
        }
      `}</style>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#b0b0b0', minHeight: 0 }}>

        {/* Hidden textarea */}
        <textarea
          ref={inputRef}
          onKeyDown={onKeyDown}
          onInput={onInput}
          onPaste={onPaste}
          onCompositionStart={onCompositionStart}
          onCompositionUpdate={onCompositionUpdate}
          onCompositionEnd={onCompositionEnd}
          style={{ position: 'fixed', top: -9999, left: -9999, width: 1, height: 1, opacity: 0, resize: 'none', border: 'none', padding: 0 }}
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
        />

        {/* Find & Replace Panel */}
        {showFind && (
          <div style={{
            position: 'absolute', top: 80, right: 16, zIndex: 1000,
            background: '#fff', border: '1px solid #ccc', borderRadius: 6,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)', padding: 12, width: 320,
            fontFamily: 'Segoe UI, sans-serif', fontSize: 13,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <strong>Find & Replace</strong>
              <button onClick={() => setShowFind(false)} style={{ border: 'none', background: 'none', fontSize: 16, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ fontSize: 11, color: '#666' }}>Find:</label>
              <input value={findText} onChange={e => setFindText(e.target.value)} onKeyDown={e => e.key === 'Enter' && doFind()}
                style={{ display: 'block', width: '100%', border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', marginTop: 4, fontSize: 13, boxSizing: 'border-box' }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 11, color: '#666' }}>Replace with:</label>
              <input value={replaceText} onChange={e => setReplaceText(e.target.value)} onKeyDown={e => e.key === 'Enter' && doReplace()}
                style={{ display: 'block', width: '100%', border: '1px solid #ccc', borderRadius: 3, padding: '4px 8px', marginTop: 4, fontSize: 13, boxSizing: 'border-box' }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={doFind} style={{ flex: 1, padding: '6px 0', border: '1px solid #2b579a', borderRadius: 3, background: '#fff', color: '#2b579a', cursor: 'pointer', fontSize: 12 }}>Find Next</button>
              <button onClick={doReplace} style={{ flex: 1, padding: '6px 0', border: 'none', borderRadius: 3, background: '#2b579a', color: '#fff', cursor: 'pointer', fontSize: 12 }}>Replace</button>
            </div>
          </div>
        )}

        {/* Rulers and Canvas Container */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', minHeight: 0 }}>
          
          <div className="no-print" style={{ display: 'flex', flexShrink: 0 }}>
            {/* Top-Left Corner Spacer */}
            <div style={{ width: 14, height: 14, background: '#e5e7eb', borderRight: '1px solid #d1d5db', borderBottom: '1px solid #d1d5db', flexShrink: 0 }} />
            
            <HorizontalRuler 
              ref={hRulerRef}
              zoom={zoom}
              pageWidth={PW}
              marginLeft={marginLeft}
              marginRight={marginRight}
            />
          </div>
          
          <div style={{ display: 'flex', flex: 1, overflow: 'hidden', minHeight: 0 }}>
            <div className="no-print">
              <VerticalRuler 
                ref={vRulerRef}
                zoom={zoom}
                pageHeight={PH}
                marginTop={marginTop}
                marginBottom={marginBottom}
                pageCount={pages.length}
                pageGap={PAGE_GAP}
              />
            </div>
            
            {/* Scrollable canvas */}
            <div
              id="canvas-editor"
              ref={scrollRef}
              onScroll={onScroll}
              onMouseDown={focus}
              style={{ flex: 1, overflowY: 'auto', overflowX: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 24, paddingBottom: 48 }}
            >
          {/* Virtual spacer top */}
          <div className="no-print" style={{ width: PW, height: pages.slice(0, vis.start).reduce((acc, p) => acc + (p.section.pageSetup.height + PAGE_GAP) * zoom, 0), flexShrink: 0 }} />

          <div id="pages-container" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {(isPrinting ? pages : pages.slice(vis.start, vis.end)).map(renderPageWrapper)}
          </div>

          {/* Virtual spacer bottom */}
          <div className="no-print" style={{ width: PW, height: pages.slice(vis.end).reduce((acc, p) => acc + (p.section.pageSetup.height + PAGE_GAP) * zoom, 0), flexShrink: 0 }} />

          {/* SmartArt Inline Editing Overlay */}
          {editingSmartArtNode && (() => {
            const { saId, nodeId } = editingSmartArtNode;
            const node = doc.smartArts?.[saId]?.nodes?.[nodeId];
            if (!node) return null;

            return (
               <div style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'white',
                  padding: 16,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  borderRadius: 8,
                  zIndex: 99999,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8
               }}>
                 <div style={{fontSize: 12, fontWeight: 'bold'}}>Edit Node Text</div>
                 <textarea
                   autoFocus
                   defaultValue={node.text}
                   onBlur={(e) => {
                     const newText = e.target.value;
                     const newDoc = { ...doc, smartArts: { ...doc.smartArts } };
                     const sa = { 
                       ...newDoc.smartArts[saId], 
                       nodes: {
                         ...newDoc.smartArts[saId].nodes,
                         [nodeId]: { ...newDoc.smartArts[saId].nodes[nodeId], text: newText }
                       } 
                     };
                     newDoc.smartArts[saId] = sa;
                     commit(newDoc, caret, sel);
                     setEditingSmartArtNode(null);
                   }}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                       e.preventDefault();
                       e.currentTarget.blur();
                     }
                   }}
                   style={{ width: 200, height: 60, border: '1px solid #ccc', borderRadius: 4, padding: 4 }}
                 />
                 <div style={{fontSize: 10, color: '#666'}}>Press Enter to save.</div>
               </div>
            );
          })()}
        </div>
        </div>
        </div>

      </div>

      {showDrawingModal && (
        <DrawingModal 
          onClose={() => setShowDrawingModal(false)}
          onSave={() => setShowDrawingModal(false)}
        />
      )}
    </>
  );
}
