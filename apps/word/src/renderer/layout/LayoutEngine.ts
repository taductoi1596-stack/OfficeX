import type { DocModel, DocPara, RunFmt, Caret, SelRange } from '../document/DocumentTypes';
import { normalizeSel, paraText, paraLen } from '../document/DocumentEngine';
import { LayoutToken, LayoutLine, LayoutPara, LayoutResult } from './LayoutTypes';
import { PageBox } from '../pagination/PaginationTypes';
import { Measurer, BULLET_INDENT } from './Measurer';
import { TextEngine } from '../text/TextEngine';
import { SectionEngine } from '../section/SectionEngine';
import { EditorAPI } from '../editorApi';

// We need normalizeSel from CanvasEditor for selectionRects. For now we redefine or import it.
// To avoid circular dependency issues, we'll redefine a simple version here.

function toRoman(num: number, upper: boolean = true): string {
  if (num <= 0 || num >= 4000) return num.toString();
  const lookup: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
    [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
    [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
  ];
  let roman = '';
  for (const [v, s] of lookup) {
    while (num >= v) { roman += s; num -= v; }
  }
  return upper ? roman : roman.toLowerCase();
}

function toAlpha(num: number, upper: boolean = true): string {
  if (num <= 0) return num.toString();
  let alpha = '';
  while (num > 0) {
    num--;
    alpha = String.fromCharCode((upper ? 65 : 97) + (num % 26)) + alpha;
    num = Math.floor(num / 26);
  }
  return alpha;
}

function formatNumber(num: number, format: string = 'decimal'): string {
  switch (format) {
    case 'lower-roman': return toRoman(num, false);
    case 'upper-roman': return toRoman(num, true);
    case 'lower-alpha': return toAlpha(num, false);
    case 'upper-alpha': return toAlpha(num, true);
    case 'decimal':
    default: return num.toString();
  }
}


export class LayoutEngine {
  private static _instance: LayoutEngine;

  public static get(): LayoutEngine {
    if (!this._instance) {
      this._instance = new LayoutEngine();
    }
    return this._instance;
  }

  // Stub methods for commands
  public static Section(action: string) {}
  public static SetSpacing(action: string) {}
  public static SetIndent(action: string) {}
  public static SetAlignment(action: string) {}
  public static PrintLayout(action: string) {}
  public static OptimizeAI(action: string) {}

  public calculate(doc: DocModel): LayoutResult {
    const se = SectionEngine.get();
    const safeParas = doc?.paras && Array.isArray(doc.paras) ? doc.paras : [];
    return this.calculateParas(safeParas, (pi: number) => {
      const section = se.GetSectionForPara(doc, pi);
      const setup = section?.pageSetup || { width: 816, marginLeft: 96, marginRight: 96 };
      const width = setup.width ?? 816;
      const marginLeft = setup.marginLeft ?? 96;
      const marginRight = setup.marginRight ?? 96;
      const totalW = Math.max(100, width - marginLeft - marginRight);
      const cols = Math.max(1, setup.cols || 1);
      if (cols > 1) {
        const gap = 18;
        if (setup.colLayout === 'left') {
          return Math.max(50, (totalW - gap) * 0.35);
        } else if (setup.colLayout === 'right') {
          return Math.max(50, (totalW - gap) * 0.65);
        }
        return Math.max(50, (totalW - (cols - 1) * gap) / cols);
      }
      return totalW;
    });
  }

  public calculateParas(parasArr: DocPara[], getContentW: (pi: number) => number): LayoutResult {
    const m = Measurer.get();
    const paras: LayoutPara[] = [];
    let flowY = 0;
    
    // Table state tracking
    let tableRowY = 0;
    let tableMaxRowH = 0;
    let tableLastRowId: string | null = null;
    let tableLastCellId: string | null = null;
    let tableCellY = 0;
    
    const listCounters = new Array(9).fill(0);

    for (let pi = 0; pi < parasArr.length; pi++) {
      const para = parasArr[pi];
      if (!para) continue;
      const fmt = para.fmt || {};
      const { spaceBefore = 0, spaceAfter = 0, leftIndent = fmt.leftIndent ?? 0, rightIndent = 0, 
              firstLineIndent = fmt.firstLineIndent ?? 0, hangingIndent = 0, mirrorIndent = false,
              listType, listLevel = 0, lineSpacing = 1.0, align = 'left',
              listFormat = 'decimal', listStartAt, listRestart, numberPrefix = '', numberSuffix = '.' } = fmt;
      const listIndent = listType ? BULLET_INDENT * (listLevel + 1) : 0;
      const contentW = getContentW(pi);
      const isTable = !!fmt.tableId;
      if (isTable) {
        if (fmt.tableRowId !== tableLastRowId) {
          if (tableLastRowId !== null) flowY += tableMaxRowH;
          tableRowY = flowY;
          tableMaxRowH = fmt.minRowHeight || 0;
          tableLastRowId = fmt.tableRowId || null;
        }
        if (fmt.tableCellId !== tableLastCellId) {
          tableCellY = tableRowY;
          tableLastCellId = fmt.tableCellId || null;
        }
      } else if (tableLastRowId !== null) {
        flowY += tableMaxRowH;
        tableLastRowId = null;
        tableLastCellId = null;
      }

      const startY = isTable ? tableCellY : (flowY + spaceBefore);

      let cellOffsetX = 0;
      let cellW = contentW;
      let cellPadding = 0;

      if (isTable) {
        if (fmt.tableColWidths && fmt.tableColIdx !== undefined) {
           const cIdx = fmt.tableColIdx;
           const cSpan = fmt.tableColSpan || 1;
           const colWidths = fmt.tableColWidths;

           const parentLeft = colWidths.slice(0, cIdx).reduce((a, b) => a + b, 0);
           const parentW = colWidths.slice(cIdx, cIdx + cSpan).reduce((a, b) => a + b, 0);

           const subCols = fmt.tableSubCols || 1;
           const subCIdx = fmt.tableSubColIdx || 0;

           cellW = parentW / subCols;
           cellOffsetX = parentLeft + subCIdx * cellW;
        }
        cellPadding = 5;
      }

      let computedNumberStr = '';
      if (listType === 'number' || listType === 'multilevel') {
        const lvl = Math.max(0, Math.min(8, listLevel));
        if (listRestart || listStartAt !== undefined) {
          listCounters[lvl] = (listStartAt ?? 1);
        } else {
          if (listCounters[lvl] === 0) listCounters[lvl] = 1;
          else listCounters[lvl]++;
        }
        for (let i = lvl + 1; i < 9; i++) listCounters[i] = 0;
        
        let numStr = '';
        if (listType === 'multilevel' && fmt.listFormatTemplate) {
          let template = fmt.listFormatTemplate;
          const formats = fmt.listFormatArray || [];
          for (let idx = 0; idx <= lvl; idx++) {
             const val = listCounters[idx] || 1;
             const fmt = formats[idx] || 'decimal';
             const str = formatNumber(val, fmt);
             template = template.replace(new RegExp(`%${idx}|\\{${idx}\\}`, 'g'), str);
          }
          // Remove trailing un-replaced variables like %3 or {3}
          numStr = template.replace(/(%|\{)\d+(\})?/g, '');
        } else {
          const valStr = formatNumber(listCounters[lvl], listFormat);
          numStr = `${numberPrefix}${valStr}${numberSuffix}`;
        }
        computedNumberStr = numStr;
      }

      const baseIndent = cellOffsetX + cellPadding + listIndent + leftIndent;
      const firstLineLeft = baseIndent + firstLineIndent;
      const subsequentLeft = baseIndent + hangingIndent;
      const rightBound = cellOffsetX + cellW - cellPadding - rightIndent;

      const firstLineAvailW = Math.max(1, rightBound - firstLineLeft);
      const subsequentAvailW = Math.max(1, rightBound - subsequentLeft);

      const textPara = TextEngine.get().wrapParagraph(para, firstLineAvailW, subsequentAvailW, lineSpacing);

      const lines: LayoutLine[] = [];
      let lY = startY;
      let lIdx = 0;

      for (let i = 0; i < textPara.lines.length; i++) {
        const tLine = textPara.lines[i];
        const isFirstLine = i === 0;
        const isLastLine = i === textPara.lines.length - 1;
        const lineLeft = isFirstLine ? firstLineLeft : subsequentLeft;
        
        let lToks: LayoutToken[] = [];
        let currentX = lineLeft;
        for (const tok of tLine.tokens) {
          lToks.push({
             text: tok.text, width: tok.width, fmt: tok.fmt,
             x: currentX, paraIdx: pi, charStart: tok.charStart, charEnd: tok.charEnd
          });
          currentX += tok.width;
        }

        // Calculate alignment offsets
        let ox = 0;
        const totalW = tLine.width;
        const lineAvailW = isFirstLine ? firstLineAvailW : subsequentAvailW;

        if (align === 'center') ox = Math.max(0, (lineAvailW - totalW) / 2);
        else if (align === 'right') ox = Math.max(0, lineAvailW - totalW);
        else if ((align === 'justify' && !isLastLine && lToks.length > 1) || (align === 'distributed' && lToks.length > 1)) {
          // Justify / Distributed: distribute remaining space among tokens
          const extra = Math.max(0, lineAvailW - totalW);
          const spaces = lToks.length - 1;
          const perSpace = extra / spaces;
          let accum = 0;
          lToks.forEach((t, i) => {
            t.x += accum;
            if (i < spaces) accum += perSpace;
          });
        }

        if (ox > 0 && align !== 'justify' && align !== 'distributed') {
          lToks.forEach(t => t.x += ox);
        }

        lines.push({
           tokens: lToks, y: lY, height: tLine.height, baseline: tLine.baseline,
           bounds: { left: cellOffsetX, right: cellOffsetX + cellW },
           paraIdx: pi, lineIdx: lIdx++, charStart: tLine.charStart, charEnd: tLine.charEnd
        });
        lY += tLine.height;
      }

      const ph = lY - startY;
      paras.push({ paraIdx: pi, lines, y: startY, height: ph, numberStr: computedNumberStr });
      
      if (isTable) {
        tableCellY = lY + spaceAfter;
        tableMaxRowH = Math.max(tableMaxRowH, tableCellY - tableRowY, para.fmt.minRowHeight || 0);
      } else {
        flowY = lY + spaceAfter;
      }
    }

    if (tableLastRowId !== null) {
      flowY += tableMaxRowH;
    }

    return { paras, totalH: flowY };
  }

  // ── Coordinate Calculation ─────────────────────────────────────────

  // ── UI Command Stubs (Restored for Ribbon Commands) ──────────────

  public static initialize() {
    console.log('[LayoutEngine] Command bindings initialized');
  }

  public static PageSetup(action: string) {}
  public static SetPaperSize(size: string) {
    const legacy = (EditorAPI.getLegacy() as any);
    if (!legacy?.setPageSetup) return;
    const s = size.toLowerCase();
    const sizes: Record<string, { width: number; height: number }> = {
      a4: { width: 794, height: 1123 },
      letter: { width: 816, height: 1056 },
      legal: { width: 816, height: 1344 },
      'pháp lý': { width: 816, height: 1344 },
      phaply: { width: 816, height: 1344 },
      executive: { width: 696, height: 1008 },
      a5: { width: 559, height: 794 },
      a3: { width: 1123, height: 1587 },
      tabloid: { width: 1056, height: 1632 },
    };
    if (sizes[s]) {
      const currentSetup = legacy.getPageSetup ? legacy.getPageSetup() : { width: 794, height: 1123 };
      const isLandscape = (currentSetup.width || 794) > (currentSetup.height || 1123);
      let targetW = sizes[s].width;
      let targetH = sizes[s].height;
      if (isLandscape) {
        targetW = Math.max(sizes[s].width, sizes[s].height);
        targetH = Math.min(sizes[s].width, sizes[s].height);
      }
      legacy.setPageSetup({ width: targetW, height: targetH });
    }
  }

  public static SetOrientation(ori: string) {
    const legacy = (EditorAPI.getLegacy() as any);
    if (!legacy?.setPageSetup) return;
    const type = ori.toLowerCase();
    const currentSetup = legacy.getPageSetup ? legacy.getPageSetup() : { width: 816, height: 1056 };
    const w = currentSetup.width || 816;
    const h = currentSetup.height || 1056;

    if (type === 'portrait' || type === 'doc' || type === 'trang dọc') {
      const newW = Math.min(w, h);
      const newH = Math.max(w, h);
      legacy.setPageSetup({ width: newW, height: newH });
    } else if (type === 'landscape' || type === 'ngang' || type === 'trang ngang') {
      const newW = Math.max(w, h);
      const newH = Math.min(w, h);
      legacy.setPageSetup({ width: newW, height: newH });
    }
  }
  public static SetMargins(m: string) {
    const legacy = (EditorAPI.getLegacy() as any);
    if (!legacy?.setPageSetup) return;
    const type = m.toLowerCase();
    if (type === 'normal' || type === 'chuan' || type === 'chuẩn') {
      legacy.setPageSetup({ marginTop: 96, marginBottom: 96, marginLeft: 96, marginRight: 96 });
    } else if (type === 'narrow' || type === 'hep' || type === 'hẹp') {
      legacy.setPageSetup({ marginTop: 48, marginBottom: 48, marginLeft: 48, marginRight: 48 });
    } else if (type === 'moderate' || type === 'vua phai' || type === 'vừa phải') {
      legacy.setPageSetup({ marginTop: 96, marginBottom: 96, marginLeft: 72, marginRight: 72 });
    } else if (type === 'wide' || type === 'rong' || type === 'rộng') {
      legacy.setPageSetup({ marginTop: 96, marginBottom: 96, marginLeft: 192, marginRight: 192 });
    } else if (type === 'office2003' || type === 'mac dinh office 2003') {
      legacy.setPageSetup({ marginTop: 96, marginBottom: 96, marginLeft: 120, marginRight: 120 });
    }
  }
  public static SetColumns(c: string) {
    const legacy = (EditorAPI.getLegacy() as any);
    if (!legacy?.setPageSetup) return;
    const type = c.toLowerCase();
    if (type === 'one' || type === 'mot' || type === 'một' || type === '1') {
      legacy.setPageSetup({ cols: 1, colLayout: 'equal' });
    } else if (type === 'two' || type === 'hai' || type === '2') {
      legacy.setPageSetup({ cols: 2, colLayout: 'equal' });
    } else if (type === 'three' || type === 'ba' || type === '3') {
      legacy.setPageSetup({ cols: 3, colLayout: 'equal' });
    } else if (type === 'left' || type === 'trai' || type === 'trái') {
      legacy.setPageSetup({ cols: 2, colLayout: 'left' });
    } else if (type === 'right' || type === 'phai' || type === 'phải') {
      legacy.setPageSetup({ cols: 2, colLayout: 'right' });
    }
  }
  public static InsertBreak(b: string) {
    const legacy = (EditorAPI.getLegacy() as any);
    if (legacy?.insertBreak) {
      legacy.insertBreak(b);
    }
  }
  public static SetLineNumber(ln: string) {
    const legacy = (EditorAPI.getLegacy() as any);
    const mode = ln === 'restart' ? 'restart-page' : ln === 'section' ? 'restart-section' : ln;
    if (legacy?.setPageSetup) {
      legacy.setPageSetup({ lineNumbers: mode });
    }
  }
  public static SetHyphenation(h: string) {}
  public static SetBackground(bg: string) {}
  public static SetWatermark(wm: string) {}
  public static SetBorder(b: string) {}
  public static SetPageNumber(pn: string) {}
  public static SetPosition(p: string) {}
  public static SetWrap(w: string) {}
  public static Align(a: string) {}
  public static Group(g: string) {}
  public static Rotate(r: string) {}
}
