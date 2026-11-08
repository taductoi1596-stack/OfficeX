import type { DocPara, RunFmt } from '../document/DocumentTypes';
import { TextToken, TextLine, TextPara } from './TextTypes';
import { Measurer } from '../layout/Measurer';

export class TextEngine {
  private static _instance: TextEngine;

  public static get(): TextEngine {
    if (!this._instance) {
      this._instance = new TextEngine();
    }
    return this._instance;
  }

  /**
   * Processes a single paragraph, breaking it into words and wrapping it into lines
   * based on the provided width constraints.
   */
  public wrapParagraph(para: DocPara, firstLineAvailW: number, subsequentAvailW: number, lineSpacing: number = 1.0): TextPara {
    const m = Measurer.get();

    // 1. Tokenize runs → word tokens
    type RawTok = { text: string; fmt: RunFmt; cs: number; ce: number };
    const rawToks: RawTok[] = [];
    let cp = 0;
    for (const run of para.runs) {
      const parts = run.text.split(/(\s+)/u);
      for (const part of parts) {
        if (!part && !run.fmt.inlineImage) continue;
        rawToks.push({ text: part, fmt: run.fmt, cs: cp, ce: cp + part.length });
        cp += part.length;
      }
    }

    const defFmt = para.runs[0]?.fmt ?? {};
    const lines: TextLine[] = [];

    if (rawToks.length === 0) {
      const lh = m.lineH(defFmt, lineSpacing);
      lines.push({ 
        tokens: [], width: 0, height: lh, baseline: m.ascH(defFmt),
        charStart: 0, charEnd: 0 
      });
      return { paraIdx: para.id ? 0 : 0, lines }; // We'll pass paraIdx from caller instead
    }

    let lToks: TextToken[] = [];
    let lW   = 0;
    let lH   = 0;
    let lAsc = 0;
    let lCS  = 0;
    let isFirstLine = true;
    let firstInLine = true;

    const flush = (charEnd: number, isLastLine = false) => {
      lines.push({ 
        tokens: lToks, 
        width: lW,
        height: lH || m.lineH(defFmt, lineSpacing),
        baseline: lAsc || m.ascH(defFmt),
        charStart: lCS, 
        charEnd 
      });
      lToks = []; lW = 0; lH = 0; lAsc = 0;
      isFirstLine = false;
      firstInLine = true;
    };

    // Pre-process tokens: break long continuous words character-by-character if they exceed line width
    const processedToks: RawTok[] = [];
    for (const tok of rawToks) {
      const isWS = /^\s+$/.test(tok.text);
      if (isWS || !tok.text) {
        processedToks.push(tok);
        continue;
      }

      const w = m.measure(tok.text, tok.fmt);
      const rightBound = processedToks.length === 0 ? firstLineAvailW : subsequentAvailW;

      if (w > rightBound) {
        let curStr = '';
        let startCs = tok.cs;
        for (let i = 0; i < tok.text.length; i++) {
          const char = tok.text[i];
          const testStr = curStr + char;
          if (m.measure(testStr, tok.fmt) > rightBound && curStr.length > 0) {
            processedToks.push({ text: curStr, fmt: tok.fmt, cs: startCs, ce: startCs + curStr.length });
            startCs += curStr.length;
            curStr = char;
          } else {
            curStr = testStr;
          }
        }
        if (curStr.length > 0) {
          processedToks.push({ text: curStr, fmt: tok.fmt, cs: startCs, ce: startCs + curStr.length });
        }
      } else {
        processedToks.push(tok);
      }
    }

    for (const tok of processedToks) {
      const isWS = /^\s+$/.test(tok.text);
      const w    = m.measure(tok.text, tok.fmt);
      const lh   = m.lineH(tok.fmt, lineSpacing);
      const asc  = m.ascH(tok.fmt);

      if (firstInLine && isWS) { lCS = tok.ce; continue; }
      
      const rightBound = isFirstLine ? firstLineAvailW : subsequentAvailW;

      if (!firstInLine && lW + w > rightBound && !isWS) {
        flush(tok.cs, false); lCS = tok.cs;
      }
      lToks.push({ 
        text: tok.text, width: w, fmt: tok.fmt,
        paraIdx: 0, charStart: tok.cs, charEnd: tok.ce 
      });
      lW += w; lH = Math.max(lH, lh); lAsc = Math.max(lAsc, asc); firstInLine = false;
    }
    flush(cp, true);

    return { paraIdx: 0, lines };
  }
}
