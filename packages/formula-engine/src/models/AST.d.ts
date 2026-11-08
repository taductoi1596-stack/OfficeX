export declare enum ASTNodeType {
    Number = "Number",
    String = "String",
    Boolean = "Boolean",
    Error = "Error",
    CellReference = "CellReference",
    RangeReference = "RangeReference",
    BinaryOp = "BinaryOp",
    UnaryOp = "UnaryOp",
    FunctionCall = "FunctionCall",
    Array = "Array"
}
export interface ASTNode {
    type: ASTNodeType;
}
export interface NumberNode extends ASTNode {
    type: ASTNodeType.Number;
    value: number;
}
export interface StringNode extends ASTNode {
    type: ASTNodeType.String;
    value: string;
}
export interface BooleanNode extends ASTNode {
    type: ASTNodeType.Boolean;
    value: boolean;
}
export interface ErrorNode extends ASTNode {
    type: ASTNodeType.Error;
    value: string;
}
export interface CellReferenceNode extends ASTNode {
    type: ASTNodeType.CellReference;
    cellRef: string;
}
export interface RangeReferenceNode extends ASTNode {
    type: ASTNodeType.RangeReference;
    startRef: ASTNode;
    endRef: ASTNode;
}
export interface BinaryOpNode extends ASTNode {
    type: ASTNodeType.BinaryOp;
    operator: '+' | '-' | '*' | '/' | '^' | '&' | '=' | '<>' | '<' | '>' | '<=' | '>=';
    left: ASTNode;
    right: ASTNode;
}
export interface UnaryOpNode extends ASTNode {
    type: ASTNodeType.UnaryOp;
    operator: '+' | '-' | '%';
    operand: ASTNode;
}
export interface FunctionCallNode extends ASTNode {
    type: ASTNodeType.FunctionCall;
    functionName: string;
    arguments: ASTNode[];
}
export interface ArrayNode extends ASTNode {
    type: ASTNodeType.Array;
    elements: ASTNode[][];
}
//# sourceMappingURL=AST.d.ts.map