/**
 * LOGICAL ENGINE
 *
 * Full Excel-compatible Logical functions.
 */
// ── helpers ──────────────────────────────────────────────────────────────────
function flat1D(v) {
    if (!Array.isArray(v))
        return [v];
    return v.flat(Infinity);
}
function toBool(v) {
    if (typeof v === 'boolean')
        return v;
    if (typeof v === 'number')
        return v !== 0;
    if (typeof v === 'string') {
        const l = v.toLowerCase();
        if (l === 'true')
            return true;
        if (l === 'false')
            return false;
    }
    return null;
}
function isError(val) {
    return typeof val === 'string' && val.startsWith('#');
}
// ── main class ────────────────────────────────────────────────────────────────
export class LogicalEngine {
    static registerFunctions(registry) {
        // ── TRUE / FALSE ─────────────────────────────────────────────────────────
        registry.register('TRUE', () => true);
        registry.register('FALSE', () => false);
        // ── IF / IFS / SWITCH ────────────────────────────────────────────────────
        registry.register('IF', (condition, trueResult, falseResult = false) => {
            // Note: Full short-circuit evaluation requires AST-level support.
            // This is the functional fallback.
            const cond = toBool(condition);
            if (cond === null)
                return '#VALUE!';
            return cond ? trueResult : falseResult;
        });
        registry.register('IFS', (...args) => {
            if (args.length % 2 !== 0)
                return '#N/A';
            for (let i = 0; i < args.length; i += 2) {
                const cond = toBool(args[i]);
                if (cond === null)
                    return '#VALUE!';
                if (cond)
                    return args[i + 1];
            }
            return '#N/A';
        });
        registry.register('SWITCH', (expression, ...args) => {
            // expression, val1, res1, [val2, res2, ...], [default]
            if (args.length === 0)
                return '#N/A';
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
        registry.register('AND', (...args) => {
            let hasArgs = false;
            for (const arg of args) {
                const flat = flat1D(arg);
                for (const item of flat) {
                    const b = toBool(item);
                    if (b !== null) {
                        hasArgs = true;
                        if (!b)
                            return false;
                    }
                }
            }
            return hasArgs ? true : '#VALUE!';
        });
        registry.register('OR', (...args) => {
            let hasArgs = false;
            for (const arg of args) {
                const flat = flat1D(arg);
                for (const item of flat) {
                    const b = toBool(item);
                    if (b !== null) {
                        hasArgs = true;
                        if (b)
                            return true;
                    }
                }
            }
            return hasArgs ? false : '#VALUE!';
        });
        registry.register('XOR', (...args) => {
            let hasArgs = false;
            let trueCount = 0;
            for (const arg of args) {
                const flat = flat1D(arg);
                for (const item of flat) {
                    const b = toBool(item);
                    if (b !== null) {
                        hasArgs = true;
                        if (b)
                            trueCount++;
                    }
                }
            }
            if (!hasArgs)
                return '#VALUE!';
            return trueCount % 2 === 1; // XOR returns TRUE if odd number of TRUEs
        });
        registry.register('NOT', (logical) => {
            const b = toBool(Array.isArray(logical) ? logical[0] : logical);
            if (b === null)
                return '#VALUE!';
            return !b;
        });
        // ── IFERROR / IFNA ───────────────────────────────────────────────────────
        registry.register('IFERROR', (value, valueIfError) => {
            if (isError(value))
                return valueIfError;
            return value;
        });
        registry.register('IFNA', (value, valueIfNa) => {
            if (value === '#N/A')
                return valueIfNa;
            return value;
        });
    }
}
//# sourceMappingURL=LogicalEngine.js.map