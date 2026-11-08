import React from 'react';
import type { DocModel, Caret, SelRange } from '../document/DocumentTypes';
import { getCachedImage } from './ImageCache';
import { PageBox } from '../pagination/PaginationTypes';
import { LayoutEngine } from '../layout/LayoutEngine';
import { HitTestEngine } from '../hittest/HitTestEngine';
import { LayoutResult } from '../layout/LayoutTypes';
import { paraLen, normalizeSel } from '../document/DocumentEngine';
import { SmartArtRenderer } from '../document/smartart/SmartArtRenderer';
import { Measurer, DEF_FONT, DEF_SIZE, PT_PX, BULLET_INDENT } from '../layout/Measurer';
import { MiniToolbar } from '../MiniToolbar';

const LIST_BULLETS = ['•', '◦', '▪'];

export const IMAGE_TOOLBAR_ACTIONS = [
  { label: '↺', title: 'Xoay trái 90°', action: 'rotateLeft' as const },
  { label: '↻', title: 'Xoay phải 90°', action: 'rotateRight' as const },
  { label: '↔', title: 'Lật ngang', action: 'flipH' as const },
  { label: '↕', title: 'Lật dọc', action: 'flipV' as const },
  { label: '🗑', title: 'Xóa ảnh', action: 'delete' as const },
] as const;

// Floating image toolbar — rendered in CanvasEditor via portal
export function ImageToolbar({ onAction }: {
  onAction: (action: typeof IMAGE_TOOLBAR_ACTIONS[number]['action']) => void;
}) {
  return (
    <div
      style={{
        display: 'flex', gap: 3,
        background: '#1e293b', borderRadius: 8, padding: '4px 6px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)',
        userSelect: 'none',
      }}
      onMouseDown={e => e.stopPropagation()}
    >
      {IMAGE_TOOLBAR_ACTIONS.map(btn => (
        <button
          key={btn.action}
          title={btn.title}
          onMouseDown={e => { e.stopPropagation(); onAction(btn.action); }}
          style={{
            background: btn.action === 'delete' ? '#ef4444' : '#475569',
            border: 'none', borderRadius: 5,
            color: '#fff', cursor: 'pointer',
            fontSize: 14, padding: '3px 9px',
            fontFamily: 'sans-serif',
            lineHeight: '1.5',
          }}
        >{btn.label}</button>
      ))}
    </div>
  );
}

function ImageToken({
  src, w, h, transform, isSelected, tokX, lineHeight, onSelect, onAction
}: {
  src: string;
  w: number;
  h: number;
  transform: string;
  isSelected: boolean;
  tokX: number;
  lineHeight: number;
  onSelect: (e: React.MouseEvent) => void;
  onAction?: (action: 'rotateLeft' | 'rotateRight' | 'flipH' | 'flipV' | 'delete') => void;
}) {
  return (
    <span
      style={{
        position: 'absolute',
        left: tokX,
        top: Math.max(0, lineHeight - h),
        width: w,
        height: h,
        display: 'inline-block',
        cursor: 'pointer',
        outline: isSelected ? '2px solid #2563eb' : 'none',
        outlineOffset: '1px',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(e);
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transform,
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </span>
  );
}

export interface RenderPageProps {
  page: PageBox;
  pages: PageBox[];
  doc: DocModel;
  layout: LayoutResult;
  sel: SelRange | null;
  caret: Caret | null;
  sc: { pageIdx: number; x: number; localY: number; height: number } | null;
  zoom: number;
  formatMarks: boolean;
  onMouseDown: (e: React.MouseEvent, pageIdx: number) => void;
  onMouseMove: (e: React.MouseEvent, pageIdx: number) => void;
  forceUpdate: () => void;
  vis: { start: number, end: number };
  showMiniToolbar?: boolean;
  setShowMiniToolbar?: (show: boolean) => void;
  selectedImage?: { paraIdx: number; runIdx: number } | null;
  onImageClick?: (paraIdx: number, runIdx: number, e: React.MouseEvent) => void;
  onImageAction?: (action: 'rotateLeft' | 'rotateRight' | 'flipH' | 'flipV' | 'delete', paraIdx: number, runIdx: number) => void;
  selectedSmartArtId?: string;
  selectedSmartArtNodeId?: string;
  onSmartArtClick?: (saId: string, nodeId?: string) => void;
  onSmartArtDoubleClick?: (saId: string, nodeId: string, x: number, y: number, w: number, h: number) => void;
  isEditingHeaderFooter?: boolean;
}

function renderPageImpl(props: RenderPageProps): React.ReactNode {
    const { page, pages, doc, layout, sel, sc, formatMarks, onMouseDown, onMouseMove, forceUpdate, vis, showMiniToolbar, setShowMiniToolbar, selectedImage, onImageClick, onImageAction, selectedSmartArtId, selectedSmartArtNodeId, onSmartArtClick, onSmartArtDoubleClick, isEditingHeaderFooter } = props;
    if (!page) return null;
    const pi = page.pageIdx;
    
    // Check visibility
    const isVisible = pi >= vis.start && pi < vis.end;
    
    const sectionSetup = page.section?.pageSetup || doc.sections?.[0]?.pageSetup || {};
    const pageSetup = {
      width: sectionSetup.width ?? 816,
      height: sectionSetup.height ?? 1056,
      marginTop: sectionSetup.marginTop ?? 96,
      marginBottom: sectionSetup.marginBottom ?? 96,
      marginLeft: sectionSetup.marginLeft ?? 96,
      marginRight: sectionSetup.marginRight ?? 96,
      cols: sectionSetup.cols ?? 1,
      colLayout: sectionSetup.colLayout ?? 'equal',
      lineNumbers: sectionSetup.lineNumbers || doc.sections?.[0]?.pageSetup?.lineNumbers || 'none',
      lineNumberStart: sectionSetup.lineNumberStart || 1,
      lineNumberStep: sectionSetup.lineNumberStep || 1,
      pageBorder: sectionSetup.pageBorder || doc.sections?.[0]?.pageSetup?.pageBorder,
      pageColor: sectionSetup.pageColor || doc.sections?.[0]?.pageSetup?.pageColor,
      headerL: sectionSetup.pageHeaders?.[pi]?.L ?? sectionSetup.headerL ?? doc.sections?.[0]?.pageSetup?.headerL,
      headerC: sectionSetup.pageHeaders?.[pi]?.C ?? sectionSetup.headerC ?? doc.sections?.[0]?.pageSetup?.headerC,
      headerR: sectionSetup.pageHeaders?.[pi]?.R ?? sectionSetup.headerR ?? doc.sections?.[0]?.pageSetup?.headerR,
      footerL: sectionSetup.pageFooters?.[pi]?.L ?? sectionSetup.footerL ?? doc.sections?.[0]?.pageSetup?.footerL,
      footerC: sectionSetup.pageFooters?.[pi]?.C ?? sectionSetup.footerC ?? doc.sections?.[0]?.pageSetup?.footerC,
      footerR: sectionSetup.pageFooters?.[pi]?.R ?? sectionSetup.footerR ?? doc.sections?.[0]?.pageSetup?.footerR
    };
    const {
      width: PW = 816,
      height: PH = 1056,
      marginTop = 96,
      marginBottom = 96,
      marginLeft = 96,
      marginRight = 96
    } = pageSetup;
    
    const printH = Math.max(100, PH - marginTop - marginBottom);
    const PAGE_GAP = 24;
    
    const selRects = sel && isVisible ? (HitTestEngine.get().getSelectionRects(sel, layout, pageSetup, page.pageIdx, pages) || []) : [];

    return (
      <div
        key={pi}
        className="ox-page-box"
        onMouseDown={e => onMouseDown(e, pi)}
        onMouseMove={e => onMouseMove(e, pi)}
        style={{
          position: 'relative', width: PW, height: PH,
          background: pageSetup.pageColor || '#fff',
          boxShadow: '0 2px 14px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.07)',
          marginBottom: PAGE_GAP, flexShrink: 0, cursor: 'text',
          overflow: 'hidden', userSelect: 'none',
        }}
      >
        {isVisible && (
          <>
            {/* Page Border Overlay */}
            {pageSetup.pageBorder && (() => {
              const pb = pageSetup.pageBorder;
              const applyTo = pb.applyTo || 'all';
              if (applyTo === 'firstPage' && pi !== 0) return null;
              if (applyTo === 'exceptFirstPage' && pi === 0) return null;

              const bStyle = pb.style || 'solid';
              const bWidth = `${pb.width || 1}px`;
              const bColor = pb.color || '#000000';
              const inset = 18;

              return (
                <div
                  style={{
                    position: 'absolute',
                    top: inset,
                    bottom: inset,
                    left: inset,
                    right: inset,
                    pointerEvents: 'none',
                    zIndex: 20,
                    borderTop: pb.top ? `${bWidth} ${bStyle} ${bColor}` : 'none',
                    borderBottom: pb.bottom ? `${bWidth} ${bStyle} ${bColor}` : 'none',
                    borderLeft: pb.left ? `${bWidth} ${bStyle} ${bColor}` : 'none',
                    borderRight: pb.right ? `${bWidth} ${bStyle} ${bColor}` : 'none',
                  }}
                />
              );
            })()}

            {/* Printable area */}
            <div style={{ position: 'absolute', top: marginTop, left: marginLeft, width: Math.max(100, PW - marginLeft - marginRight), height: printH, overflow: 'visible' }}>
              
              {/* Column dividers */}
              {(() => {
                const setup = pageSetup;
                const cols = Math.max(1, setup.cols || 1);
                if (cols <= 1) return null;
                const gap = 18;
                const totalW = Math.max(100, PW - marginLeft - marginRight);
                const colLefts: number[] = [];
                if (setup.colLayout === 'left') {
                  const w1 = (totalW - gap) * 0.35;
                  colLefts.push(w1 + gap / 2);
                } else if (setup.colLayout === 'right') {
                  const w1 = (totalW - gap) * 0.65;
                  colLefts.push(w1 + gap / 2);
                } else {
                  const w = (totalW - (cols - 1) * gap) / cols;
                  for (let i = 1; i < cols; i++) {
                    colLefts.push(i * (w + gap) - gap / 2);
                  }
                }
                return colLefts.map((x, i) => (
                  <div key={`col-div-${i}`} style={{
                    position: 'absolute',
                    left: x,
                    top: 0,
                    width: 1,
                    height: printH,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    pointerEvents: 'none',
                    zIndex: 0,
                  }} />
                ));
              })()}

              {/* Selection highlights */}
              {selRects.map((r, ri) => (
                <div key={`sel-${ri}`} className="ox-selection" style={{
                  position: 'absolute',
                  left: r.x, top: r.y,
                  width: r.w, height: r.h,
                  backgroundColor: 'rgba(173, 214, 255, 0.5)',
                  pointerEvents: 'none', zIndex: 10
                }} />
              ))}

              {/* Table Selection Handle */}
              {Array.from(new Set(page.lines.map(l => doc.paras[l.paraIdx]?.fmt.tableId).filter(Boolean))).map(tId => {
                const firstParaIdx = page.lines.find(l => doc.paras[l.paraIdx]?.fmt.tableId === tId)?.paraIdx;
                if (firstParaIdx === undefined) return null;
                const para = doc.paras[firstParaIdx];
                if (para.fmt.tableRowIdx !== 0 || para.fmt.tableColIdx !== 0) return null; // Only show on first cell

                const pLines = page.lines.filter(l => l.paraIdx === firstParaIdx);
                const firstY = pLines[0].y - pi * printH;
                const left = 0; // The table starts at left=0 (leftIndent=0 for first col usually)

                return (
                  <div key={`th-${tId}`} 
                    style={{
                      position: 'absolute',
                      top: firstY - 14,
                      left: left - 14,
                      width: 14,
                      height: 14,
                      background: '#fff',
                      border: '1px solid #ccc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'move',
                      zIndex: 10
                    }}
                    title="Select/Move Table"
                    onMouseDown={e => {
                      // Trigger table selection
                      e.stopPropagation();
                      e.preventDefault();
                      import('../editorApi').then(({ EditorAPI }) => {
                        const legacy = EditorAPI.getLegacy() as any;
                        legacy?.selectTable?.(tId);
                      });
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12H3M12 3v18M16 8l-4-4-4 4M8 16l4 4 4-4"/></svg>
                  </div>
                );
              })}

              {/* Paragraph Shading and Borders */}
              {(() => {
                const groups: { key: string; paraIdx: number; allParaIndices: number[] }[] = [];
                const seenCellIds = new Set<string>();

                const pageParaIndices = Array.from(new Set(page.lines.map(l => l.paraIdx)));

                for (const pIdx of pageParaIndices) {
                  const p = doc.paras[pIdx];
                  if (!p) continue;
                  if (p.fmt?.tableId && p.fmt?.tableCellId) {
                    const cId = p.fmt.tableCellId;
                    if (!seenCellIds.has(cId)) {
                      seenCellIds.add(cId);
                      const allInCell: number[] = [];
                      for (let i = 0; i < doc.paras.length; i++) {
                        if (doc.paras[i].fmt?.tableCellId === cId) {
                          allInCell.push(i);
                        }
                      }
                      groups.push({ key: `cell-${cId}`, paraIdx: pIdx, allParaIndices: allInCell });
                    }
                  } else {
                    groups.push({ key: `para-${pIdx}`, paraIdx: pIdx, allParaIndices: [pIdx] });
                  }
                }

                // Compute row max heights for tables
                const maxRowHeights: Record<string, Record<number, number>> = {};
                for (const group of groups) {
                  const p = doc.paras[group.paraIdx];
                  if (p?.fmt?.tableId && p.fmt.tableRowIdx !== undefined) {
                    const tId = p.fmt.tableId;
                    const rIdx = p.fmt.tableRowIdx;
                    const allLines = page.lines.filter(l => group.allParaIndices.includes(l.paraIdx));
                    let cellH = p.fmt.minRowHeight || 20;
                    if (allLines.length) {
                      const fY = allLines[0].y - pi * printH;
                      const lY = allLines[allLines.length - 1].y - pi * printH + allLines[allLines.length - 1].height;
                      cellH = Math.max(lY - fY, cellH);
                    } else {
                      const pLayout = layout.paras[group.paraIdx];
                      if (pLayout) {
                        cellH = Math.max(pLayout.height || 20, cellH);
                      }
                    }
                    if (!maxRowHeights[tId]) maxRowHeights[tId] = {};
                    maxRowHeights[tId][rIdx] = Math.max(maxRowHeights[tId][rIdx] || 0, cellH);
                  }
                }

                return groups.map(group => {
                  const paraIdx = group.paraIdx;
                  const allLines = page.lines.filter(l => group.allParaIndices.includes(l.paraIdx));
                  const para = doc.paras[paraIdx];
                  if (!para) return null;
                  const fmt = para.fmt || {};
                  const isTable = !!fmt.tableId;
                  if (!allLines.length && !isTable) return null;
                  if (!fmt.shading && !fmt.borders && !isTable) return null;
                  
                  let firstY = 0;
                  let lastY = 20;
                  if (allLines.length) {
                    firstY = allLines[0].y - pi * printH;
                    const lastLine = allLines[allLines.length - 1];
                    lastY = lastLine.y - pi * printH + lastLine.height;
                  } else {
                    firstY = (layout.paras[paraIdx]?.y || 0) - pi * printH;
                    lastY = firstY + (layout.paras[paraIdx]?.height || 20);
                  }
                  
                  let height = Math.max(lastY - firstY, fmt.minRowHeight || 0);
                  if (isTable && fmt.tableId && fmt.tableRowIdx !== undefined) {
                    const tId = fmt.tableId;
                    const rIdx = fmt.tableRowIdx;
                    const rSpan = fmt.tableRowSpan || 1;
                    let sumH = 0;
                    for (let r = rIdx; r < rIdx + rSpan; r++) {
                      sumH += maxRowHeights[tId]?.[r] || height;
                    }
                    height = Math.max(height, sumH);
                  }
                 
                 let left = fmt.leftIndent || 0;
                 let right = fmt.rightIndent || 0;
                 let width: string | number = 'auto';
                 let b = isTable ? (fmt.tableBorders || {}) : (fmt.borders || {});
                 // For tables: use custom shading (user-set) if available, otherwise fall back to theme tableBg
                 let shading = isTable ? (fmt.shading || fmt.tableBg) : fmt.shading;

                 if (isTable && fmt.tableColWidths && fmt.tableColIdx !== undefined) {
                    const cIdx = fmt.tableColIdx;
                    const cSpan = fmt.tableColSpan || 1;
                    const colWidths = fmt.tableColWidths;

                    const parentLeft = colWidths.slice(0, cIdx).reduce((a, b) => a + b, 0);
                    const parentWidth = colWidths.slice(cIdx, cIdx + cSpan).reduce((a, b) => a + b, 0);

                    const subCols = fmt.tableSubCols || 1;
                    const subCIdx = fmt.tableSubColIdx || 0;

                    width = parentWidth / subCols;
                    left = parentLeft + subCIdx * width;
                    right = 0; // overrides rightIndent for tables
                   
                   // Dynamic Table Styling
                   const styleId = fmt.tableStyleId;
                   if (styleId) {
                     const rIdx = fmt.tableRowIdx || 0;
                     const cIdx = fmt.tableColIdx || 0;
                     const isHeader = fmt.tableHeaderRow && rIdx === 0;
                     const isBanded = fmt.tableBandedRows && (rIdx % 2 !== 0);
                     const isBandedCol = fmt.tableBandedColumns && (cIdx % 2 !== 0);
                     const isFirstCol = fmt.tableFirstColumn && cIdx === 0;
                     
                     let maxR = 0;
                     let maxC = 0;
                     const tId = fmt.tableId;
                     if (tId) {
                       for (let i = 0; i < doc.paras.length; i++) {
                         const p = doc.paras[i];
                         if ((p.fmt || {}).tableId === tId) {
                           if (((p.fmt || {}).tableRowIdx || 0) > maxR) maxR = (p.fmt || {}).tableRowIdx!;
                           if (((p.fmt || {}).tableColIdx || 0) > maxC) maxC = (p.fmt || {}).tableColIdx!;
                         }
                       }
                     }
                     const isLastRow = rIdx === maxR;
                     const isLastCol = cIdx === maxC;
                     
                     let baseStyle = styleId;
                     let theme = 'slate';
                     if (styleId.startsWith('BlueStyle')) { theme = 'blue'; baseStyle = styleId.replace('BlueStyle', 'Style'); }
                     if (styleId.startsWith('GreenStyle')) { theme = 'green'; baseStyle = styleId.replace('GreenStyle', 'Style'); }

                     let baseColor = '#ffffff';
                     let altColor = '#f1f5f9';
                     let headColor = '#334155';
                     let firstColColor = '#f1f5f9';
                     let borderColor = '#94a3b8';

                     if (theme === 'blue') {
                       headColor = '#1d4ed8';
                       altColor = '#eff6ff';
                       firstColColor = '#eff6ff';
                       borderColor = '#60a5fa';
                     } else if (theme === 'green') {
                       headColor = '#15803d';
                       altColor = '#f0fdf4';
                       firstColColor = '#f0fdf4';
                       borderColor = '#4ade80';
                     }

                     if (!shading) {
                       if (isHeader) shading = headColor;
                       else if (isFirstCol) shading = firstColColor;
                       else if (isBanded || isBandedCol) shading = altColor;
                       else shading = baseColor;
                     }

                   let bTheme: any = {
                     top: { width: 1, style: 'none', color: borderColor },
                     bottom: { width: 1, style: 'none', color: borderColor },
                     left: { width: 1, style: 'none', color: borderColor },
                     right: { width: 1, style: 'none', color: borderColor }
                   };

                   if (!fmt.tableBorders) {
                     if (baseStyle === 'Style1') {
                       if (isHeader) bTheme.bottom = { width: 1, style: 'solid', color: borderColor };
                     } else if (baseStyle === 'Style2' || baseStyle === 'Style4') {
                       bTheme.top.style = rIdx === 0 ? 'solid' : 'solid';
                       bTheme.bottom.style = isLastRow ? 'solid' : 'solid';
                     } else if (baseStyle === 'Style3') {
                       bTheme.top.style = 'dashed'; bTheme.bottom.style = 'dashed';
                       bTheme.left.style = 'dashed'; bTheme.right.style = 'dashed';
                       if (isHeader) bTheme.bottom.style = 'dashed';
                     } else if (baseStyle === 'Style5') {
                       if (rIdx === 0) bTheme.top.style = 'solid';
                       if (isLastRow) bTheme.bottom.style = 'solid';
                       if (isHeader) bTheme.bottom.style = 'solid';
                       if (cIdx === 0) bTheme.right.style = 'solid';
                       if (cIdx === 1) bTheme.left.style = 'solid';
                     } else if (baseStyle === 'Style6') {
                       bTheme.left.style = 'solid'; bTheme.right.style = 'solid';
                       bTheme.top.style = rIdx === 0 ? 'solid' : 'dashed';
                       bTheme.bottom.style = isLastRow ? 'solid' : 'dashed';
                       if (isHeader) bTheme.bottom.style = 'solid';
                     } else if (baseStyle === 'Style7') {
                       bTheme.top.style = 'solid'; bTheme.bottom.style = 'solid'; bTheme.left.style = 'solid'; bTheme.right.style = 'solid';
                       if (isHeader) {
                         if (cIdx > 0) bTheme.left.color = '#ffffff';
                         if (!isLastCol) bTheme.right.color = '#ffffff';
                       }
                     }
                   }

                   // Merge custom borders on top of theme borders
                   const cb = fmt.borders || {};
                   b = {
                     top: cb.top !== undefined ? cb.top : bTheme.top,
                     bottom: cb.bottom !== undefined ? cb.bottom : bTheme.bottom,
                     left: cb.left !== undefined ? cb.left : bTheme.left,
                     right: cb.right !== undefined ? cb.right : bTheme.right
                   };
                   
                   const subCols = fmt.tableSubCols || 1;
                   const subCIdx = fmt.tableSubColIdx || 0;
                   const subRows = fmt.tableSubRows || 1;
                   const subRIdx = fmt.tableSubRowIdx || 0;

                   if (subCols > 1 && subCIdx < subCols - 1) {
                     b.right = { width: 1, style: 'solid' as any, color: borderColor };
                   }
                   if (subRows > 1 && subRIdx < subRows - 1) {
                     b.bottom = { width: 1, style: 'solid' as any, color: borderColor };
                   }
                 }
               }

                 let isCellSelected = false;
                 if (sel && isTable) {
                   const ns = normalizeSel(sel);
                   const startP = doc.paras[ns.startPara];
                   const endP = doc.paras[ns.endPara];

                   if ((startP?.fmt || {}).tableId && (endP?.fmt || {}).tableId && (startP.fmt || {}).tableId === fmt.tableId) {
                     const startRow = (startP.fmt || {}).tableRowIdx ?? 0;
                     const endRow = (endP.fmt || {}).tableRowIdx ?? 0;
                     const startCol = (startP.fmt || {}).tableColIdx ?? 0;
                     const endCol = (endP.fmt || {}).tableColIdx ?? 0;

                     const minRow = Math.min(startRow, endRow);
                     const maxRow = Math.max(startRow, endRow);
                     const minCol = Math.min(startCol, endCol);
                     const maxCol = Math.max(startCol, endCol);

                     const rIdx = fmt.tableRowIdx ?? 0;
                     const cIdx = fmt.tableColIdx ?? 0;

                     if (rIdx >= minRow && rIdx <= maxRow && cIdx >= minCol && cIdx <= maxCol) {
                       isCellSelected = true;
                     }
                   } else {
                     isCellSelected = paraIdx >= ns.startPara && paraIdx <= ns.endPara;
                   }
                 }

                 if (fmt.isCovered) return null;

                 const subRows = fmt.tableSubRows || 1;
                 const subRIdx = fmt.tableSubRowIdx || 0;
                 let cellHeight = height / subRows;
                 let cellY = firstY + subRIdx * cellHeight;

                 const rSpan = fmt.tableRowSpan || 1;
                 if (rSpan > 1 && isTable && fmt.tableId) {
                   const rIdx = fmt.tableRowIdx || 0;
                   const targetRowEnd = rIdx + rSpan - 1;
                   let maxBottom = firstY + height;

                   for (let i = 0; i < doc.paras.length; i++) {
                     const p = doc.paras[i];
                     if ((p.fmt || {}).tableId === fmt.tableId) {
                       const pRIdx = (p.fmt || {}).tableRowIdx ?? 0;
                       if (pRIdx >= rIdx && pRIdx <= targetRowEnd) {
                         const pY = layout.paras[i]?.y ?? 0;
                         const pH = layout.paras[i]?.height ?? 24;
                         if (pY + pH > maxBottom) {
                           maxBottom = pY + pH;
                         }
                       }
                     }
                   }
                   cellHeight = maxBottom - firstY;
                 }

                 return (
                   <div key={`bg-${pi}-${paraIdx}`} style={{
                     position: 'absolute',
                     top: cellY,
                     left: left,
                     right: width === 'auto' ? right : undefined,
                     width: width !== 'auto' ? width : undefined,
                     height: cellHeight,
                     backgroundColor: shading || 'transparent',
                     borderTop: b.top ? `${b.top.width}px ${b.top.style==='thick'?'solid':b.top.style} ${b.top.color}` : 'none',
                     borderBottom: b.bottom ? `${b.bottom.width}px ${b.bottom.style==='thick'?'solid':b.bottom.style} ${b.bottom.color}` : 'none',
                     borderLeft: b.left ? `${b.left.width}px ${b.left.style==='thick'?'solid':b.left.style} ${b.left.color}` : 'none',
                     borderRight: b.right ? `${b.right.width}px ${b.right.style==='thick'?'solid':b.right.style} ${b.right.color}` : 'none',
                     boxSizing: 'border-box',
                   }}>
                     {isCellSelected && (
                       <div style={{
                         position: 'absolute',
                         top: 0, left: 0, right: 0, bottom: 0,
                         backgroundColor: 'rgba(180, 213, 255, 0.45)',
                         border: '1.5px solid #2b579a',
                         boxSizing: 'border-box',
                         pointerEvents: 'none',
                         zIndex: 5
                       }} />
                     )}
                   </div>
                 );
               });
             })()}

              {/* Text lines */}
              {page.lines.map(line => {
                 let lineLocalY = line.yVisual !== undefined ? (line.yVisual - marginTop) : (line.y - pi * printH);
                 let lineLeft = line.xOffset || 0;
                 const para = doc.paras[line.paraIdx];
                 if (para?.fmt?.isCovered) return null;

                 if (para?.fmt?.tableId && para?.fmt?.cellVAlign) {
                   const vAlign = para.fmt.cellVAlign;
                   const paraH = layout.paras[line.paraIdx]?.height || line.height;
                   const rowH = para.fmt.minRowHeight || 28;
                   if (vAlign === 'middle') {
                     lineLocalY += Math.max(0, (rowH - paraH) / 2);
                   } else if (vAlign === 'bottom') {
                     lineLocalY += Math.max(0, rowH - paraH - 4);
                   }
                 }
                const { listType, listLevel = 0 } = para?.fmt ?? {};

                return (
                  <div key={`${pi}-${line.paraIdx}-${line.lineIdx}`}
                    style={{ position: 'absolute', top: lineLocalY, left: lineLeft, right: 0, height: line.height, overflow: 'visible' }}>
                    
                    {/* Line Number Marker */}
                    {pageSetup.lineNumbers && pageSetup.lineNumbers !== 'none' && !para?.fmt?.suppressLineNumbers && (() => {
                      const mode = pageSetup.lineNumbers;
                      let num = 1;
                      if (mode === 'restart-page') {
                        num = page.lines.indexOf(line) + 1;
                      } else {
                        let prevLinesCount = 0;
                        for (let p = 0; p < pi; p++) {
                          prevLinesCount += pages[p]?.lines?.length || 0;
                        }
                        num = prevLinesCount + page.lines.indexOf(line) + 1;
                      }
                      return (
                        <span style={{
                          position: 'absolute',
                          left: -28,
                          top: 0,
                          height: line.height,
                          lineHeight: `${line.height}px`,
                          fontSize: '11px',
                          fontFamily: 'Consolas, monospace',
                          color: '#64748b',
                          userSelect: 'none',
                          pointerEvents: 'none'
                        }}>
                          {num}
                        </span>
                      );
                    })()}

                    {/* Bullet / number prefix */}
                    {listType && line.lineIdx === 0 && (() => {
                      const fmt = para.fmt || {};
                      const bType = fmt.bulletType || 'symbol';
                      const bChar = fmt.bulletChar || (listType === 'bullet' ? LIST_BULLETS[listLevel % LIST_BULLETS.length] : layout.paras[line.paraIdx]?.numberStr || `${listLevel + 1}.`);
                      const bFont = fmt.bulletFont || 'Calibri, sans-serif';
                      const bColor = fmt.bulletColor || '#222';
                      const bSize = ((fmt.bulletSize ?? 100) / 100) * (DEF_SIZE * PT_PX);
                      
                      if (bType === 'image' && fmt.bulletImage) {
                        const img = getCachedImage(fmt.bulletImage, forceUpdate);
                        return (
                          <img 
                            src={img?.src} 
                            style={{
                              position: 'absolute',
                              left: (listLevel + 1) * BULLET_INDENT - 16,
                              top: (line.height - bSize) / 2,
                              width: bSize, height: bSize,
                              objectFit: 'contain'
                            }} 
                            alt="*"
                          />
                        );
                      }
                      
                      return (
                        <span style={{
                          position: 'absolute',
                          left: (listLevel + 1) * BULLET_INDENT - 16,
                          top: 0, height: line.height, lineHeight: `${line.height}px`,
                          fontSize: bSize + 'px',
                          fontFamily: bFont,
                          color: bColor,
                        }}>
                          {bChar}
                        </span>
                      );
                    })()}

                    {/* Tokens */}
                    {line.tokens.map((tok, ti) => {
                      const f = tok.fmt;
                      if (f.hiddenText) return null;

                      const shift = f.superscript ? -4 : f.subscript ? 3 : (f.baselineShift ?? 0);
                      const scale = (f.superscript || f.subscript) ? 0.75 : 1;
                      
                      let textDecoration = [];
                      if (f.underline && !f.doubleUnderline) textDecoration.push('underline');
                      if (f.doubleUnderline) textDecoration.push('underline double');
                      if (f.strike && !f.doubleStrike) textDecoration.push('line-through');
                      if (f.doubleStrike) textDecoration.push('line-through double');

                      const textShadows = [];
                      if (f.effects?.shadow) textShadows.push('2px 2px 3px rgba(0,0,0,0.4)');
                      if (f.effects?.glow) textShadows.push('0 0 5px rgba(0,100,255,0.8)');
                      if (f.effects?.emboss) textShadows.push('-1px -1px 1px rgba(255,255,255,0.7), 1px 1px 2px rgba(0,0,0,0.6)');
                      if (f.effects?.engrave) textShadows.push('-1px -1px 1px rgba(0,0,0,0.6), 1px 1px 1px rgba(255,255,255,0.7)');

                      const fontFeatures = [];
                      if (f.typography?.kerning === false) fontFeatures.push('"kern" 0');
                      if (f.typography?.ligatures === false) fontFeatures.push('"liga" 0');
                      if (f.smallCaps) fontFeatures.push('"smcp" 1');
                      
                      let textToRender = tok.text;
                      if (f.allCaps) textToRender = textToRender.toUpperCase();

                      if (f.inlineSmartArtId && doc.smartArts?.[f.inlineSmartArtId]) {
                        const saId = f.inlineSmartArtId;
                        const sa = doc.smartArts[saId];
                        return (
                          <span
                            key={`sa-${line.paraIdx}-${line.lineIdx}-${ti}`}
                            style={{ display: 'inline-block', position: 'relative' }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                              onSmartArtClick?.(saId);
                            }}
                          >
                            <SmartArtRenderer 
                              smartArt={sa} 
                              width={400} 
                              height={300} 
                              selectedNodeId={selectedSmartArtId === saId ? selectedSmartArtNodeId : undefined}
                              onNodeClick={(nodeId) => {
                                onSmartArtClick?.(saId, nodeId);
                              }}
                              onNodeDoubleClick={(nodeId, x, y, w, h) => {
                                onSmartArtDoubleClick?.(saId, nodeId, x, y, w, h);
                              }}
                            />
                          </span>
                        );
                      }

                      if (f.inlineImage) {
                        const rot = f.imageRotation ?? 0;
                        const flipH = f.imageFlipH ?? false;
                        const flipV = f.imageFlipV ?? false;
                        const w = f.imageWidth ?? 100;
                        const h = f.imageHeight ?? 100;
                        const transform = `rotate(${rot}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`;

                        const para = doc.paras[line.paraIdx];
                        let runIdx = -1;
                        let charCount = 0;
                        if (para) {
                          for (let ri = 0; ri < para.runs.length; ri++) {
                            charCount += para.runs[ri].text.length;
                            if (charCount > tok.charStart) { runIdx = ri; break; }
                          }
                        }
                        const isSelected = selectedImage?.paraIdx === line.paraIdx && selectedImage?.runIdx === runIdx;

                        return (
                          <ImageToken
                            key={ti}
                            src={f.inlineImage}
                            w={w} h={h}
                            transform={transform}
                            isSelected={isSelected}
                            tokX={tok.x}
                            lineHeight={line.height}
                            onSelect={(e?: React.MouseEvent) => { if (onImageClick && runIdx >= 0) onImageClick(line.paraIdx, runIdx, e as React.MouseEvent); }}
                            onAction={onImageAction ? (action) => onImageAction(action, line.paraIdx, runIdx) : undefined}
                          />
                        );
                      }

                      return (
                        <span key={ti} style={{
                          position: 'absolute',
                          left: tok.x, top: shift,
                          height: line.height, lineHeight: `${line.height}px`,
                          whiteSpace: 'pre',
                          fontSize: `${((f.fontSize ?? DEF_SIZE) * PT_PX).toFixed(2)}px`,
                          fontWeight: f.bold ? 'bold' : 'normal',
                          fontStyle: f.italic ? 'italic' : 'normal',
                          fontFamily: `${(f.fontFamily || DEF_FONT).replace(/['"]/g, '')}, Arial, sans-serif`,
                          fontFeatureSettings: fontFeatures.length > 0 ? fontFeatures.join(', ') : undefined,
                          transform: `scaleX(${(f.fontScale ?? 100) / 100})`,
                          transformOrigin: 'left top',
                          letterSpacing: f.letterSpacing ? `${f.letterSpacing * (96/72)}px` : undefined,
                          color: f.color ?? '#000',
                          background: f.highlight ?? 'transparent',
                          textDecoration: textDecoration.filter(Boolean).join(' ') || 'none',
                          textShadow: textShadows.length > 0 ? textShadows.join(', ') : undefined,
                        }}>
                          {textToRender}
                        </span>
                      );
                    })}
                    
                    {/* Formatting Marks */}
                    {formatMarks && doc.paras[line.paraIdx] && (
                      <span style={{
                        position: 'absolute',
                        left: line.tokens.length ? line.tokens[line.tokens.length - 1].x + line.tokens[line.tokens.length - 1].width + 2 : 0,
                        top: 0,
                        height: line.height, lineHeight: `${line.height}px`,
                        color: '#3498db', fontSize: (DEF_SIZE * PT_PX) + 'px', fontFamily: 'Arial, sans-serif'
                      }}>
                        {line.charEnd >= paraLen(doc.paras[line.paraIdx]) ? '¶' : '↵'}
                      </span>
                    )}
                  </div>
                );
              })}

              {/* Caret */}
              {sc && sc.pageIdx === pi && (
                <div className="ox-caret" style={{
                  position: 'absolute',
                  left:   sc.x - marginLeft,
                  top:    sc.localY - marginTop,
                  width:  1.5, height: sc.height,
                  background: '#000',
                  animation:  'oxBlink 1.1s step-start infinite',
                  pointerEvents: 'none', zIndex: 20,
                }} />
              )}
            </div>

            {/* Headers and Footers */}
            {!isEditingHeaderFooter && (pageSetup.headerL || pageSetup.headerC || pageSetup.headerR) && (
              <div style={{ position: 'absolute', top: pageSetup.marginTop / 2, left: pageSetup.marginLeft, right: pageSetup.marginRight, display: 'flex', height: 32, alignItems: 'center', fontFamily: 'Arial, sans-serif', fontSize: 14, color: '#000', pointerEvents: 'none', zIndex: 10 }}>
                <div style={{ flex: 1, textAlign: 'left' }}>{pageSetup.headerL}</div>
                <div style={{ flex: 1, textAlign: 'center' }}>{pageSetup.headerC}</div>
                <div style={{ flex: 1, textAlign: 'right' }}>{pageSetup.headerR}</div>
              </div>
            )}
            {!isEditingHeaderFooter && (
              <div style={{ position: 'absolute', bottom: pageSetup.marginBottom / 2, left: pageSetup.marginLeft, right: pageSetup.marginRight, display: 'flex', height: 32, alignItems: 'center', fontFamily: 'Arial, sans-serif', fontSize: 14, color: '#000', pointerEvents: 'none', zIndex: 10 }}>
                <div style={{ flex: 1, textAlign: 'left' }}>{pageSetup.footerL}</div>
                <div style={{ flex: 1, textAlign: 'center', fontSize: 12, fontWeight: 'bold', fontFamily: 'Times New Roman, serif' }}>
                  {pageSetup.footerC || (pi + 1)}
                </div>
                <div style={{ flex: 1, textAlign: 'right' }}>{pageSetup.footerR}</div>
              </div>
            )}
          </>
        )}
        
        {/* Mini Toolbar */}
        {showMiniToolbar && sc && sc.pageIdx === pi && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10000 }}>
             {(() => {
               const useSel = selRects && selRects.length > 0;
               const tTop = useSel ? Math.max(0, selRects[0].y + marginTop - 40) : Math.max(0, sc.localY - 40);
               const tLeft = useSel ? Math.max(0, selRects[0].x + marginLeft) : Math.max(0, sc.x - 50);
               return (
                 <div style={{ pointerEvents: 'auto', position: 'absolute', top: tTop, left: tLeft }}>
                    <MiniToolbar
                      top={0}
                      left={0}
                      isInTable={!!doc.paras[sel?.focus.paraIdx || 0]?.fmt.tableId}
                      onAction={() => setShowMiniToolbar?.(false)}
                    />
                 </div>
               );
             })()}
          </div>
        )}
      </div>
    );
}

class RenderEngineImpl {
  public RenderPage(props: RenderPageProps): React.ReactNode {
    return renderPageImpl(props);
  }
}

export const RenderEngine = new RenderEngineImpl();
