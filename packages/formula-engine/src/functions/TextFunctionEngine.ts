/**
 * TEXT FUNCTION ENGINE
 *
 * Full Excel-compatible Text functions.
 */

// ── helpers ──────────────────────────────────────────────────────────────────

function flat1D(v: any): any[] {
  if (!Array.isArray(v)) return [v];
  return (v as any[]).flat(Infinity);
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ── main class ────────────────────────────────────────────────────────────────

export class TextFunctionEngine {
  public static registerFunctions(registry: any) {
    
    // ── CHAR & CODE ──────────────────────────────────────────────────────────
    
    registry.register('CHAR', (number: any) => {
      const n = parseInt(number);
      if (isNaN(n) || n < 1 || n > 255) return '#VALUE!';
      return String.fromCharCode(n);
    });

    registry.register('UNICHAR', (number: any) => {
      const n = parseInt(number);
      if (isNaN(n) || n <= 0) return '#VALUE!';
      try {
        return String.fromCodePoint(n);
      } catch (e) {
        return '#VALUE!';
      }
    });

    registry.register('CODE', (text: any) => {
      const str = String(text);
      if (str.length === 0) return '#VALUE!';
      return str.charCodeAt(0);
    });

    registry.register('UNICODE', (text: any) => {
      const str = String(text);
      if (str.length === 0) return '#VALUE!';
      return str.codePointAt(0);
    });

    // ── CLEAN & TRIM ─────────────────────────────────────────────────────────

    registry.register('CLEAN', (text: any) => {
      const str = String(text);
      // Remove non-printable characters (0-31)
      return str.replace(/[\x00-\x1F]/g, '');
    });

    registry.register('TRIM', (text: any) => {
      const str = String(text);
      // Remove leading/trailing spaces and replace multiple spaces with single space
      return str.trim().replace(/\s+/g, ' ');
    });

    // ── CASE ─────────────────────────────────────────────────────────────────

    registry.register('LOWER', (text: any) => String(text).toLowerCase());
    
    registry.register('UPPER', (text: any) => String(text).toUpperCase());

    registry.register('PROPER', (text: any) => {
      const str = String(text);
      return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
      });
    });

    // ── EXACT ────────────────────────────────────────────────────────────────

    registry.register('EXACT', (text1: any, text2: any) => {
      return String(text1) === String(text2);
    });

    // ── FIND & SEARCH ────────────────────────────────────────────────────────

    registry.register('FIND', (findText: any, withinText: any, startNum: any = 1) => {
      const ft = String(findText);
      const wt = String(withinText);
      const start = parseInt(startNum);
      if (isNaN(start) || start < 1) return '#VALUE!';
      const idx = wt.indexOf(ft, start - 1);
      return idx === -1 ? '#VALUE!' : idx + 1;
    });

    registry.register('SEARCH', (findText: any, withinText: any, startNum: any = 1) => {
      const ft = String(findText).toLowerCase();
      const wt = String(withinText).toLowerCase();
      const start = parseInt(startNum);
      if (isNaN(start) || start < 1) return '#VALUE!';
      
      // Handle wildcards ? and *
      if (ft.includes('?') || ft.includes('*')) {
        const pat = ft.replace(/\?/g, '.').replace(/\*/g, '.*');
        const regex = new RegExp(pat, 'i');
        const match = wt.substring(start - 1).match(regex);
        if (match && match.index !== undefined) {
          return start + match.index;
        }
        return '#VALUE!';
      } else {
        const idx = wt.indexOf(ft, start - 1);
        return idx === -1 ? '#VALUE!' : idx + 1;
      }
    });

    // ── LEFT, RIGHT, MID ─────────────────────────────────────────────────────

    registry.register('LEFT', (text: any, numChars: any = 1) => {
      const chars = parseInt(numChars);
      if (isNaN(chars) || chars < 0) return '#VALUE!';
      return String(text).substring(0, chars);
    });

    registry.register('RIGHT', (text: any, numChars: any = 1) => {
      const chars = parseInt(numChars);
      if (isNaN(chars) || chars < 0) return '#VALUE!';
      const str = String(text);
      return str.substring(str.length - chars);
    });

    registry.register('MID', (text: any, startNum: any, numChars: any) => {
      const start = parseInt(startNum);
      const chars = parseInt(numChars);
      if (isNaN(start) || isNaN(chars) || start < 1 || chars < 0) return '#VALUE!';
      return String(text).substring(start - 1, start - 1 + chars);
    });

    // ── LEN ──────────────────────────────────────────────────────────────────

    registry.register('LEN', (text: any) => String(text).length);

    // ── REPLACE & SUBSTITUTE ─────────────────────────────────────────────────

    registry.register('REPLACE', (oldText: any, startNum: any, numChars: any, newText: any) => {
      const ot = String(oldText);
      const start = parseInt(startNum);
      const chars = parseInt(numChars);
      const nt = String(newText);
      if (isNaN(start) || isNaN(chars) || start < 1 || chars < 0) return '#VALUE!';
      return ot.substring(0, start - 1) + nt + ot.substring(start - 1 + chars);
    });

    registry.register('SUBSTITUTE', (text: any, oldText: any, newText: any, instanceNum: any = null) => {
      const t = String(text);
      const ot = String(oldText);
      const nt = String(newText);
      if (ot.length === 0) return t;

      if (instanceNum !== null) {
        const inst = parseInt(instanceNum);
        if (isNaN(inst) || inst < 1) return '#VALUE!';
        let currentInst = 0;
        let pos = 0;
        while (pos < t.length) {
          const idx = t.indexOf(ot, pos);
          if (idx === -1) break;
          currentInst++;
          if (currentInst === inst) {
            return t.substring(0, idx) + nt + t.substring(idx + ot.length);
          }
          pos = idx + ot.length;
        }
        return t; // instance not found
      } else {
        // Replace all
        return t.split(ot).join(nt);
      }
    });

    // ── REPT ─────────────────────────────────────────────────────────────────

    registry.register('REPT', (text: any, numberTimes: any) => {
      const t = String(text);
      const n = parseInt(numberTimes);
      if (isNaN(n) || n < 0) return '#VALUE!';
      if (n === 0) return '';
      try {
        return t.repeat(n);
      } catch (e) {
        return '#VALUE!'; // E.g., string too long
      }
    });

    // ── CONCAT & CONCATENATE & TEXTJOIN ──────────────────────────────────────

    registry.register('CONCATENATE', (...args: any[]) => {
      // CONCATENATE does not flat-map arrays, just joins arguments directly
      return args.map(a => String(a)).join('');
    });

    registry.register('CONCAT', (...args: any[]) => {
      // CONCAT flattens arrays
      let result = '';
      for (const arg of args) {
        result += flat1D(arg).map(a => String(a)).join('');
      }
      return result;
    });

    registry.register('TEXTJOIN', (delimiter: any, ignoreEmpty: any, ...args: any[]) => {
      const delim = String(delimiter);
      const ignore = Boolean(ignoreEmpty) && ignoreEmpty !== 0 && String(ignoreEmpty).toLowerCase() !== 'false';
      const strings: string[] = [];
      for (const arg of args) {
        const flat = flat1D(arg);
        for (const val of flat) {
          if (val === null || val === undefined || val === '') {
            if (!ignore) strings.push('');
          } else {
            strings.push(String(val));
          }
        }
      }
      return strings.join(delim);
    });

    // ── TEXTBEFORE / TEXTAFTER / TEXTSPLIT ───────────────────────────────────

    registry.register('TEXTBEFORE', (text: any, delimiter: any, instanceNum: any = 1, matchMode: any = 0, matchEnd: any = 0, ifNotFound: any = '#N/A') => {
      const t = String(text);
      const d = String(delimiter);
      let inst = parseInt(instanceNum) || 1;
      const mm = parseInt(matchMode) || 0; // 0 = case-sensitive, 1 = case-insensitive
      
      let searchT = t;
      let searchD = d;
      if (mm === 1) {
        searchT = t.toLowerCase();
        searchD = d.toLowerCase();
      }

      if (inst > 0) {
        let pos = 0;
        let currentInst = 0;
        while (pos < t.length) {
          const idx = searchT.indexOf(searchD, pos);
          if (idx === -1) break;
          currentInst++;
          if (currentInst === inst) return t.substring(0, idx);
          pos = idx + d.length;
        }
        if (parseInt(matchEnd) === 1 && currentInst + 1 === inst) return t;
      } else {
        // Negative instance number (search from end)
        inst = Math.abs(inst);
        let pos = t.length;
        let currentInst = 0;
        while (pos >= 0) {
          const idx = searchT.lastIndexOf(searchD, pos - 1);
          if (idx === -1) break;
          currentInst++;
          if (currentInst === inst) return t.substring(0, idx);
          pos = idx;
        }
        if (parseInt(matchEnd) === 1 && currentInst + 1 === inst) return t;
      }
      
      return ifNotFound;
    });

    registry.register('TEXTAFTER', (text: any, delimiter: any, instanceNum: any = 1, matchMode: any = 0, matchEnd: any = 0, ifNotFound: any = '#N/A') => {
      const t = String(text);
      const d = String(delimiter);
      let inst = parseInt(instanceNum) || 1;
      const mm = parseInt(matchMode) || 0;
      
      let searchT = t;
      let searchD = d;
      if (mm === 1) {
        searchT = t.toLowerCase();
        searchD = d.toLowerCase();
      }

      if (inst > 0) {
        let pos = 0;
        let currentInst = 0;
        while (pos < t.length) {
          const idx = searchT.indexOf(searchD, pos);
          if (idx === -1) break;
          currentInst++;
          if (currentInst === inst) return t.substring(idx + d.length);
          pos = idx + d.length;
        }
        if (parseInt(matchEnd) === 1 && currentInst + 1 === inst) return "";
      } else {
        inst = Math.abs(inst);
        let pos = t.length;
        let currentInst = 0;
        while (pos >= 0) {
          const idx = searchT.lastIndexOf(searchD, pos - 1);
          if (idx === -1) break;
          currentInst++;
          if (currentInst === inst) return t.substring(idx + d.length);
          pos = idx;
        }
        if (parseInt(matchEnd) === 1 && currentInst + 1 === inst) return "";
      }
      
      return ifNotFound;
    });

    registry.register('TEXTSPLIT', (text: any, colDelimiter: any, rowDelimiter: any = null, ignoreEmpty: any = false, matchMode: any = 0, padWith: any = '#N/A') => {
      const t = String(text);
      const mm = parseInt(matchMode) || 0;
      const ignore = Boolean(ignoreEmpty) && ignoreEmpty !== 0 && String(ignoreEmpty).toLowerCase() !== 'false';
      
      let rows: string[] = [t];
      if (rowDelimiter !== null && String(rowDelimiter) !== '') {
        const rd = String(rowDelimiter);
        if (mm === 1) {
          const regex = new RegExp(escapeRegExp(rd), 'ig');
          rows = t.split(regex);
        } else {
          rows = t.split(rd);
        }
      }

      const grid: string[][] = [];
      let maxCols = 0;

      for (const r of rows) {
        let cols: string[] = [r];
        if (colDelimiter !== null && String(colDelimiter) !== '') {
          const cd = String(colDelimiter);
          if (mm === 1) {
            const regex = new RegExp(escapeRegExp(cd), 'ig');
            cols = r.split(regex);
          } else {
            cols = r.split(cd);
          }
        }
        if (ignore) {
          cols = cols.filter(c => c !== '');
        }
        if (cols.length === 0 && ignore) continue; // Skip empty row entirely if ignoring empty
        maxCols = Math.max(maxCols, cols.length);
        grid.push(cols);
      }

      if (grid.length === 0) return '#N/A';
      
      // Pad with padWith
      for (const r of grid) {
        while (r.length < maxCols) r.push(padWith);
      }

      return grid.length === 1 ? (grid[0].length === 1 ? grid[0][0] : grid[0]) : grid;
    });

    // ── VALUE & NUMBERVALUE ──────────────────────────────────────────────────

    registry.register('VALUE', (text: any) => {
      const t = String(text).trim();
      if (t === '') return 0;
      const num = parseFloat(t.replace(/,/g, ''));
      return isNaN(num) ? '#VALUE!' : num;
    });

    registry.register('NUMBERVALUE', (text: any, decimalSeparator: any = '.', groupSeparator: any = ',') => {
      let t = String(text).trim();
      const dec = String(decimalSeparator).charAt(0) || '.';
      const grp = String(groupSeparator).charAt(0) || ',';
      
      // Remove group separators
      t = t.split(grp).join('');
      // Replace decimal separator with standard dot
      t = t.split(dec).join('.');
      
      // Handle percentages
      let pctFactor = 1;
      while (t.endsWith('%')) {
        pctFactor *= 100;
        t = t.slice(0, -1);
      }

      const num = parseFloat(t);
      return isNaN(num) ? '#VALUE!' : num / pctFactor;
    });

    // ── FIXED & DOLLAR ───────────────────────────────────────────────────────

    registry.register('FIXED', (number: any, decimals: any = 2, noCommas: any = false) => {
      const num = parseFloat(number);
      const dec = parseInt(decimals);
      if (isNaN(num) || isNaN(dec)) return '#VALUE!';
      const noC = Boolean(noCommas) && noCommas !== 0 && String(noCommas).toLowerCase() !== 'false';
      
      // Factor for rounding
      const factor = Math.pow(10, dec);
      const rounded = Math.round(num * factor) / factor;
      
      if (noC) return rounded.toFixed(Math.max(0, dec));
      
      return rounded.toLocaleString('en-US', { 
        minimumFractionDigits: Math.max(0, dec), 
        maximumFractionDigits: Math.max(0, dec) 
      });
    });

    registry.register('DOLLAR', (number: any, decimals: any = 2) => {
      const num = parseFloat(number);
      const dec = parseInt(decimals);
      if (isNaN(num) || isNaN(dec)) return '#VALUE!';
      const factor = Math.pow(10, dec);
      const rounded = Math.round(num * factor) / factor;
      return '$' + rounded.toLocaleString('en-US', { 
        minimumFractionDigits: Math.max(0, dec), 
        maximumFractionDigits: Math.max(0, dec) 
      });
    });

    // ── T ────────────────────────────────────────────────────────────────────

    registry.register('T', (value: any) => {
      if (typeof value === 'string') return value;
      return '';
    });

  }
}
