export var TokenType;
(function (TokenType) {
    TokenType["Number"] = "Number";
    TokenType["String"] = "String";
    TokenType["Boolean"] = "Boolean";
    TokenType["Error"] = "Error";
    TokenType["Identifier"] = "Identifier";
    TokenType["CellReference"] = "CellReference";
    // Operators
    TokenType["Plus"] = "Plus";
    TokenType["Minus"] = "Minus";
    TokenType["Multiply"] = "Multiply";
    TokenType["Divide"] = "Divide";
    TokenType["Power"] = "Power";
    TokenType["Percent"] = "Percent";
    TokenType["Concat"] = "Concat";
    // Comparison
    TokenType["Equal"] = "Equal";
    TokenType["NotEqual"] = "NotEqual";
    TokenType["LessThan"] = "LessThan";
    TokenType["GreaterThan"] = "GreaterThan";
    TokenType["LessThanOrEqual"] = "LessThanOrEqual";
    TokenType["GreaterThanOrEqual"] = "GreaterThanOrEqual";
    // Reference Operators
    TokenType["Colon"] = "Colon";
    TokenType["Space"] = "Space";
    // Punctuation
    TokenType["LParen"] = "LParen";
    TokenType["RParen"] = "RParen";
    TokenType["LBrace"] = "LBrace";
    TokenType["RBrace"] = "RBrace";
    TokenType["LBracket"] = "LBracket";
    TokenType["RBracket"] = "RBracket";
    TokenType["Comma"] = "Comma";
    TokenType["Exclamation"] = "Exclamation";
    TokenType["EOF"] = "EOF";
})(TokenType || (TokenType = {}));
export class Lexer {
    input;
    pos = 0;
    constructor(input) {
        this.input = input;
        if (this.input.trim().startsWith('=')) {
            this.pos = this.input.indexOf('=') + 1;
        }
    }
    tokenize() {
        const tokens = [];
        while (this.pos < this.input.length) {
            const char = this.input[this.pos];
            if (/\s/.test(char)) {
                this.pos++;
                continue;
            }
            // Strings
            if (char === '"') {
                tokens.push(this.readString());
                continue;
            }
            // Numbers
            if (/[0-9]/.test(char) || (char === '.' && /[0-9]/.test(this.input[this.pos + 1] || ''))) {
                tokens.push(this.readNumber());
                continue;
            }
            // Identifiers / Cell References / Booleans / Errors
            if (/[a-zA-Z_#\\]/.test(char) || char === '\'') {
                tokens.push(this.readIdentifierOrReference());
                continue;
            }
            // Operators & Punctuation
            const startPos = this.pos;
            switch (char) {
                case '+':
                    tokens.push({ type: TokenType.Plus, value: '+', start: startPos, end: ++this.pos });
                    break;
                case '-':
                    tokens.push({ type: TokenType.Minus, value: '-', start: startPos, end: ++this.pos });
                    break;
                case '*':
                    tokens.push({ type: TokenType.Multiply, value: '*', start: startPos, end: ++this.pos });
                    break;
                case '/':
                    tokens.push({ type: TokenType.Divide, value: '/', start: startPos, end: ++this.pos });
                    break;
                case '^':
                    tokens.push({ type: TokenType.Power, value: '^', start: startPos, end: ++this.pos });
                    break;
                case '%':
                    tokens.push({ type: TokenType.Percent, value: '%', start: startPos, end: ++this.pos });
                    break;
                case '&':
                    tokens.push({ type: TokenType.Concat, value: '&', start: startPos, end: ++this.pos });
                    break;
                case ':':
                    tokens.push({ type: TokenType.Colon, value: ':', start: startPos, end: ++this.pos });
                    break;
                case '(':
                    tokens.push({ type: TokenType.LParen, value: '(', start: startPos, end: ++this.pos });
                    break;
                case ')':
                    tokens.push({ type: TokenType.RParen, value: ')', start: startPos, end: ++this.pos });
                    break;
                case '{':
                    tokens.push({ type: TokenType.LBrace, value: '{', start: startPos, end: ++this.pos });
                    break;
                case '}':
                    tokens.push({ type: TokenType.RBrace, value: '}', start: startPos, end: ++this.pos });
                    break;
                case '[':
                    tokens.push({ type: TokenType.LBracket, value: '[', start: startPos, end: ++this.pos });
                    break;
                case ']':
                    tokens.push({ type: TokenType.RBracket, value: ']', start: startPos, end: ++this.pos });
                    break;
                case ',':
                    tokens.push({ type: TokenType.Comma, value: ',', start: startPos, end: ++this.pos });
                    break;
                case '!':
                    tokens.push({ type: TokenType.Exclamation, value: '!', start: startPos, end: ++this.pos });
                    break;
                // Two-character operators
                case '=':
                    tokens.push({ type: TokenType.Equal, value: '=', start: startPos, end: ++this.pos });
                    break;
                case '<':
                    if (this.input[this.pos + 1] === '>') {
                        tokens.push({ type: TokenType.NotEqual, value: '<>', start: startPos, end: this.pos += 2 });
                    }
                    else if (this.input[this.pos + 1] === '=') {
                        tokens.push({ type: TokenType.LessThanOrEqual, value: '<=', start: startPos, end: this.pos += 2 });
                    }
                    else {
                        tokens.push({ type: TokenType.LessThan, value: '<', start: startPos, end: ++this.pos });
                    }
                    break;
                case '>':
                    if (this.input[this.pos + 1] === '=') {
                        tokens.push({ type: TokenType.GreaterThanOrEqual, value: '>=', start: startPos, end: this.pos += 2 });
                    }
                    else {
                        tokens.push({ type: TokenType.GreaterThan, value: '>', start: startPos, end: ++this.pos });
                    }
                    break;
                default:
                    throw new Error(`Unknown character at index ${this.pos}: ${char}`);
            }
        }
        tokens.push({ type: TokenType.EOF, value: '', start: this.pos, end: this.pos });
        return tokens;
    }
    readString() {
        const start = this.pos;
        this.pos++; // Skip opening quote
        let str = '';
        while (this.pos < this.input.length) {
            const char = this.input[this.pos];
            if (char === '"') {
                if (this.pos + 1 < this.input.length && this.input[this.pos + 1] === '"') {
                    // Escaped quote
                    str += '"';
                    this.pos += 2;
                }
                else {
                    // End of string
                    this.pos++;
                    return { type: TokenType.String, value: str, start, end: this.pos };
                }
            }
            else {
                str += char;
                this.pos++;
            }
        }
        throw new Error(`Unterminated string starting at ${start}`);
    }
    readNumber() {
        const start = this.pos;
        let numStr = '';
        let hasDot = false;
        let hasE = false;
        while (this.pos < this.input.length) {
            const char = this.input[this.pos];
            if (/[0-9]/.test(char)) {
                numStr += char;
                this.pos++;
            }
            else if (char === '.' && !hasDot && !hasE) {
                numStr += char;
                hasDot = true;
                this.pos++;
            }
            else if ((char === 'e' || char === 'E') && !hasE) {
                numStr += char;
                hasE = true;
                this.pos++;
                if (this.input[this.pos] === '+' || this.input[this.pos] === '-') {
                    numStr += this.input[this.pos];
                    this.pos++;
                }
            }
            else {
                break;
            }
        }
        return { type: TokenType.Number, value: numStr, start, end: this.pos };
    }
    readIdentifierOrReference() {
        const start = this.pos;
        // Check if it's a sheet reference with single quotes
        if (this.input[this.pos] === '\'') {
            let sheetName = '';
            this.pos++;
            while (this.pos < this.input.length) {
                if (this.input[this.pos] === '\'') {
                    if (this.pos + 1 < this.input.length && this.input[this.pos + 1] === '\'') {
                        sheetName += '\'';
                        this.pos += 2;
                    }
                    else {
                        this.pos++; // Skip closing quote
                        break;
                    }
                }
                else {
                    sheetName += this.input[this.pos];
                    this.pos++;
                }
            }
            // After single quote sheet name, it must be followed by '!'
            if (this.input[this.pos] === '!') {
                this.pos++;
                // Now parse the actual cell ref
                const cellRefStart = this.pos;
                while (this.pos < this.input.length && /[a-zA-Z0-9_$]/.test(this.input[this.pos])) {
                    this.pos++;
                }
                const cellRef = this.input.substring(cellRefStart, this.pos);
                return {
                    type: TokenType.CellReference,
                    value: `'${sheetName}'!${cellRef}`,
                    start,
                    end: this.pos
                };
            }
            return { type: TokenType.Identifier, value: sheetName, start, end: this.pos };
        }
        // Normal identifier or cell reference
        let idStr = '';
        // Includes # for errors like #VALUE!, \ for some weird names, $ for absolute refs
        while (this.pos < this.input.length && /[a-zA-Z0-9_$.#\?!]/.test(this.input[this.pos])) {
            // Stop at ! unless it's part of an error name like #VALUE! or sheet ref
            if (this.input[this.pos] === '!') {
                // If the identifier so far is an error, exclamation mark is part of it
                if (idStr.startsWith('#')) {
                    idStr += this.input[this.pos];
                    this.pos++;
                    break;
                }
                // If it's a sheet reference (e.g. Sheet1!A1)
                idStr += this.input[this.pos];
                this.pos++;
                continue;
            }
            idStr += this.input[this.pos];
            this.pos++;
        }
        const upperId = idStr.toUpperCase();
        // Check for booleans
        if (upperId === 'TRUE' || upperId === 'FALSE') {
            return { type: TokenType.Boolean, value: upperId, start, end: this.pos };
        }
        // Check for errors
        if (upperId.startsWith('#')) {
            return { type: TokenType.Error, value: upperId, start, end: this.pos };
        }
        // Skip whitespace before next character to see if it's a function call
        let nextPos = this.pos;
        while (nextPos < this.input.length && /\s/.test(this.input[nextPos])) {
            nextPos++;
        }
        const isFunctionCall = this.input[nextPos] === '(';
        if (isFunctionCall) {
            return { type: TokenType.Identifier, value: idStr, start, end: this.pos };
        }
        // Rough check for cell reference (A1, $A$1, Sheet1!A1, A:A)
        // Only if it's NOT a function call, we check if it is a cell ref
        const isCellRef = /^[A-Z_0-9]*!?[$]?[A-Z]+[$]?[0-9]*$/i.test(idStr);
        if (isCellRef) {
            return { type: TokenType.CellReference, value: idStr, start, end: this.pos };
        }
        return { type: TokenType.Identifier, value: idStr, start, end: this.pos };
    }
}
//# sourceMappingURL=Lexer.js.map