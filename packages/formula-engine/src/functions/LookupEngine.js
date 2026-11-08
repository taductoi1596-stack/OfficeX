/**
 * LOOKUP ENGINE
 *
 * Full Excel-compatible lookup & reference functions.
 */
// ── helpers ──────────────────────────────────────────────────────────────────
function flat2D(v) {
    if (!Array.isArray(v))
        return [[v]];
    if (!Array.isArray(v[0]))
        return [v]; // 1D → single-row 2D
    return v;
}
function flat1D(v) {
    if (!Array.isArray(v))
        return [v];
    return v.flat(Infinity);
}
// Wildcard match: Excel supports * and ?
function wildcardMatch(pattern, text) {
    const p = '^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$';
    return new RegExp(p, 'i').test(String(text));
}
function matchCriteria(value, criteria) {
    const crit = String(criteria);
    if (typeof criteria === 'boolean')
        return value === criteria;
    if (typeof criteria === 'number')
        return parseFloat(value) === criteria;
    if (crit.startsWith('>='))
        return parseFloat(value) >= parseFloat(crit.slice(2));
    if (crit.startsWith('<='))
        return parseFloat(value) <= parseFloat(crit.slice(2));
    if (crit.startsWith('<>'))
        return String(value).toLowerCase() !== crit.slice(2).toLowerCase();
    if (crit.startsWith('>'))
        return parseFloat(value) > parseFloat(crit.slice(1));
    if (crit.startsWith('<'))
        return parseFloat(value) < parseFloat(crit.slice(1));
    if (crit.includes('*') || crit.includes('?'))
        return wildcardMatch(crit, String(value));
    return String(value).toLowerCase() === crit.toLowerCase();
}
// ── main class ────────────────────────────────────────────────────────────────
export class LookupEngine {
    static registerFunctions(registry) {
        // ── VLOOKUP ──────────────────────────────────────────────────────────────
        registry.register('VLOOKUP', (lookupValue, tableArray, colIndexNum, rangeLookup = true) => {
            const table = flat2D(tableArray);
            if (table.length === 0)
                return '#N/A';
            const col = parseInt(colIndexNum) - 1;
            if (col < 0)
                return '#VALUE!';
            const exact = rangeLookup === false || rangeLookup === 0 || String(rangeLookup).toLowerCase() === 'false';
            const lv = String(lookupValue).toLowerCase();
            if (exact) {
                // Exact match: scan all rows
                for (const row of table) {
                    const cell = row[0];
                    if (String(cell).toLowerCase() === lv || cell === lookupValue) {
                        return col >= row.length ? '#REF!' : row[col];
                    }
                }
                return '#N/A';
            }
            else {
                // Approximate (sorted ascending): find largest value ≤ lookupValue
                let bestRow = null;
                const lvNum = parseFloat(lookupValue);
                for (const row of table) {
                    const cell = row[0];
                    const cellNum = parseFloat(cell);
                    if (!isNaN(lvNum) && !isNaN(cellNum)) {
                        if (cellNum <= lvNum)
                            bestRow = row;
                        else
                            break; // assumes sorted
                    }
                    else {
                        if (String(cell).toLowerCase() <= lv)
                            bestRow = row;
                        else
                            break;
                    }
                }
                if (!bestRow)
                    return '#N/A';
                return col >= bestRow.length ? '#REF!' : bestRow[col];
            }
        });
        // ── HLOOKUP ──────────────────────────────────────────────────────────────
        registry.register('HLOOKUP', (lookupValue, tableArray, rowIndexNum, rangeLookup = true) => {
            const table = flat2D(tableArray);
            if (table.length === 0)
                return '#N/A';
            const row = parseInt(rowIndexNum) - 1;
            if (row < 0)
                return '#VALUE!';
            const exact = rangeLookup === false || rangeLookup === 0 || String(rangeLookup).toLowerCase() === 'false';
            const firstRow = table[0];
            const lv = String(lookupValue).toLowerCase();
            if (exact) {
                for (let c = 0; c < firstRow.length; c++) {
                    if (String(firstRow[c]).toLowerCase() === lv || firstRow[c] === lookupValue) {
                        return row >= table.length ? '#REF!' : (table[row][c] ?? '');
                    }
                }
                return '#N/A';
            }
            else {
                let bestCol = -1;
                const lvNum = parseFloat(lookupValue);
                for (let c = 0; c < firstRow.length; c++) {
                    const cellNum = parseFloat(firstRow[c]);
                    if (!isNaN(lvNum) && !isNaN(cellNum)) {
                        if (cellNum <= lvNum)
                            bestCol = c;
                        else
                            break;
                    }
                    else {
                        if (String(firstRow[c]).toLowerCase() <= lv)
                            bestCol = c;
                        else
                            break;
                    }
                }
                if (bestCol === -1)
                    return '#N/A';
                return row >= table.length ? '#REF!' : (table[row][bestCol] ?? '');
            }
        });
        // ── XLOOKUP ──────────────────────────────────────────────────────────────
        registry.register('XLOOKUP', (lookupValue, lookupArray, returnArray, ifNotFound = '#N/A', matchMode = 0, searchMode = 1) => {
            const la = flat1D(lookupArray);
            const ra = flat1D(returnArray);
            const mm = parseInt(matchMode) || 0;
            const sm = parseInt(searchMode) || 1;
            // Build search order
            const indices = sm === -1
                ? Array.from({ length: la.length }, (_, i) => la.length - 1 - i) // last to first
                : Array.from({ length: la.length }, (_, i) => i);
            for (const i of indices) {
                const cell = la[i];
                let hit = false;
                if (mm === 0) {
                    // Exact match
                    hit = String(cell).toLowerCase() === String(lookupValue).toLowerCase() || cell === lookupValue;
                    if (!hit && typeof lookupValue === 'string' && (lookupValue.includes('*') || lookupValue.includes('?'))) {
                        hit = wildcardMatch(lookupValue, String(cell));
                    }
                }
                else if (mm === -1) {
                    // Exact match or next smaller
                    const lv = parseFloat(lookupValue);
                    const cv = parseFloat(cell);
                    hit = cv <= lv;
                }
                else if (mm === 1) {
                    // Exact match or next larger
                    const lv = parseFloat(lookupValue);
                    const cv = parseFloat(cell);
                    hit = cv >= lv;
                }
                else if (mm === 2) {
                    // Wildcard match
                    hit = wildcardMatch(String(lookupValue), String(cell));
                }
                if (hit)
                    return i < ra.length ? ra[i] : '#N/A';
            }
            return ifNotFound !== undefined ? ifNotFound : '#N/A';
        });
        // ── INDEX ─────────────────────────────────────────────────────────────────
        registry.register('INDEX', (array, rowNum, colNum = 1, areaNum = 1) => {
            const arr = Array.isArray(array) ? array : [[array]];
            const r = parseInt(rowNum);
            const c = parseInt(colNum);
            // 1D array (single row or column)
            if (!Array.isArray(arr[0])) {
                // 1D horizontal or vertical
                if (r === 0 && c > 0)
                    return arr[c - 1] ?? '#REF!';
                if (c === 0 && r > 0)
                    return arr[r - 1] ?? '#REF!';
                return arr[r - 1] ?? '#REF!';
            }
            // 2D array
            if (r === 0 && c === 0)
                return arr; // return entire array
            if (r === 0) {
                // return entire column
                return arr.map((row) => row[c - 1]);
            }
            if (c === 0) {
                // return entire row
                const row = arr[r - 1];
                return row ?? '#REF!';
            }
            const row = arr[r - 1];
            if (!row)
                return '#REF!';
            return Array.isArray(row) ? (row[c - 1] ?? '#REF!') : row;
        });
        // ── MATCH ─────────────────────────────────────────────────────────────────
        registry.register('MATCH', (lookupValue, lookupArray, matchType = 1) => {
            const arr = flat1D(lookupArray);
            const type = parseInt(matchType);
            const lv = String(lookupValue).toLowerCase();
            const lvNum = parseFloat(lookupValue);
            if (type === 0) {
                // Exact match (supports wildcards)
                const hasWildcard = typeof lookupValue === 'string' && (lookupValue.includes('*') || lookupValue.includes('?'));
                for (let i = 0; i < arr.length; i++) {
                    const cell = arr[i];
                    if (hasWildcard) {
                        if (wildcardMatch(lookupValue, String(cell)))
                            return i + 1;
                    }
                    else if (String(cell).toLowerCase() === lv || cell === lookupValue) {
                        return i + 1;
                    }
                }
                return '#N/A';
            }
            else if (type === 1) {
                // Less than or equal (array sorted ascending)
                let best = -1;
                for (let i = 0; i < arr.length; i++) {
                    const cv = parseFloat(arr[i]);
                    if (!isNaN(lvNum) && !isNaN(cv)) {
                        if (cv <= lvNum)
                            best = i;
                        else
                            break;
                    }
                    else {
                        if (String(arr[i]).toLowerCase() <= lv)
                            best = i;
                        else
                            break;
                    }
                }
                return best === -1 ? '#N/A' : best + 1;
            }
            else if (type === -1) {
                // Greater than or equal (array sorted descending)
                let best = -1;
                for (let i = 0; i < arr.length; i++) {
                    const cv = parseFloat(arr[i]);
                    if (!isNaN(lvNum) && !isNaN(cv)) {
                        if (cv >= lvNum)
                            best = i;
                        else
                            break;
                    }
                    else {
                        if (String(arr[i]).toLowerCase() >= lv)
                            best = i;
                        else
                            break;
                    }
                }
                return best === -1 ? '#N/A' : best + 1;
            }
            return '#VALUE!';
        });
        // ── XMATCH ────────────────────────────────────────────────────────────────
        registry.register('XMATCH', (lookupValue, lookupArray, matchMode = 0, searchMode = 1) => {
            const arr = flat1D(lookupArray);
            const mm = parseInt(matchMode) || 0;
            const sm = parseInt(searchMode) || 1;
            const lv = String(lookupValue).toLowerCase();
            const lvNum = parseFloat(lookupValue);
            const indices = sm === -1
                ? Array.from({ length: arr.length }, (_, i) => arr.length - 1 - i)
                : Array.from({ length: arr.length }, (_, i) => i);
            for (const i of indices) {
                const cell = arr[i];
                let hit = false;
                if (mm === 0) {
                    hit = String(cell).toLowerCase() === lv || cell === lookupValue;
                    if (!hit && typeof lookupValue === 'string' && (lookupValue.includes('*') || lookupValue.includes('?')))
                        hit = wildcardMatch(lookupValue, String(cell));
                }
                else if (mm === -1) {
                    const cv = parseFloat(cell);
                    hit = !isNaN(cv) && !isNaN(lvNum) && cv <= lvNum;
                }
                else if (mm === 1) {
                    const cv = parseFloat(cell);
                    hit = !isNaN(cv) && !isNaN(lvNum) && cv >= lvNum;
                }
                else if (mm === 2) {
                    hit = wildcardMatch(String(lookupValue), String(cell));
                }
                if (hit)
                    return i + 1;
            }
            return '#N/A';
        });
        // ── LOOKUP (vector / array form) ──────────────────────────────────────────
        registry.register('LOOKUP', (lookupValue, lookupVector, resultVector = null) => {
            const lv = flat1D(lookupVector);
            const rv = resultVector ? flat1D(resultVector) : lv;
            const lvNum = parseFloat(lookupValue);
            // Binary search for approximate match (sorted ascending)
            let lo = 0, hi = lv.length - 1, best = -1;
            while (lo <= hi) {
                const mid = (lo + hi) >> 1;
                const cv = parseFloat(lv[mid]);
                if (!isNaN(lvNum) && !isNaN(cv)) {
                    if (cv <= lvNum) {
                        best = mid;
                        lo = mid + 1;
                    }
                    else
                        hi = mid - 1;
                }
                else {
                    if (String(lv[mid]).toLowerCase() <= String(lookupValue).toLowerCase()) {
                        best = mid;
                        lo = mid + 1;
                    }
                    else
                        hi = mid - 1;
                }
            }
            return best === -1 ? '#N/A' : (rv[best] ?? '#N/A');
        });
        // ── CHOOSE ────────────────────────────────────────────────────────────────
        registry.register('CHOOSE', (indexNum, ...values) => {
            const idx = parseInt(indexNum);
            if (isNaN(idx) || idx < 1 || idx > values.length)
                return '#VALUE!';
            return values[idx - 1];
        });
        // ── CHOOSECOLS / CHOOSEROWS ───────────────────────────────────────────────
        registry.register('CHOOSECOLS', (array, ...colNums) => {
            const table = flat2D(array);
            const cols = colNums.flat().map(Number);
            return table.map(row => cols.map(c => {
                const ci = c > 0 ? c - 1 : row.length + c;
                return row[ci] ?? '#REF!';
            }));
        });
        registry.register('CHOOSEROWS', (array, ...rowNums) => {
            const table = flat2D(array);
            const rows = rowNums.flat().map(Number);
            return rows.map(r => {
                const ri = r > 0 ? r - 1 : table.length + r;
                return table[ri] ?? '#REF!';
            });
        });
        // ── OFFSET ────────────────────────────────────────────────────────────────
        // Note: OFFSET normally needs a live reference; here we simulate it on arrays
        registry.register('OFFSET', (reference, rows, cols, height = null, width = null) => {
            const table = flat2D(reference);
            const r = parseInt(rows) || 0;
            const c = parseInt(cols) || 0;
            const h = height !== null ? parseInt(height) : 1;
            const w = width !== null ? parseInt(width) : 1;
            const result = [];
            for (let i = 0; i < h; i++) {
                const row = table[r + i];
                if (!row) {
                    result.push(new Array(w).fill('#REF!'));
                    continue;
                }
                result.push(Array.from({ length: w }, (_, j) => row[c + j] ?? '#REF!'));
            }
            return h === 1 && w === 1 ? result[0][0] : result;
        });
        // ── ROW / ROWS / COLUMN / COLUMNS ─────────────────────────────────────────
        registry.register('ROW', (reference = null) => {
            if (reference === null)
                return 1; // Without context we return 1
            if (Array.isArray(reference)) {
                const rows = Array.from({ length: flat2D(reference).length }, (_, i) => [i + 1]);
                return rows.length === 1 ? rows[0][0] : rows;
            }
            return 1;
        });
        registry.register('ROWS', (array) => {
            if (!Array.isArray(array))
                return 1;
            return flat2D(array).length;
        });
        registry.register('COLUMN', (reference = null) => {
            if (reference === null)
                return 1;
            if (Array.isArray(reference)) {
                const table = flat2D(reference);
                const cols = (table[0] || []).length;
                return cols === 1 ? 1 : Array.from({ length: cols }, (_, i) => i + 1);
            }
            return 1;
        });
        registry.register('COLUMNS', (array) => {
            if (!Array.isArray(array))
                return 1;
            const table = flat2D(array);
            return (table[0] || []).length;
        });
        // ── SORT / SORTBY ─────────────────────────────────────────────────────────
        registry.register('SORT', (array, sortIndex = 1, sortOrder = 1, byCol = false) => {
            const table = flat2D(array);
            const si = parseInt(sortIndex) - 1;
            const so = parseInt(sortOrder) === -1 ? -1 : 1;
            if (byCol) {
                // Sort columns by row si
                const headerRow = table[si] || [];
                const cols = Array.from({ length: headerRow.length }, (_, j) => table.map(row => row[j]));
                cols.sort((a, b) => {
                    const av = parseFloat(a[si]), bv = parseFloat(b[si]);
                    if (!isNaN(av) && !isNaN(bv))
                        return so * (av - bv);
                    return so * String(a[si]).localeCompare(String(b[si]));
                });
                return table.map((_, i) => cols.map(col => col[i]));
            }
            const sorted = [...table].sort((a, b) => {
                const av = parseFloat(a[si]), bv = parseFloat(b[si]);
                if (!isNaN(av) && !isNaN(bv))
                    return so * (av - bv);
                return so * String(a[si]).localeCompare(String(b[si]));
            });
            return sorted.length === 1 ? sorted[0] : sorted;
        });
        registry.register('SORTBY', (array, ...sortArgs) => {
            const table = flat2D(array);
            // sortArgs: [byArray1, order1, byArray2, order2, ...]
            const keys = [];
            for (let i = 0; i < sortArgs.length; i += 2) {
                keys.push({ arr: flat1D(sortArgs[i]), order: parseInt(sortArgs[i + 1]) === -1 ? -1 : 1 });
            }
            const sorted = Array.from({ length: table.length }, (_, i) => i).sort((a, b) => {
                for (const { arr, order } of keys) {
                    const av = parseFloat(arr[a]), bv = parseFloat(arr[b]);
                    let cmp = 0;
                    if (!isNaN(av) && !isNaN(bv))
                        cmp = av - bv;
                    else
                        cmp = String(arr[a]).localeCompare(String(arr[b]));
                    if (cmp !== 0)
                        return order * cmp;
                }
                return 0;
            });
            const result = sorted.map(i => table[i]);
            return result.length === 1 ? result[0] : result;
        });
        // ── FILTER ────────────────────────────────────────────────────────────────
        registry.register('FILTER', (array, include, ifEmpty = '#CALC!') => {
            const table = flat2D(array);
            const mask = flat1D(include).map(v => Boolean(v) && v !== 0 && v !== '' && v !== false);
            const result = table.filter((_, i) => mask[i]);
            if (result.length === 0)
                return ifEmpty;
            return result.length === 1 ? result[0] : result;
        });
        // ── UNIQUE ────────────────────────────────────────────────────────────────
        registry.register('UNIQUE', (array, byCol = false, exactlyOnce = false) => {
            const table = flat2D(array);
            const serialize = (row) => JSON.stringify(row);
            if (!byCol) {
                const seen = new Map();
                for (const row of table) {
                    const key = serialize(row);
                    if (!seen.has(key))
                        seen.set(key, { row, count: 0 });
                    seen.get(key).count++;
                }
                const result = [...seen.values()]
                    .filter(({ count }) => !exactlyOnce || count === 1)
                    .map(({ row }) => row);
                return result.length === 1 ? result[0] : result;
            }
            else {
                const cols = (table[0] || []).length;
                const seen = new Map();
                for (let c = 0; c < cols; c++) {
                    const col = table.map(row => row[c]);
                    const key = serialize(col);
                    if (!seen.has(key))
                        seen.set(key, { col, count: 0 });
                    seen.get(key).count++;
                }
                const uniqueCols = [...seen.values()]
                    .filter(({ count }) => !exactlyOnce || count === 1)
                    .map(({ col }) => col);
                return table.map((_, i) => uniqueCols.map(col => col[i]));
            }
        });
        // ── TRANSPOSE ─────────────────────────────────────────────────────────────
        registry.register('TRANSPOSE', (array) => {
            const table = flat2D(array);
            const rows = table.length, cols = (table[0] || []).length;
            const result = Array.from({ length: cols }, (_, j) => Array.from({ length: rows }, (_, i) => table[i][j]));
            return result.length === 1 ? result[0] : result;
        });
        // ── TAKE / DROP ───────────────────────────────────────────────────────────
        registry.register('TAKE', (array, rows, cols = null) => {
            const table = flat2D(array);
            const r = parseInt(rows);
            const c = cols !== null ? parseInt(cols) : null;
            let result = r >= 0 ? table.slice(0, r) : table.slice(table.length + r);
            if (c !== null)
                result = result.map(row => c >= 0 ? row.slice(0, c) : row.slice(row.length + c));
            return result.length === 1 ? result[0] : result;
        });
        registry.register('DROP', (array, rows, cols = null) => {
            const table = flat2D(array);
            const r = parseInt(rows);
            const c = cols !== null ? parseInt(cols) : null;
            let result = r >= 0 ? table.slice(r) : table.slice(0, table.length + r);
            if (c !== null)
                result = result.map(row => c >= 0 ? row.slice(c) : row.slice(0, row.length + c));
            return result.length === 1 ? result[0] : result;
        });
        // ── EXPAND ────────────────────────────────────────────────────────────────
        registry.register('EXPAND', (array, rows, cols, padWith = 0) => {
            const table = flat2D(array);
            const targetR = parseInt(rows), targetC = parseInt(cols);
            const result = [];
            for (let r = 0; r < targetR; r++) {
                const srcRow = table[r] || [];
                result.push(Array.from({ length: targetC }, (_, c) => c < srcRow.length ? srcRow[c] : padWith));
            }
            return result.length === 1 ? result[0] : result;
        });
        // ── HSTACK / VSTACK ───────────────────────────────────────────────────────
        registry.register('HSTACK', (...arrays) => {
            const tables = arrays.map(flat2D);
            const maxRows = Math.max(...tables.map(t => t.length));
            return Array.from({ length: maxRows }, (_, i) => tables.flatMap(t => t[i] || new Array((t[0] || []).length).fill('#N/A')));
        });
        registry.register('VSTACK', (...arrays) => {
            const tables = arrays.map(flat2D);
            const maxCols = Math.max(...tables.map(t => (t[0] || []).length));
            const result = [];
            for (const t of tables) {
                for (const row of t) {
                    const padded = [...row, ...new Array(maxCols - row.length).fill('#N/A')];
                    result.push(padded);
                }
            }
            return result.length === 1 ? result[0] : result;
        });
        // ── TOROW / TOCOL ─────────────────────────────────────────────────────────
        registry.register('TOROW', (array, ignore = 0, scanByCol = false) => {
            const table = flat2D(array);
            let vals = scanByCol
                ? Array.from({ length: (table[0] || []).length }, (_, c) => table.map(row => row[c])).flat()
                : table.flat();
            const ig = parseInt(ignore);
            if (ig === 1)
                vals = vals.filter(v => v !== null && v !== undefined);
            if (ig === 2)
                vals = vals.filter(v => typeof v !== 'string' || v.trim() !== '' || !v.startsWith('#'));
            if (ig === 3)
                vals = vals.filter(v => v !== null && v !== undefined && String(v).trim() !== '');
            return vals;
        });
        registry.register('TOCOL', (array, ignore = 0, scanByCol = false) => {
            const flat = registry.getFunction('TOROW')(array, ignore, scanByCol);
            return flat.map((v) => [v]);
        });
        // ── WRAPROWS / WRAPCOLS ───────────────────────────────────────────────────
        registry.register('WRAPROWS', (vector, wrapCount, padWith = '#N/A') => {
            const vals = flat1D(vector);
            const w = parseInt(wrapCount);
            const result = [];
            for (let i = 0; i < vals.length; i += w) {
                const row = vals.slice(i, i + w);
                while (row.length < w)
                    row.push(padWith);
                result.push(row);
            }
            return result.length === 1 ? result[0] : result;
        });
        registry.register('WRAPCOLS', (vector, wrapCount, padWith = '#N/A') => {
            const vals = flat1D(vector);
            const w = parseInt(wrapCount);
            const numCols = Math.ceil(vals.length / w);
            return Array.from({ length: w }, (_, r) => Array.from({ length: numCols }, (_, c) => vals[c * w + r] ?? padWith));
        });
        // ── ADDRESS ───────────────────────────────────────────────────────────────
        registry.register('ADDRESS', (rowNum, colNum, absNum = 1, a1 = true, sheetText = null) => {
            const r = parseInt(rowNum), c = parseInt(colNum);
            if (isNaN(r) || isNaN(c))
                return '#VALUE!';
            const colLetter = colNumToLetter(c);
            const sheet = sheetText ? `${sheetText}!` : '';
            const abs = parseInt(absNum) || 1;
            let ref;
            if (abs === 1)
                ref = `$${colLetter}$${r}`;
            else if (abs === 2)
                ref = `${colLetter}$${r}`;
            else if (abs === 3)
                ref = `$${colLetter}${r}`;
            else
                ref = `${colLetter}${r}`;
            return `${sheet}${ref}`;
        });
        // ── INDIRECT ─────────────────────────────────────────────────────────────
        // Simplified: returns the reference text (needs live context for real eval)
        registry.register('INDIRECT', (refText) => {
            // In a real implementation this would resolve to the cell value
            // Here we return the text as-is so it can be used as a reference marker
            return String(refText);
        });
        // ── HYPERLINK ─────────────────────────────────────────────────────────────
        registry.register('HYPERLINK', (linkLocation, friendlyName = null) => {
            return friendlyName !== null ? String(friendlyName) : String(linkLocation);
        });
        // ── FORMULATEXT ──────────────────────────────────────────────────────────
        registry.register('FORMULATEXT', (reference) => {
            if (typeof reference === 'string' && reference.startsWith('='))
                return reference;
            return '#N/A';
        });
        // ── AREAS ────────────────────────────────────────────────────────────────
        registry.register('AREAS', (reference) => {
            // Simplified: always returns 1
            return 1;
        });
        // ── GETPIVOTDATA ─────────────────────────────────────────────────────────
        registry.register('GETPIVOTDATA', (_dataField, _pivotTable, ..._args) => {
            return '#N/A'; // Not applicable in this context
        });
        // ── RTD ──────────────────────────────────────────────────────────────────
        registry.register('RTD', (..._args) => '#N/A');
        // ── FIELDVALUE ───────────────────────────────────────────────────────────
        registry.register('FIELDVALUE', (value, _fieldName) => value);
    }
}
// ── utils ─────────────────────────────────────────────────────────────────────
function colNumToLetter(n) {
    let result = '';
    while (n > 0) {
        const rem = (n - 1) % 26;
        result = String.fromCharCode(65 + rem) + result;
        n = Math.floor((n - 1) / 26);
    }
    return result;
}
//# sourceMappingURL=LookupEngine.js.map