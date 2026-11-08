export declare enum TokenType {
    Number = "Number",
    String = "String",
    Boolean = "Boolean",
    Error = "Error",
    Identifier = "Identifier",// Function names, named ranges
    CellReference = "CellReference",// A1, $A$1, Sheet!A1
    Plus = "Plus",
    Minus = "Minus",
    Multiply = "Multiply",
    Divide = "Divide",
    Power = "Power",
    Percent = "Percent",
    Concat = "Concat",
    Equal = "Equal",
    NotEqual = "NotEqual",
    LessThan = "LessThan",
    GreaterThan = "GreaterThan",
    LessThanOrEqual = "LessThanOrEqual",
    GreaterThanOrEqual = "GreaterThanOrEqual",
    Colon = "Colon",// Range
    Space = "Space",// Intersection (hard to lex, often ignored in simple parsers, let's keep it in mind)
    LParen = "LParen",
    RParen = "RParen",
    LBrace = "LBrace",
    RBrace = "RBrace",
    LBracket = "LBracket",
    RBracket = "RBracket",
    Comma = "Comma",
    Exclamation = "Exclamation",
    EOF = "EOF"
}
export interface Token {
    type: TokenType;
    value: string;
    start: number;
    end: number;
}
export declare class Lexer {
    private input;
    private pos;
    constructor(input: string);
    tokenize(): Token[];
    private readString;
    private readNumber;
    private readIdentifierOrReference;
}
//# sourceMappingURL=Lexer.d.ts.map