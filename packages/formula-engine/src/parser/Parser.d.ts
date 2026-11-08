import { Token } from './Lexer';
import { ASTNode } from '../models/AST';
export declare class Parser {
    private tokens;
    private pos;
    constructor(tokens: Token[]);
    private peek;
    private peekNext;
    private consume;
    parse(): ASTNode;
    private parseExpression;
    private parseConcat;
    private parseAddition;
    private parseMultiplication;
    private parseExponentiation;
    private parsePercentage;
    private parseUnary;
    private parseRange;
    private parseFactor;
    private parseArray;
}
//# sourceMappingURL=Parser.d.ts.map