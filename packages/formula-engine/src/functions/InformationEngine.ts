/**
 * INFORMATION ENGINE
 *
 * Full Excel-compatible Information functions (ISBLANK, ISNUMBER, etc.)
 */

// ── helpers ──────────────────────────────────────────────────────────────────

function isErrorString(val: any): boolean {
  return typeof val === 'string' && val.startsWith('#');
}

// ── main class ────────────────────────────────────────────────────────────────

export class InformationEngine {
  public static registerFunctions(registry: any) {
    
    // ── IS... FUNCTIONS ──────────────────────────────────────────────────────

    registry.register('ISBLANK', (value: any) => {
      // In a real spreadsheet, an empty cell evaluates to null or undefined or an empty string
      // depending on parser/evaluator. We assume null, undefined, or strictly empty string.
      return value === null || value === undefined || value === '';
    });

    registry.register('ISERR', (value: any) => {
      // Any error EXCEPT #N/A
      return isErrorString(value) && value !== '#N/A';
    });

    registry.register('ISERROR', (value: any) => {
      // Any error including #N/A
      return isErrorString(value);
    });

    registry.register('ISEVEN', (value: any) => {
      if (isErrorString(value)) return value;
      const num = Math.floor(Math.abs(parseFloat(value)));
      if (isNaN(num)) return '#VALUE!';
      return num % 2 === 0;
    });

    registry.register('ISLOGICAL', (value: any) => {
      return typeof value === 'boolean';
    });

    registry.register('ISNA', (value: any) => {
      return value === '#N/A';
    });

    registry.register('ISNONTEXT', (value: any) => {
      if (value === null || value === undefined || value === '') return true; // blank cell is non-text
      return typeof value !== 'string' || isErrorString(value); // error values are non-text
    });

    registry.register('ISNUMBER', (value: any) => {
      if (typeof value === 'number' && !isNaN(value)) return true;
      if (typeof value === 'string' && value.trim() !== '') {
         // In Excel, strings aren't strictly numbers, but some evaluators implicitly cast.
         // ISNUMBER typically returns FALSE for text that looks like a number.
         return false; 
      }
      return false;
    });

    registry.register('ISODD', (value: any) => {
      if (isErrorString(value)) return value;
      const num = Math.floor(Math.abs(parseFloat(value)));
      if (isNaN(num)) return '#VALUE!';
      return num % 2 === 1;
    });

    registry.register('ISTEXT', (value: any) => {
      return typeof value === 'string' && !isErrorString(value);
    });

    registry.register('ISREF', (value: any) => {
      // Needs evaluator context. Usually returns false for hardcoded values.
      // We will return false here as a stub, assuming evaluated value is passed.
      return false; 
    });

    registry.register('ISFORMULA', (reference: any) => {
      // Needs AST/Evaluator context.
      return false;
    });

    // ── N & NA ───────────────────────────────────────────────────────────────

    registry.register('N', (value: any) => {
      if (typeof value === 'number') return value;
      if (typeof value === 'boolean') return value ? 1 : 0;
      if (isErrorString(value)) return value;
      // text and anything else
      return 0; 
    });

    registry.register('NA', () => {
      return '#N/A';
    });

    // ── TYPE & ERROR.TYPE ────────────────────────────────────────────────────

    registry.register('TYPE', (value: any) => {
      if (value === null || value === undefined || value === '') return 1; // Number (blank = 0)
      if (typeof value === 'number') return 1;
      if (typeof value === 'string' && !isErrorString(value)) return 2;
      if (typeof value === 'boolean') return 4;
      if (isErrorString(value)) return 16;
      if (Array.isArray(value)) return 64;
      // Compound data type / object
      return 128;
    });

    registry.register('ERROR.TYPE', (errorVal: any) => {
      const errMap: Record<string, number> = {
        '#NULL!': 1,
        '#DIV/0!': 2,
        '#VALUE!': 3,
        '#REF!': 4,
        '#NAME?': 5,
        '#NUM!': 6,
        '#N/A': 7,
        '#GETTING_DATA': 8,
        '#SPILL!': 9,
        '#CONNECT!': 10,
        '#BLOCKED!': 11,
        '#UNKNOWN!': 12,
        '#FIELD!': 13,
        '#CALC!': 14
      };
      
      const type = errMap[String(errorVal).toUpperCase()];
      if (type) return type;
      return '#N/A'; // if not an error
    });

    // ── WORKBOOK/SHEET RELATED (Stubs) ───────────────────────────────────────

    registry.register('CELL', (infoType: any, reference: any = null) => {
      // Usually requires evaluator context for format, address, row, col, etc.
      // E.g., CELL("row", A1) -> 1
      return '#VALUE!';
    });

    registry.register('INFO', (typeText: any) => {
      const t = String(typeText).toLowerCase();
      if (t === 'osversion') return 'Windows (OfficeX)';
      if (t === 'system') return 'pcdos';
      if (t === 'release') return '16.0';
      if (t === 'numfile') return 1;
      if (t === 'recalc') return 'Automatic';
      return '#VALUE!';
    });

    registry.register('SHEET', (value: any = null) => {
      // Normally returns sheet index of reference
      return 1;
    });

    registry.register('SHEETS', (reference: any = null) => {
      // Normally returns number of sheets in reference
      return 1;
    });

  }
}
