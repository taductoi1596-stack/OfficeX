import { parseCellRef } from '../utils/cellUtils';

export class FormulaParser {
  // Extracts cell references from a formula string (e.g., "=A1+B2" -> ["A1", "B2"])
  public extractReferences(formula: string): string[] {
    if (!formula || !formula.startsWith('=')) return [];
    
    // Match basic cell references like A1, B2, AA10, but not functions like SUM
    const regex = /\b[A-Z]+[0-9]+\b/g;
    const matches = formula.match(regex);
    return matches ? Array.from(new Set(matches)) : [];
  }

  // Parse and evaluate the formula, retrieving referenced cell values via getCellValue
  public parseAndEvaluate(formula: string, getCellValue: (ref: string) => any): any {
    if (!formula.startsWith('=')) {
      const parsed = parseFloat(formula);
      return isNaN(parsed) ? formula : parsed;
    }

    let expr = formula.substring(1).toUpperCase();

    const match = expr.match(/^([A-Z]+)\((.*)\)$/);
    if (match) {
      const funcName = match[1];
      const inside = match[2];
      
      const getRangeValues = (str: string): number[] => {
        const values: number[] = [];
        if (!str.trim()) return values;

        // Trivial split by comma
        const args = str.split(',');
        for (const arg of args) {
          const trimmed = arg.trim();
          if (trimmed.includes(':')) {
            const parts = trimmed.split(':');
            if (parts.length === 2) {
              const start = parseCellRef(parts[0].trim());
              const end = parseCellRef(parts[1].trim());
              if (start && end) {
                const minRow = Math.min(start.row, end.row);
                const maxRow = Math.max(start.row, end.row);
                const minCol = Math.min(start.col, end.col);
                const maxCol = Math.max(start.col, end.col);
                for (let r = minRow; r <= maxRow; r++) {
                  for (let c = minCol; c <= maxCol; c++) {
                     let colStr = '';
                     let tempC = c;
                     while (tempC > 0) {
                       let mod = (tempC - 1) % 26;
                       colStr = String.fromCharCode(65 + mod) + colStr;
                       tempC = Math.floor((tempC - 1) / 26);
                     }
                     const val = getCellValue(`${colStr}${r}`);
                     if (typeof val === 'number' && !isNaN(val)) values.push(val);
                     else if (typeof val === 'string' && val.trim() !== '' && !isNaN(parseFloat(val))) values.push(parseFloat(val));
                  }
                }
              }
            }
          } else {
             const num = parseFloat(trimmed);
             if (!isNaN(num) && num.toString() === trimmed) {
               values.push(num);
             } else {
               const val = getCellValue(trimmed);
               if (typeof val === 'number' && !isNaN(val)) values.push(val);
               else if (typeof val === 'string' && val.trim() !== '' && !isNaN(parseFloat(val))) values.push(parseFloat(val));
             }
          }
        }
        return values;
      };

      if (['SUM', 'AVERAGE', 'COUNT', 'MAX', 'MIN'].includes(funcName)) {
        const values = getRangeValues(inside);
        
        if (funcName === 'SUM') return values.reduce((a, b) => a + b, 0);
        if (funcName === 'COUNT') return values.length;
        if (funcName === 'MAX') return values.length ? Math.max(...values) : 0;
        if (funcName === 'MIN') return values.length ? Math.min(...values) : 0;
        if (funcName === 'AVERAGE') return values.length ? values.reduce((a, b) => a + b, 0) / values.length : '#DIV/0!';
      }
    }

    // Evaluate basic math with references (e.g. A1 + B2)
    // Replace all cell refs with their values
    try {
      const refs = this.extractReferences(formula);
      let evalExpr = expr;
      for (const ref of refs) {
        const raw = getCellValue(ref);
        let numVal: number;
        if (raw === null || raw === undefined || raw === '') {
          numVal = 0;
        } else if (typeof raw === 'number') {
          numVal = raw;
        } else {
          const parsed = parseFloat(String(raw));
          numVal = isNaN(parsed) ? 0 : parsed;
        }
        evalExpr = evalExpr.replace(new RegExp(`\\b${ref}\\b`, 'g'), numVal.toString());
      }

      // WARNING: Using eval for quick prototyping. A real engine uses an AST interpreter.
      // Filter out dangerous characters
      if (/[^0-9+\-*/().\s]/.test(evalExpr)) {
        return '#NAME?';
      }
      
      // eslint-disable-next-line no-eval
      const result = eval(evalExpr);
      return isNaN(result) ? '#VALUE!' : result;
    } catch (e) {
      return '#ERROR!';
    }
  }
}
