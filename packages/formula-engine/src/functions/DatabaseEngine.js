/**
 * DATABASE ENGINE
 *
 * Full Excel-compatible Database functions (DAVERAGE, DCOUNT, DSUM, etc.)
 */
// ── helpers ──────────────────────────────────────────────────────────────────
function flat2D(v) {
    if (!Array.isArray(v))
        return [[v]];
    if (!Array.isArray(v[0]))
        return [v];
    return v;
}
// Wildcard match: Excel supports * and ?
function wildcardMatch(pattern, text) {
    const p = '^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$';
    return new RegExp(p, 'i').test(String(text));
}
/**
 * Filter database based on criteria.
 * Returns an array of values from the specified field column.
 */
function getFilteredFieldValues(databaseArgs, fieldArg, criteriaArgs) {
    const database = flat2D(databaseArgs);
    const criteria = flat2D(criteriaArgs);
    if (database.length < 2)
        return [];
    const headers = database[0].map(h => String(h).trim().toLowerCase());
    let fieldIndex = -1;
    if (typeof fieldArg === 'number') {
        fieldIndex = fieldArg - 1;
    }
    else if (typeof fieldArg === 'string' && fieldArg.trim() !== '') {
        fieldIndex = headers.indexOf(fieldArg.trim().toLowerCase());
    }
    // If field is completely omitted or invalid, some functions like DCOUNT still count the rows
    // but they count based on the entire record. We will return the whole row if fieldIndex = -1
    const critHeaders = criteria[0].map(h => String(h).trim().toLowerCase());
    const critRows = criteria.slice(1);
    const matchedRows = [];
    for (let r = 1; r < database.length; r++) {
        const row = database[r];
        let rowPassed = false;
        // If no criteria rows, everything passes
        if (critRows.length === 0) {
            rowPassed = true;
        }
        else {
            // Evaluate OR conditions (each critRow is an OR condition)
            for (const critRow of critRows) {
                let rowMatchesCritRow = true;
                // Evaluate AND conditions within the critRow
                for (let c = 0; c < critHeaders.length; c++) {
                    const critHeader = critHeaders[c];
                    const critValue = critRow[c];
                    if (critValue === undefined || critValue === null || critValue === '') {
                        continue; // Empty criteria cell is ignored (acts as TRUE)
                    }
                    const dbColIndex = headers.indexOf(critHeader);
                    if (dbColIndex === -1) {
                        continue;
                    }
                    const dbValue = row[dbColIndex];
                    const critStr = String(critValue);
                    let match = false;
                    if (critStr.startsWith('>='))
                        match = parseFloat(dbValue) >= parseFloat(critStr.slice(2));
                    else if (critStr.startsWith('<='))
                        match = parseFloat(dbValue) <= parseFloat(critStr.slice(2));
                    else if (critStr.startsWith('<>'))
                        match = String(dbValue).toLowerCase() !== critStr.slice(2).toLowerCase();
                    else if (critStr.startsWith('>'))
                        match = parseFloat(dbValue) > parseFloat(critStr.slice(1));
                    else if (critStr.startsWith('<'))
                        match = parseFloat(dbValue) < parseFloat(critStr.slice(1));
                    else if (critStr.includes('*') || critStr.includes('?')) {
                        match = wildcardMatch(critStr, String(dbValue));
                    }
                    else {
                        // Excel exact match is case insensitive
                        match = String(dbValue).toLowerCase() === critStr.toLowerCase();
                    }
                    if (!match) {
                        rowMatchesCritRow = false;
                        break;
                    }
                }
                if (rowMatchesCritRow) {
                    rowPassed = true;
                    break;
                }
            }
        }
        if (rowPassed) {
            matchedRows.push(row);
        }
    }
    if (fieldIndex >= 0 && fieldIndex < headers.length) {
        return matchedRows.map(row => row[fieldIndex]);
    }
    // Return first column if field is omitted but required for counting
    return matchedRows.map(row => row[0]);
}
// Statistics Helpers
const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const variance = (xs, ddof = 1) => {
    if (xs.length < ddof + 1)
        return 0;
    const m = mean(xs);
    return xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - ddof);
};
// ── main class ────────────────────────────────────────────────────────────────
export class DatabaseEngine {
    static registerFunctions(registry) {
        registry.register('DAVERAGE', (database, field, criteria) => {
            const vals = getFilteredFieldValues(database, field, criteria)
                .map(v => parseFloat(v))
                .filter(v => !isNaN(v));
            if (vals.length === 0)
                return '#DIV/0!';
            return mean(vals);
        });
        registry.register('DCOUNT', (database, field, criteria) => {
            const vals = getFilteredFieldValues(database, field, criteria);
            let count = 0;
            for (const v of vals) {
                if (typeof v === 'number' || (typeof v === 'string' && !isNaN(parseFloat(v)) && v.trim() !== '')) {
                    count++;
                }
            }
            return count;
        });
        registry.register('DCOUNTA', (database, field, criteria) => {
            const vals = getFilteredFieldValues(database, field, criteria);
            let count = 0;
            for (const v of vals) {
                if (v !== null && v !== undefined && String(v) !== '') {
                    count++;
                }
            }
            return count;
        });
        registry.register('DGET', (database, field, criteria) => {
            const vals = getFilteredFieldValues(database, field, criteria);
            if (vals.length === 0)
                return '#VALUE!';
            if (vals.length > 1)
                return '#NUM!'; // Multiple matches error
            return vals[0];
        });
        registry.register('DMAX', (database, field, criteria) => {
            const vals = getFilteredFieldValues(database, field, criteria)
                .map(v => parseFloat(v))
                .filter(v => !isNaN(v));
            if (vals.length === 0)
                return 0;
            return Math.max(...vals);
        });
        registry.register('DMIN', (database, field, criteria) => {
            const vals = getFilteredFieldValues(database, field, criteria)
                .map(v => parseFloat(v))
                .filter(v => !isNaN(v));
            if (vals.length === 0)
                return 0;
            return Math.min(...vals);
        });
        registry.register('DPRODUCT', (database, field, criteria) => {
            const vals = getFilteredFieldValues(database, field, criteria)
                .map(v => parseFloat(v))
                .filter(v => !isNaN(v));
            if (vals.length === 0)
                return 0;
            return vals.reduce((a, b) => a * b, 1);
        });
        registry.register('DSUM', (database, field, criteria) => {
            const vals = getFilteredFieldValues(database, field, criteria)
                .map(v => parseFloat(v))
                .filter(v => !isNaN(v));
            return vals.reduce((a, b) => a + b, 0);
        });
        registry.register('DVAR', (database, field, criteria) => {
            const vals = getFilteredFieldValues(database, field, criteria)
                .map(v => parseFloat(v))
                .filter(v => !isNaN(v));
            if (vals.length < 2)
                return '#DIV/0!';
            return variance(vals, 1);
        });
        registry.register('DVARP', (database, field, criteria) => {
            const vals = getFilteredFieldValues(database, field, criteria)
                .map(v => parseFloat(v))
                .filter(v => !isNaN(v));
            if (vals.length === 0)
                return '#DIV/0!';
            return variance(vals, 0);
        });
        registry.register('DSTDEV', (database, field, criteria) => {
            const vals = getFilteredFieldValues(database, field, criteria)
                .map(v => parseFloat(v))
                .filter(v => !isNaN(v));
            if (vals.length < 2)
                return '#DIV/0!';
            return Math.sqrt(variance(vals, 1));
        });
        registry.register('DSTDEVP', (database, field, criteria) => {
            const vals = getFilteredFieldValues(database, field, criteria)
                .map(v => parseFloat(v))
                .filter(v => !isNaN(v));
            if (vals.length === 0)
                return '#DIV/0!';
            return Math.sqrt(variance(vals, 0));
        });
    }
}
//# sourceMappingURL=DatabaseEngine.js.map