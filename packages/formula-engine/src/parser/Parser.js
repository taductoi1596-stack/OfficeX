import { TokenType } from './Lexer';
import { ASTNodeType } from '../models/AST';
export class Parser {
    tokens;
    pos = 0;
    constructor(tokens) {
        this.tokens = tokens;
    }
    peek() {
        return this.tokens[this.pos];
    }
    peekNext() {
        return this.tokens[this.pos + 1];
    }
    consume(expectedType) {
        const token = this.tokens[this.pos];
        if (expectedType && token.type !== expectedType) {
            throw new Error(`Expected token ${expectedType} but got ${token.type} at position ${token.start}`);
        }
        this.pos++;
        return token;
    }
    parse() {
        const ast = this.parseExpression();
        if (this.peek().type !== TokenType.EOF) {
            throw new Error(`Unexpected token at end of formula: ${this.peek().value}`);
        }
        return ast;
    }
    // Precedence 10: Comparison (=, <>, <, >, <=, >=)
    parseExpression() {
        let node = this.parseConcat();
        while (this.peek().type === TokenType.Equal ||
            this.peek().type === TokenType.NotEqual ||
            this.peek().type === TokenType.LessThan ||
            this.peek().type === TokenType.GreaterThan ||
            this.peek().type === TokenType.LessThanOrEqual ||
            this.peek().type === TokenType.GreaterThanOrEqual) {
            const token = this.consume();
            node = {
                type: ASTNodeType.BinaryOp,
                operator: token.value,
                left: node,
                right: this.parseConcat()
            };
        }
        return node;
    }
    // Precedence 9: Concatenation (&)
    parseConcat() {
        let node = this.parseAddition();
        while (this.peek().type === TokenType.Concat) {
            const token = this.consume();
            node = {
                type: ASTNodeType.BinaryOp,
                operator: token.value,
                left: node,
                right: this.parseAddition()
            };
        }
        return node;
    }
    // Precedence 8: Addition and Subtraction (+, -)
    parseAddition() {
        let node = this.parseMultiplication();
        while (this.peek().type === TokenType.Plus || this.peek().type === TokenType.Minus) {
            const token = this.consume();
            node = {
                type: ASTNodeType.BinaryOp,
                operator: token.value,
                left: node,
                right: this.parseMultiplication()
            };
        }
        return node;
    }
    // Precedence 7: Multiplication and Division (*, /)
    parseMultiplication() {
        let node = this.parseExponentiation();
        while (this.peek().type === TokenType.Multiply || this.peek().type === TokenType.Divide) {
            const token = this.consume();
            node = {
                type: ASTNodeType.BinaryOp,
                operator: token.value,
                left: node,
                right: this.parseExponentiation()
            };
        }
        return node;
    }
    // Precedence 6: Exponentiation (^)
    parseExponentiation() {
        let node = this.parsePercentage();
        while (this.peek().type === TokenType.Power) {
            const token = this.consume();
            node = {
                type: ASTNodeType.BinaryOp,
                operator: token.value,
                left: node,
                right: this.parsePercentage() // technically right-associative in some langs, but left in Excel
            };
        }
        return node;
    }
    // Precedence 5: Percentage (%)
    parsePercentage() {
        let node = this.parseUnary();
        while (this.peek().type === TokenType.Percent) {
            const token = this.consume();
            node = {
                type: ASTNodeType.UnaryOp,
                operator: token.value,
                operand: node
            };
        }
        return node;
    }
    // Precedence 4: Unary Minus and Plus (+, -)
    parseUnary() {
        if (this.peek().type === TokenType.Plus || this.peek().type === TokenType.Minus) {
            const token = this.consume();
            return {
                type: ASTNodeType.UnaryOp,
                operator: token.value,
                operand: this.parseUnary()
            };
        }
        return this.parseRange();
    }
    // Precedence 1: Range (:)
    parseRange() {
        let node = this.parseFactor();
        while (this.peek().type === TokenType.Colon) {
            this.consume();
            const endNode = this.parseFactor();
            node = {
                type: ASTNodeType.RangeReference,
                startRef: node,
                endRef: endNode
            };
        }
        return node;
    }
    parseFactor() {
        const token = this.peek();
        if (token.type === TokenType.Number) {
            this.consume();
            return { type: ASTNodeType.Number, value: parseFloat(token.value) };
        }
        if (token.type === TokenType.String) {
            this.consume();
            return { type: ASTNodeType.String, value: token.value };
        }
        if (token.type === TokenType.Boolean) {
            this.consume();
            return { type: ASTNodeType.Boolean, value: token.value === 'TRUE' };
        }
        if (token.type === TokenType.Error) {
            this.consume();
            return { type: ASTNodeType.Error, value: token.value };
        }
        if (token.type === TokenType.CellReference) {
            this.consume();
            return { type: ASTNodeType.CellReference, cellRef: token.value };
        }
        if (token.type === TokenType.Identifier) {
            const idToken = this.consume();
            // If next is '(', it's a function call
            if (this.peek().type === TokenType.LParen) {
                this.consume(TokenType.LParen);
                const args = [];
                if (this.peek().type !== TokenType.RParen) {
                    args.push(this.parseExpression());
                    while (this.peek().type === TokenType.Comma) {
                        this.consume(TokenType.Comma);
                        // Handle missing argument like SUM(1,,2)
                        if (this.peek().type === TokenType.Comma || this.peek().type === TokenType.RParen) {
                            // Insert a dummy node or handle empty args in evaluator. 
                            // Let's just pass undefined or a special EmptyNode. For now, skip adding it to keep it simple,
                            // or just let the evaluator throw. Excel allows empty args. Let's add an ErrorNode or null
                            // Actually Excel treats empty args as 0 or "" depending on context. Let's add a NumberNode(0) for simplicity.
                            args.push({ type: ASTNodeType.Number, value: 0 });
                        }
                        else {
                            args.push(this.parseExpression());
                        }
                    }
                }
                this.consume(TokenType.RParen);
                return {
                    type: ASTNodeType.FunctionCall,
                    functionName: idToken.value.toUpperCase(),
                    arguments: args
                };
            }
            // Otherwise it could be a named range (treated as CellReference/Identifier for evaluation)
            return {
                type: ASTNodeType.CellReference, // Or we could add a NamedRangeNode
                cellRef: idToken.value
            };
        }
        if (token.type === TokenType.LParen) {
            this.consume(TokenType.LParen);
            const node = this.parseExpression();
            this.consume(TokenType.RParen);
            return node;
        }
        if (token.type === TokenType.LBrace) {
            return this.parseArray();
        }
        throw new Error(`Unexpected token in factor: ${token.type} ('${token.value}') at position ${token.start}`);
    }
    parseArray() {
        this.consume(TokenType.LBrace);
        const elements = [];
        let currentRow = [];
        if (this.peek().type !== TokenType.RBrace) {
            while (true) {
                currentRow.push(this.parseExpression());
                const nextType = this.peek().type;
                if (nextType === TokenType.Comma) {
                    // Next element in same row
                    this.consume();
                }
                else if (nextType === TokenType.Identifier && this.peek().value === ';') { // Wait, Lexer didn't define Semicolon
                    // Let's assume comma is column separator, semicolon is row separator
                    // Since we didn't add semicolon to lexer, let's just break for now or add it to lexer.
                    // For now, let's just parse 1D array
                    break;
                }
                else if (nextType === TokenType.RBrace) {
                    elements.push(currentRow);
                    break;
                }
                else {
                    // If we had semicolon, it would be a new row. But since we lack it, we treat it as error.
                    throw new Error(`Expected ',' or '}' in array constant but got ${nextType}`);
                }
            }
        }
        else {
            elements.push(currentRow);
        }
        this.consume(TokenType.RBrace);
        return { type: ASTNodeType.Array, elements };
    }
}
//# sourceMappingURL=Parser.js.map