import { DocModel, DocPara, Caret, DocRun, SelRange } from '../document/DocumentTypes';
import { DocumentEngine } from '../document/DocumentEngine';

export const TableEngine = {
  
  insertRow(doc: DocModel, caret: Caret, position: 'above' | 'below'): { doc: DocModel; caret: Caret } | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId) return null;

    const { tableId, tableRowIdx } = para.fmt;

    // Find all cells in the current row to duplicate their formatting
    const currentRowCells = doc.paras.filter(p => p.fmt?.tableId === tableId && p.fmt?.tableRowIdx === tableRowIdx);
    if (currentRowCells.length === 0) return null;

    const newRowId = crypto.randomUUID();
    const newParas: DocPara[] = currentRowCells.map(c => ({
      id: crypto.randomUUID(),
      runs: [{ id: crypto.randomUUID(), text: '', fmt: c.runs?.[0]?.fmt ?? {} }],
      fmt: {
        ...c.fmt,
        tableRowId: newRowId,
        // The tableRowIdx will be updated in the full pass
      }
    }));

    // Find insertion index
    let insertAt = 0;
    if (position === 'above') {
      insertAt = doc.paras.findIndex(p => p.fmt?.tableId === tableId && p.fmt?.tableRowIdx === tableRowIdx);
    } else {
      let lastIndex = -1;
      for (let i = 0; i < doc.paras.length; i++) {
        if (doc.paras[i].fmt?.tableId === tableId && doc.paras[i].fmt?.tableRowIdx === tableRowIdx) {
          lastIndex = i;
        }
      }
      insertAt = lastIndex + 1;
    }

    if (insertAt < 0 || insertAt > doc.paras.length) return null;

    // Splice new row
    let resultParas = [
      ...doc.paras.slice(0, insertAt),
      ...newParas,
      ...doc.paras.slice(insertAt)
    ];

    // Re-calculate tableRowIdx for all cells in this table
    let currentRow = -1;
    let lastRowId = '';
    resultParas = resultParas.map(p => {
      if (p.fmt?.tableId === tableId) {
        if (p.fmt.tableRowId !== lastRowId) {
          currentRow++;
          lastRowId = p.fmt.tableRowId || '';
        }
        return { ...p, fmt: { ...p.fmt, tableRowIdx: currentRow } };
      }
      return p;
    });

    return { 
      doc: { ...doc, paras: resultParas }, 
      caret: { paraIdx: insertAt, charOffset: 0 } 
    };
  },

  insertColumn(doc: DocModel, caret: Caret, position: 'left' | 'right'): { doc: DocModel; caret: Caret } | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId) return null;

    const { tableId, tableColIdx } = para.fmt;
    
    // We need to add one cell to every row in the table.
    // First, find all rows.
    const allCells = doc.paras.filter(p => p.fmt?.tableId === tableId);
    if (allCells.length === 0) return null;
    
    const tableColWidths = [...(allCells[0].fmt?.tableColWidths || [100])];
    const defaultWidth = tableColWidths.length > 0 ? tableColWidths[0] : 100;
    
    const insertColIdx = position === 'left' ? tableColIdx! : tableColIdx! + 1;
    
    // Insert new width
    tableColWidths.splice(insertColIdx, 0, defaultWidth);

    let resultParas: DocPara[] = [];

    let i = 0;
    while (i < doc.paras.length) {
      const p = doc.paras[i];
      if (p.fmt?.tableId === tableId) {
        // We are inside the table.
        // We want to insert the new cell at the correct column index for this row.
        // Let's collect the entire row first.
        const rowId = p.fmt.tableRowId;
        const rowCells: DocPara[] = [];
        while (i < doc.paras.length && doc.paras[i].fmt?.tableId === tableId && doc.paras[i].fmt?.tableRowId === rowId) {
          rowCells.push(doc.paras[i]);
          i++;
        }
        
        // Find the cell where we should insert before/after
        const refCell = rowCells.find(c => c.fmt?.tableColIdx === tableColIdx);
        
        const newCell: DocPara = {
          id: crypto.randomUUID(),
          runs: [{ id: crypto.randomUUID(), text: '', fmt: refCell?.runs?.[0]?.fmt ?? {} }],
          fmt: {
            ...(refCell?.fmt || rowCells[0].fmt),
            tableCellId: crypto.randomUUID(),
            // tableColIdx will be recomputed
          }
        };

        const newRowCells: DocPara[] = [];
        let inserted = false;

        for (let j = 0; j < rowCells.length; j++) {
          if (rowCells[j].fmt?.tableColIdx === tableColIdx) {
            if (position === 'left') {
              newRowCells.push(newCell);
              newRowCells.push(rowCells[j]);
              inserted = true;
            } else {
              newRowCells.push(rowCells[j]);
              newRowCells.push(newCell);
              inserted = true;
            }
          } else {
            newRowCells.push(rowCells[j]);
          }
        }
        
        if (!inserted) {
          newRowCells.push(newCell); // Fallback
        }

        // Recompute col indices and apply new widths
        newRowCells.forEach((c, idx) => {
          c.fmt = { ...c.fmt, tableColIdx: idx, tableColWidths };
        });

        resultParas.push(...newRowCells);
        continue;
      }

      resultParas.push(p);
      i++;
    }

    // Caret needs to be recalculated, simplified approach: place caret at the start of the table
    const firstTableCellIdx = resultParas.findIndex(p => p.fmt?.tableId === tableId);
    
    return {
      doc: { ...doc, paras: resultParas },
      caret: { paraIdx: firstTableCellIdx !== -1 ? firstTableCellIdx : 0, charOffset: 0 }
    };
  },

  deleteRow(doc: DocModel, caret: Caret): { doc: DocModel; caret: Caret } | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId) return null;

    const { tableId, tableRowId } = para.fmt;

    const resultParas = doc.paras.filter(p => !(p.fmt?.tableId === tableId && p.fmt?.tableRowId === tableRowId));
    
    // Recompute row indices
    let currentRow = -1;
    let lastRowId = '';
    const finalParas = resultParas.map(p => {
      if (p.fmt?.tableId === tableId) {
        if (p.fmt.tableRowId !== lastRowId) {
          currentRow++;
          lastRowId = p.fmt.tableRowId || '';
        }
        return { ...p, fmt: { ...p.fmt, tableRowIdx: currentRow } };
      }
      return p;
    });

    const newCaretIdx = Math.max(0, Math.min(caret.paraIdx, finalParas.length - 1));
    return { doc: { ...doc, paras: finalParas }, caret: { paraIdx: newCaretIdx, charOffset: 0 } };
  },

  deleteColumn(doc: DocModel, caret: Caret): { doc: DocModel; caret: Caret } | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId) return null;

    const { tableId, tableColIdx } = para.fmt;

    let resultParas = doc.paras.filter(p => !(p.fmt?.tableId === tableId && p.fmt?.tableColIdx === tableColIdx));

    // Recompute col widths and col indices
    resultParas = resultParas.map(p => {
      if (p.fmt?.tableId === tableId) {
        const newColWidths = [...(p.fmt.tableColWidths || [])];
        if (tableColIdx !== undefined && tableColIdx >= 0 && tableColIdx < newColWidths.length) {
           newColWidths.splice(tableColIdx, 1);
        }
        const currentIdx = p.fmt.tableColIdx || 0;
        const newIdx = currentIdx > tableColIdx! ? currentIdx - 1 : currentIdx;
        
        return { ...p, fmt: { ...p.fmt, tableColIdx: newIdx, tableColWidths: newColWidths } };
      }
      return p;
    });

    const newCaretIdx = Math.max(0, Math.min(caret.paraIdx, resultParas.length - 1));
    return { doc: { ...doc, paras: resultParas }, caret: { paraIdx: newCaretIdx, charOffset: 0 } };
  },

  deleteTable(doc: DocModel, caret: Caret): { doc: DocModel; caret: Caret } | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId) return null;

    const { tableId } = para.fmt;
    
    // Find the first paragraph before the table, or the first after the table to place the caret
    let newCaretParaIdx = 0;
    const tableFirstIdx = doc.paras.findIndex(p => p.fmt?.tableId === tableId);
    if (tableFirstIdx > 0) newCaretParaIdx = tableFirstIdx - 1;

    const resultParas = doc.paras.filter(p => p.fmt?.tableId !== tableId);

    // If doc becomes empty, ensure at least one para
    if (resultParas.length === 0) {
      resultParas.push({
        id: crypto.randomUUID(),
        runs: [{ id: crypto.randomUUID(), text: '', fmt: {} }],
        fmt: { spaceAfter: 0, spaceBefore: 0, align: 'left' }
      });
      newCaretParaIdx = 0;
    }

    return {
      doc: { ...doc, paras: resultParas },
      caret: { paraIdx: newCaretParaIdx, charOffset: 0 }
    };
  },

  setTableOption(doc: DocModel, caret: Caret, option: Record<string, boolean>): { doc: DocModel; caret: Caret } | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId) return null;
    const { tableId } = para.fmt;
    
    const resultParas = doc.paras.map(p => {
      if (p.fmt?.tableId === tableId) {
        return { ...p, fmt: { ...p.fmt, ...option } };
      }
      return p;
    });

    return { doc: { ...doc, paras: resultParas }, caret };
  },

  setTableStyle(doc: DocModel, caret: Caret, styleId: string): { doc: DocModel; caret: Caret } | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId) return null;
    const { tableId } = para.fmt;
    
    const resultParas = doc.paras.map(p => {
      if (p.fmt?.tableId === tableId) {
        return { ...p, fmt: { ...p.fmt, tableStyleId: styleId, tableBorders: undefined, borders: undefined, shading: undefined } };
      }
      return p;
    });

    return { doc: { ...doc, paras: resultParas }, caret };
  },

  setTableShading(doc: DocModel, caret: Caret, sel: any, color: string): { doc: DocModel; caret: Caret } | null {
    // Basic implementation: if sel is single cell (caret), apply to cell.
    // Full implementation requires mapping selection to cells. For now, apply to current cell.
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId) return null;
    const { tableId, tableCellId } = para.fmt;
    
    const resultParas = doc.paras.map(p => {
      if (p.fmt?.tableId === tableId && p.fmt?.tableCellId === tableCellId) {
        return { ...p, fmt: { ...p.fmt, shading: color } };
      }
      return p;
    });

    return { doc: { ...doc, paras: resultParas }, caret };
  },

  setTableBorders(doc: DocModel, caret: Caret, sel: any, type: string, width: number = 1, style: string = 'solid', color: string = '#000000'): { doc: DocModel; caret: Caret } | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId) return null;
    const { tableId, tableCellId } = para.fmt;
    
    const borderDef = type === 'none' ? undefined : { width, style: style as any, color };
    
    const resultParas = doc.paras.map(p => {
      if (p.fmt?.tableId === tableId && p.fmt?.tableCellId === tableCellId) {
        let borders: any = { ...(p.fmt.borders || {}) };
        
        if (type === 'all') borders = { top: borderDef, bottom: borderDef, left: borderDef, right: borderDef };
        else if (type === 'none') borders = { top: undefined, bottom: undefined, left: undefined, right: undefined };
        else if (type === 'outside') borders = { top: borderDef, bottom: borderDef, left: borderDef, right: borderDef };
        else if (type === 'top') borders.top = borders.top ? undefined : borderDef;
        else if (type === 'bottom') borders.bottom = borders.bottom ? undefined : borderDef;
        else if (type === 'left') borders.left = borders.left ? undefined : borderDef;
        else if (type === 'right') borders.right = borders.right ? undefined : borderDef;
        else if (type === 'inside' || type === 'inside_h' || type === 'inside_v') {
          // For a single cell, inside borders don't technically exist, but we can treat it as 'all' or ignore.
          borders = { ...borders, top: borderDef, bottom: borderDef, left: borderDef, right: borderDef };
        }
        
        return { ...p, fmt: { ...p.fmt, borders } };
      }
      return p;
    });

    return { doc: { ...doc, paras: resultParas }, caret };
  },

  selectTable(doc: DocModel, caret: Caret): SelRange | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId) return null;
    const { tableId } = para.fmt;

    let firstIdx = -1;
    let lastIdx = -1;
    for (let i = 0; i < doc.paras.length; i++) {
      if (doc.paras[i].fmt?.tableId === tableId) {
        if (firstIdx === -1) firstIdx = i;
        lastIdx = i;
      }
    }
    if (firstIdx === -1) return null;

    const lastPara = doc.paras[lastIdx];
    const len = lastPara.runs.reduce((acc, r) => acc + r.text.length, 0);

    return {
      anchor: { paraIdx: firstIdx, charOffset: 0 },
      focus: { paraIdx: lastIdx, charOffset: len },
    };
  },

  selectRow(doc: DocModel, caret: Caret): SelRange | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId) return null;
    const { tableId, tableRowIdx } = para.fmt;

    let firstIdx = -1;
    let lastIdx = -1;
    for (let i = 0; i < doc.paras.length; i++) {
      const p = doc.paras[i];
      if (p.fmt?.tableId === tableId && p.fmt?.tableRowIdx === tableRowIdx) {
        if (firstIdx === -1) firstIdx = i;
        lastIdx = i;
      }
    }
    if (firstIdx === -1) return null;

    const lastPara = doc.paras[lastIdx];
    const len = lastPara.runs.reduce((acc, r) => acc + r.text.length, 0);

    return {
      anchor: { paraIdx: firstIdx, charOffset: 0 },
      focus: { paraIdx: lastIdx, charOffset: len },
    };
  },

  selectColumn(doc: DocModel, caret: Caret): SelRange | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId) return null;
    const { tableId, tableColIdx } = para.fmt;

    let firstIdx = -1;
    let lastIdx = -1;
    for (let i = 0; i < doc.paras.length; i++) {
      const p = doc.paras[i];
      if (p.fmt?.tableId === tableId && p.fmt?.tableColIdx === tableColIdx) {
        if (firstIdx === -1) firstIdx = i;
        lastIdx = i;
      }
    }
    if (firstIdx === -1) return null;

    const lastPara = doc.paras[lastIdx];
    const len = lastPara.runs.reduce((acc, r) => acc + r.text.length, 0);

    return {
      anchor: { paraIdx: firstIdx, charOffset: 0 },
      focus: { paraIdx: lastIdx, charOffset: len },
    };
  },

  selectCell(doc: DocModel, caret: Caret): SelRange | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId) return null;
    const { tableId, tableCellId } = para.fmt;

    let firstIdx = -1;
    let lastIdx = -1;
    for (let i = 0; i < doc.paras.length; i++) {
      const p = doc.paras[i];
      if (p.fmt?.tableId === tableId && p.fmt?.tableCellId === tableCellId) {
        if (firstIdx === -1) firstIdx = i;
        lastIdx = i;
      }
    }
    if (firstIdx === -1) return null;

    const lastPara = doc.paras[lastIdx];
    const len = lastPara.runs.reduce((acc, r) => acc + r.text.length, 0);

    return {
      anchor: { paraIdx: firstIdx, charOffset: 0 },
      focus: { paraIdx: lastIdx, charOffset: len },
    };
  },

  splitCell(doc: DocModel, caret: Caret, numCols: number = 2, numRows: number = 1): { doc: DocModel; caret: Caret } | null {
    const targetPara = doc.paras[caret.paraIdx];
    if (!targetPara || !targetPara.fmt?.tableId) return null;

    const { tableCellId } = targetPara.fmt;
    const targetIdx = doc.paras.findIndex(p => p.id === targetPara.id);
    if (targetIdx === -1) return null;

    const newSubParas: DocPara[] = [];

    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const isFirst = r === 0 && c === 0;
        newSubParas.push({
          ...targetPara,
          id: isFirst ? targetPara.id : crypto.randomUUID(),
          runs: isFirst ? targetPara.runs : [{ id: crypto.randomUUID(), text: '', fmt: targetPara.runs?.[0]?.fmt ?? {} }],
          fmt: {
            ...targetPara.fmt,
            tableCellId: isFirst ? tableCellId : crypto.randomUUID(),
            tableSubColIdx: c,
            tableSubCols: numCols,
            tableSubRowIdx: r,
            tableSubRows: numRows,
          }
        });
      }
    }

    const newParas = [
      ...doc.paras.slice(0, targetIdx),
      ...newSubParas,
      ...doc.paras.slice(targetIdx + 1)
    ];

    return { doc: { ...doc, paras: newParas }, caret };
  },

  mergeCells(doc: DocModel, caret: Caret, sel: SelRange | null): { doc: DocModel; caret: Caret } | null {
    const currentPara = doc.paras[caret.paraIdx];
    if (!currentPara || !currentPara.fmt?.tableId) return null;

    const tableId = currentPara.fmt.tableId;

    let startIdx = caret.paraIdx;
    let endIdx = caret.paraIdx;

    if (sel) {
      const ns = DocumentEngine.normalizeSel(sel);
      startIdx = ns.startPara;
      endIdx = ns.endPara;
    }

    const firstP = doc.paras[startIdx];
    const lastP = doc.paras[endIdx];

    if (!firstP?.fmt?.tableId || !lastP?.fmt?.tableId || firstP.fmt.tableId !== tableId || lastP.fmt.tableId !== tableId) {
      return null;
    }

    const startRow = firstP.fmt.tableRowIdx ?? 0;
    const endRow = lastP.fmt.tableRowIdx ?? 0;
    const startCol = firstP.fmt.tableColIdx ?? 0;
    const endCol = lastP.fmt.tableColIdx ?? 0;

    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = Math.min(startCol, endCol);
    const maxCol = Math.max(startCol, endCol);

    const targetParas: { para: DocPara; idx: number }[] = [];
    for (let i = 0; i < doc.paras.length; i++) {
      const p = doc.paras[i];
      if (p.fmt?.tableId === tableId) {
        const rIdx = p.fmt.tableRowIdx ?? 0;
        const cIdx = p.fmt.tableColIdx ?? 0;
        if (rIdx >= minRow && rIdx <= maxRow && cIdx >= minCol && cIdx <= maxCol) {
          targetParas.push({ para: p, idx: i });
        }
      }
    }

    if (targetParas.length <= 1) {
      return null;
    }

    const colSpan = maxCol - minCol + 1;
    const rowSpan = maxRow - minRow + 1;

    const primaryInfo = targetParas[0];
    const primaryParaIdx = primaryInfo.idx;

    let combinedText = '';
    for (const item of targetParas) {
      const txt = item.para.runs.map(r => r.text).join('').trim();
      if (txt) {
        combinedText += (combinedText ? ' ' : '') + txt;
      }
    }

    const targetSet = new Set(targetParas.map(tp => tp.idx));
    const updatedParas: DocPara[] = [];

    for (let i = 0; i < doc.paras.length; i++) {
      const p = doc.paras[i];

      if (targetSet.has(i)) {
        if (i === primaryParaIdx) {
          const firstRunFmt = p.runs?.[0]?.fmt ?? {};
          updatedParas.push({
            ...p,
            runs: combinedText ? [{ id: p.runs[0]?.id || crypto.randomUUID(), text: combinedText, fmt: firstRunFmt }] : [{ id: crypto.randomUUID(), text: '', fmt: firstRunFmt }],
            fmt: {
              ...p.fmt,
              tableColSpan: colSpan,
              tableRowSpan: rowSpan,
              isCovered: undefined,
              tableSubCols: undefined,
              tableSubColIdx: undefined,
              tableSubRows: undefined,
              tableSubRowIdx: undefined,
            }
          });
        } else {
          updatedParas.push({
            ...p,
            runs: [{ id: crypto.randomUUID(), text: '', fmt: p.runs?.[0]?.fmt ?? {} }],
            fmt: {
              ...p.fmt,
              isCovered: true,
              tableSubCols: undefined,
              tableSubColIdx: undefined,
              tableSubRows: undefined,
              tableSubRowIdx: undefined,
            }
          });
        }
        continue;
      }

      updatedParas.push(p);
    }

    return {
      doc: { ...doc, paras: updatedParas },
      caret: { paraIdx: primaryParaIdx, charOffset: combinedText.length }
    };
  },

  setColumnWidth(doc: DocModel, caret: Caret, widthPx: number): { doc: DocModel; caret: Caret } | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId || para.fmt.tableColIdx === undefined) return null;

    const { tableId, tableColIdx } = para.fmt;
    const oldWidths = para.fmt.tableColWidths || [];
    if (!oldWidths.length) return null;

    const newWidths = [...oldWidths];
    newWidths[tableColIdx] = Math.max(20, widthPx);

    const updatedParas = doc.paras.map(p => {
      if (p.fmt?.tableId === tableId) {
        return { ...p, fmt: { ...p.fmt, tableColWidths: newWidths } };
      }
      return p;
    });

    return { doc: { ...doc, paras: updatedParas }, caret };
  },

  setRowHeight(doc: DocModel, caret: Caret, heightPx: number): { doc: DocModel; caret: Caret } | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId || para.fmt.tableRowIdx === undefined) return null;

    const { tableId, tableRowIdx } = para.fmt;
    const h = Math.max(10, heightPx);

    const updatedParas = doc.paras.map(p => {
      if (p.fmt?.tableId === tableId && (p.fmt.tableRowIdx ?? 0) === tableRowIdx) {
        return { ...p, fmt: { ...p.fmt, minRowHeight: h } };
      }
      return p;
    });

    return { doc: { ...doc, paras: updatedParas }, caret };
  },

  distributeColumns(doc: DocModel, caret: Caret): { doc: DocModel; caret: Caret } | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId) return null;

    const tableId = para.fmt.tableId;
    const oldWidths = para.fmt.tableColWidths || [];
    if (!oldWidths.length) return null;

    const totalWidth = oldWidths.reduce((a, b) => a + b, 0);
    const equalWidth = Math.max(20, totalWidth / oldWidths.length);
    const newWidths = new Array(oldWidths.length).fill(equalWidth);

    const updatedParas = doc.paras.map(p => {
      if (p.fmt?.tableId === tableId) {
        return { ...p, fmt: { ...p.fmt, tableColWidths: newWidths } };
      }
      return p;
    });

    return { doc: { ...doc, paras: updatedParas }, caret };
  },

  distributeRows(doc: DocModel, caret: Caret): { doc: DocModel; caret: Caret } | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId) return null;

    const tableId = para.fmt.tableId;
    const defaultRowH = 28;

    const updatedParas = doc.paras.map(p => {
      if (p.fmt?.tableId === tableId) {
        return { ...p, fmt: { ...p.fmt, minRowHeight: defaultRowH } };
      }
      return p;
    });

    return { doc: { ...doc, paras: updatedParas }, caret };
  },

  setCellAlignment(doc: DocModel, caret: Caret, sel: SelRange | null, align: 'left' | 'center' | 'right', vAlign: 'top' | 'middle' | 'bottom'): { doc: DocModel; caret: Caret } | null {
    const currentPara = doc.paras[caret.paraIdx];
    if (!currentPara || !currentPara.fmt?.tableId) return null;

    const tableId = currentPara.fmt.tableId;
    let minRow = currentPara.fmt.tableRowIdx ?? 0;
    let maxRow = minRow;
    let minCol = currentPara.fmt.tableColIdx ?? 0;
    let maxCol = minCol;

    if (sel) {
      const ns = DocumentEngine.normalizeSel(sel);
      const startP = doc.paras[ns.startPara];
      const endP = doc.paras[ns.endPara];
      if (startP?.fmt?.tableId === tableId && endP?.fmt?.tableId === tableId) {
        const sR = startP.fmt.tableRowIdx ?? 0;
        const eR = endP.fmt.tableRowIdx ?? 0;
        const sC = startP.fmt.tableColIdx ?? 0;
        const eC = endP.fmt.tableColIdx ?? 0;
        minRow = Math.min(sR, eR);
        maxRow = Math.max(sR, eR);
        minCol = Math.min(sC, eC);
        maxCol = Math.max(sC, eC);
      }
    }

    const updatedParas = doc.paras.map(p => {
      if (p.fmt?.tableId === tableId) {
        const rIdx = p.fmt.tableRowIdx ?? 0;
        const cIdx = p.fmt.tableColIdx ?? 0;
        if (rIdx >= minRow && rIdx <= maxRow && cIdx >= minCol && cIdx <= maxCol) {
          return {
            ...p,
            fmt: {
              ...p.fmt,
              align,
              cellVAlign: vAlign
            }
          };
        }
      }
      return p;
    });

    return { doc: { ...doc, paras: updatedParas }, caret };
  },

  sortRowsAscending(doc: DocModel, caret: Caret): { doc: DocModel; caret: Caret } | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId) return null;
    const tableId = para.fmt.tableId;

    // Get all unique row indices
    const rowMap = new Map<number, DocPara[]>();
    for (const p of doc.paras) {
      if (p.fmt?.tableId !== tableId || p.fmt?.isCovered) continue;
      const r = p.fmt.tableRowIdx ?? 0;
      if (!rowMap.has(r)) rowMap.set(r, []);
      rowMap.get(r)!.push(p);
    }

    const sortedRows = [...rowMap.entries()].sort((a, b) => {
      const textA = a[1].map(p => p.runs.map(r => r.text).join('')).join(' ').toLowerCase();
      const textB = b[1].map(p => p.runs.map(r => r.text).join('')).join(' ').toLowerCase();
      return textA.localeCompare(textB);
    });

    const rowIds = [...rowMap.keys()].sort((a, b) => a - b);
    const newParas = [...doc.paras];
    
    // Rebuild paras with sorted row order  
    const tableParaIndices: number[] = [];
    for (let i = 0; i < newParas.length; i++) {
      if (newParas[i].fmt?.tableId === tableId) tableParaIndices.push(i);
    }

    const allTableParas: DocPara[] = tableParaIndices.map(i => newParas[i]);
    const sortedTableParas: DocPara[] = [];
    for (let ri = 0; ri < rowIds.length; ri++) {
      const srcRowParas = sortedRows[ri][1];
      for (const sp of srcRowParas) {
        sortedTableParas.push({ ...sp, fmt: { ...sp.fmt, tableRowIdx: rowIds[ri] } });
      }
    }

    let j = 0;
    for (const idx of tableParaIndices) {
      newParas[idx] = sortedTableParas[j++] || newParas[idx];
    }

    return { doc: { ...doc, paras: newParas }, caret };
  },

  sortRowsDescending(doc: DocModel, caret: Caret): { doc: DocModel; caret: Caret } | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId) return null;
    const tableId = para.fmt.tableId;

    const rowMap = new Map<number, DocPara[]>();
    for (const p of doc.paras) {
      if (p.fmt?.tableId !== tableId || p.fmt?.isCovered) continue;
      const r = p.fmt.tableRowIdx ?? 0;
      if (!rowMap.has(r)) rowMap.set(r, []);
      rowMap.get(r)!.push(p);
    }

    const sortedRows = [...rowMap.entries()].sort((a, b) => {
      const textA = a[1].map(p => p.runs.map(r => r.text).join('')).join(' ').toLowerCase();
      const textB = b[1].map(p => p.runs.map(r => r.text).join('')).join(' ').toLowerCase();
      return textB.localeCompare(textA);
    });

    const rowIds = [...rowMap.keys()].sort((a, b) => a - b);
    const newParas = [...doc.paras];

    const tableParaIndices: number[] = [];
    for (let i = 0; i < newParas.length; i++) {
      if (newParas[i].fmt?.tableId === tableId) tableParaIndices.push(i);
    }

    const sortedTableParas: DocPara[] = [];
    for (let ri = 0; ri < rowIds.length; ri++) {
      const srcRowParas = sortedRows[ri][1];
      for (const sp of srcRowParas) {
        sortedTableParas.push({ ...sp, fmt: { ...sp.fmt, tableRowIdx: rowIds[ri] } });
      }
    }

    let j = 0;
    for (const idx of tableParaIndices) {
      newParas[idx] = sortedTableParas[j++] || newParas[idx];
    }

    return { doc: { ...doc, paras: newParas }, caret };
  },

  setAltText(doc: DocModel, caret: Caret, altTitle: string, altText: string): { doc: DocModel; caret: Caret } | null {
    const para = doc.paras[caret.paraIdx];
    if (!para || !para.fmt?.tableId) return null;
    const tableId = para.fmt.tableId;
    const updatedParas = doc.paras.map(p => {
      if (p.fmt?.tableId === tableId) {
        return { ...p, fmt: { ...p.fmt, tableAltTitle: altTitle, tableAltText: altText } };
      }
      return p;
    });
    return { doc: { ...doc, paras: updatedParas }, caret };
  }
};
