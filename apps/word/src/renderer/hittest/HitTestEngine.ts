import type { Caret, SelRange } from '../document/DocumentTypes';
import { normalizeSel } from '../document/DocumentEngine';
import { Measurer } from '../layout/Measurer';
import type { LayoutResult } from '../layout/LayoutTypes';
import type { PageBox } from '../pagination/PaginationTypes';
import { ScreenCaret } from '../viewport/ViewportTypes';
import { CoordinateEngine } from '../coordinate/CoordinateEngine';

export class HitTestEngine {
  private static instance: HitTestEngine;

  private constructor() {}

  public static get(): HitTestEngine {
    if (!HitTestEngine.instance) {
      HitTestEngine.instance = new HitTestEngine();
    }
    return HitTestEngine.instance;
  }

  // Map a document Caret to screen coordinates (ScreenCaret)
  // IMPORTANT: pass `pages` so we use the enriched lines (with yVisual/pageIdx/xOffset)
  public getScreenCaret(
    caret: Caret,
    layout: LayoutResult,
    ps: { height: number; marginTop: number; marginBottom: number; marginLeft: number },
    pages?: PageBox[]
  ): ScreenCaret | null {
    const m = Measurer.get();
    const height = ps?.height ?? 1056;
    const marginTop = ps?.marginTop ?? 96;
    const marginBottom = ps?.marginBottom ?? 96;
    const marginLeft = ps?.marginLeft ?? 96;
    const printH = Math.max(100, height - marginTop - marginBottom);

    // ── Try enriched lines from pages first (handles multi-column correctly) ──
    if (pages) {
      for (const page of pages) {
        for (const line of page.lines) {
          if (line.paraIdx !== caret.paraIdx) continue;
          if (caret.charOffset < line.charStart || caret.charOffset > line.charEnd) continue;

          const xBase = ps.marginLeft + (line.xOffset || 0);
          let x = xBase;

          if (line.tokens.length === 0) {
            x = xBase + (line.bounds?.left ?? 0);
          } else {
            for (const tok of line.tokens) {
              if (caret.charOffset <= tok.charStart) break;
              if (caret.charOffset <= tok.charEnd) {
                x = xBase + tok.x + m.measure(tok.text.slice(0, caret.charOffset - tok.charStart), tok.fmt);
                break;
              }
              x = xBase + tok.x + tok.width;
            }
          }

          const localY = line.yVisual ?? (ps.marginTop + (line.y - page.pageIdx * printH));
          return { pageIdx: page.pageIdx, x, localY, height: line.height };
        }
      }
    }

    // ── Fallback: use layout lines directly (single-column, no pages passed) ──
    const lp = layout.paras[caret.paraIdx];
    if (!lp) return null;

    for (const line of lp.lines) {
      if (caret.charOffset < line.charStart || caret.charOffset > line.charEnd) continue;
      let x = ps.marginLeft;
      if (line.tokens.length === 0) {
        x = ps.marginLeft + (line.bounds?.left ?? 0);
      } else {
        for (const tok of line.tokens) {
          if (caret.charOffset <= tok.charStart) break;
          if (caret.charOffset <= tok.charEnd) {
            x = ps.marginLeft + tok.x + m.measure(tok.text.slice(0, caret.charOffset - tok.charStart), tok.fmt);
            break;
          }
          x = ps.marginLeft + tok.x + tok.width;
        }
      }
      const pi = Math.floor(line.y / printH);
      const ly = ps.marginTop + (line.y - pi * printH);
      return { pageIdx: pi, x, localY: ly, height: line.height };
    }
    if (lp.lines.length) {
      const line = lp.lines[0];
      const pi = Math.floor(line.y / printH);
      return { pageIdx: pi, x: ps.marginLeft, localY: ps.marginTop + (line.y - pi * printH), height: line.height };
    }
    return null;
  }

  // Get selection highlight rectangles
  public getSelectionRects(
    sel: SelRange,
    layout: LayoutResult,
    ps: { height: number; marginTop: number; marginBottom: number; marginLeft: number },
    pageIdx: number,
    pages?: PageBox[]
  ): { x: number; y: number; w: number; h: number }[] {
    const m = Measurer.get();
    const ns = normalizeSel(sel);
    const rects: { x: number; y: number; w: number; h: number }[] = [];
    const printH = ps.height - ps.marginTop - ps.marginBottom;

    // Build a lookup of enriched lines from the page if available
    const pageLines = pages?.[pageIdx]?.lines ?? [];

    for (let pi = ns.startPara; pi <= ns.endPara; pi++) {
      const lp = layout.paras[pi];
      if (!lp) continue;

      for (const rawLine of lp.lines) {
        // Find the enriched version of this line from the page (matched by paraIdx + charStart)
        const enriched = pageLines.find(
          l => l.paraIdx === rawLine.paraIdx && l.charStart === rawLine.charStart
        );

        let localY: number;
        if (enriched) {
          localY = enriched.yVisual ?? (ps.marginTop + (enriched.y - pageIdx * printH));
        } else {
          const lpi = Math.floor(rawLine.y / printH);
          if (lpi !== pageIdx) continue;
          localY = ps.marginTop + (rawLine.y - lpi * printH);
        }

        const line = enriched ?? rawLine;
        const xBase = ps.marginLeft + (line.xOffset || 0);

        const from = pi === ns.startPara ? ns.startChar : line.charStart;
        const to = pi === ns.endPara ? ns.endChar : line.charEnd;
        if (from >= to) {
          if (ns.startPara === ns.endPara) continue;
          if (pi === ns.endPara && to === 0 && line.charEnd > 0) continue;
        }

        if (from >= line.charEnd && line.charStart < line.charEnd) continue;
        if (to <= line.charStart && line.charStart < line.charEnd) continue;

        let xFrom: number | undefined = undefined;
        let xTo: number | undefined = undefined;
        for (const tok of line.tokens) {
          if (from <= tok.charStart) {
            xFrom = Math.min(xFrom ?? Infinity, xBase + tok.x);
          } else if (from > tok.charStart && from <= tok.charEnd) {
            xFrom = xBase + tok.x + m.measure(tok.text.slice(0, from - tok.charStart), tok.fmt);
          }
          if (to <= tok.charStart) {
            if (xTo === undefined) xTo = xBase + tok.x;
            break;
          }
          if (to <= tok.charEnd) {
            xTo = xBase + tok.x + m.measure(tok.text.slice(0, to - tok.charStart), tok.fmt);
            break;
          }
          xTo = xBase + tok.x + tok.width;
        }
        if (line.tokens.length === 0) {
          xFrom = xBase + (line.bounds?.left ?? 0);
          xTo = xFrom + 2;
        }

        if (xFrom !== undefined && xTo !== undefined) {
          rects.push({ x: xFrom - ps.marginLeft, y: localY - ps.marginTop, w: Math.max(2, xTo - xFrom), h: line.height });
        }
      }
    }
    return rects;
  }

  // Hit test from relative (x,y) document coordinates to find Caret
  public hitTest(
    pIdx: number,
    clickX: number,
    clickY: number,
    pages: PageBox[],
    ps: { height: number; marginTop: number; marginBottom: number; marginLeft: number }
  ): Caret {
    const m = Measurer.get();
    const page = pages[pIdx];
    if (!page?.lines.length) return { paraIdx: 0, charOffset: 0 };

    // Use visual Y for hit testing (handles multi-column)
    let bestLines: typeof page.lines = [];
    let bestD = Infinity;
    for (const line of page.lines) {
      const lineVisualY = line.yVisual ?? (ps.marginTop + (line.y - pIdx * (ps.height - ps.marginTop - ps.marginBottom)));
      const d = Math.abs(clickY - (lineVisualY + line.height / 2));
      if (d < bestD - 1) {
        bestD = d;
        bestLines = [line];
      } else if (Math.abs(d - bestD) <= 1) {
        bestLines.push(line);
      }
    }

    if (!bestLines.length) return { paraIdx: 0, charOffset: 0 };

    let best = bestLines[0];
    if (bestLines.length > 1) {
      const clickVisualX = clickX - ps.marginLeft;
      let minXDist = Infinity;
      for (const line of bestLines) {
        const left = (line.xOffset || 0) + (line.bounds?.left ?? 0);
        const right = (line.xOffset || 0) + (line.bounds?.right ?? 9999);
        if (clickVisualX >= left && clickVisualX <= right) {
          best = line;
          break;
        }
        const dist = Math.min(Math.abs(clickVisualX - left), Math.abs(clickVisualX - right));
        if (dist < minXDist) {
          minXDist = dist;
          best = line;
        }
      }
    }

    if (!best.tokens.length) return { paraIdx: best.paraIdx, charOffset: best.charStart };

    // Adjust click X relative to column xOffset
    const adjustedX = (clickX - ps.marginLeft) - (best.xOffset || 0);

    for (const tok of best.tokens) {
      if (adjustedX <= tok.x) return { paraIdx: best.paraIdx, charOffset: tok.charStart };
      if (adjustedX < tok.x + tok.width) {
        for (let ci = 0; ci <= tok.text.length; ci++) {
          const cx = tok.x + m.measure(tok.text.slice(0, ci), tok.fmt);
          const hw = ci < tok.text.length ? m.measure(tok.text[ci], tok.fmt) / 2 : 0;
          if (adjustedX <= cx + hw) return { paraIdx: tok.paraIdx, charOffset: tok.charStart + ci };
        }
      }
    }
    const last = best.tokens[best.tokens.length - 1];
    return { paraIdx: last.paraIdx, charOffset: last.charEnd };
  }
}
