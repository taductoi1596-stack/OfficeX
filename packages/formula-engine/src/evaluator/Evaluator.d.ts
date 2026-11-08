import { ASTNode } from '../models/AST';
import { FunctionRegistry } from './FunctionRegistry';
export interface EvaluationContext {
    getCellValue(cellRef: string): any;
    getRangeValues(startRef: string, endRef: string): any[][];
    setVolatile?: () => void;
}
export declare class Evaluator {
    private functionRegistry;
    constructor(functionRegistry?: FunctionRegistry);
    evaluate(node: ASTNode, context: EvaluationContext): any;
    private applyBinaryOperation;
    private broadcastBinaryOperation;
}
//# sourceMappingURL=Evaluator.d.ts.map