/**
 * LOGICAL ENGINE
 *
 * Full Excel-compatible Logical functions.
 */

// ── helpers ──────────────────────────────────────────────────────────────────

function flat1D(v: any): any[] {
  if (!Array.isArray(v)) return [v];
  return (v as any[]).flat(Infinity);
}

function toBool(v: any): boolean | null {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'string') {
    const l = v.toLowerCase();
    if (l === 'true') return true;
    if (l === 'false') return false;
  }
  return null;
}

function isError(val: any): boolean {
  return typeof val === 'string' && val.startsWith('#');
}

// ── main class ────────────────────────────────────────────────────────────────

export class LogicalEngine {
  public static registerFunctions(registry: any) {
    
    // ── TRUE / FALSE ─────────────────────────────────────────────────────────

    registry.register('TRUE', () => true);
    registry.register('FALSE', () => false);

    // ── IF / IFS / SWITCH ────────────────────────────────────────────────────

    registry.register('IF', (condition: any, trueResult: any, falseResult: any = false) => {
      // Note: Full short-circuit evaluation requires AST-level support.
      // This is the functional fallback.
      const cond = toBool(condition);
      if (cond === null) return '#VALUE!';
      return cond ? trueResult : falseResult;
    });

    registry.register('IFS', (...args: any[]) => {
      if (args.length % 2 !== 0) return '#N/A';
      for (let i = 0; i < args.length; i += 2) {
        const cond = toBool(args[i]);
        if (cond === null) return '#VALUE!';
        if (cond) return args[i + 1];
      }
      return '#N/A';
    });

    registry.register('SWITCH', (expression: any, ...args: any[]) => {
      // expression, val1, res1, [val2, res2, ...], [default]
      if (args.length === 0) return '#N/A';
      
      const expStr = String(expression).toLowerCase();
      
      let i = 0;
      while (i < args.length - 1) {
        const matchVal = String(args[i]).toLowerCase();
        if (expStr === matchVal || expression === args[i]) {
          return args[i + 1];
        }
        i += 2;
      }
      
      // Check if there's a default value at the end
      if (i === args.length - 1) {
        return args[i];
      }
      
      return '#N/A';
    });

    // ── AND / OR / XOR / NOT ─────────────────────────────────────────────────

    registry.register('AND', (...args: any[]) => {
      let hasArgs = false;
      for (const arg of args) {
        const flat = flat1D(arg);
        for (const item of flat) {
          const b = toBool(item);
          if (b !== null) {
            hasArgs = true;
            if (!b) return false;
          }
        }
      }
      return hasArgs ? true : '#VALUE!';
    });

    registry.register('OR', (...args: any[]) => {
      let hasArgs = false;
      for (const arg of args) {
        const flat = flat1D(arg);
        for (const item of flat) {
          const b = toBool(item);
          if (b !== null) {
            hasArgs = true;
            if (b) return true;
          }
        }
      }
      return hasArgs ? false : '#VALUE!';
    });

    registry.register('XOR', (...args: any[]) => {
      let hasArgs = false;
      let trueCount = 0;
      for (const arg of args) {
        const flat = flat1D(arg);
        for (const item of flat) {
          const b = toBool(item);
          if (b !== null) {
            hasArgs = true;
            if (b) trueCount++;
          }
        }
      }
      if (!hasArgs) return '#VALUE!';
      return trueCount % 2 === 1; // XOR returns TRUE if odd number of TRUEs
    });

    registry.register('NOT', (logical: any) => {
      const b = toBool(Array.isArray(logical) ? logical[0] : logical);
      if (b === null) return '#VALUE!';
      return !b;
    });

    // ── IFERROR / IFNA ───────────────────────────────────────────────────────

    registry.register('IFERROR', (value: any, valueIfError: any) => {
      if (isError(value)) return valueIfError;
      return value;
    });

    registry.register('IFNA', (value: any, valueIfNa: any) => {
      if (value === '#N/A') return valueIfNa;
      return value;
    });
    
  }
}
