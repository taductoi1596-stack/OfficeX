import { EvaluationContext } from './evaluator/Evaluator';
import { FunctionRegistry } from './evaluator/FunctionRegistry';
export { EvaluationContext };
export declare class FormulaEngine {
    private evaluator;
    constructor(functionRegistry?: FunctionRegistry);
    /**
     * Executes a formula string and returns the result.
     * @param formula The formula string, e.g. "=SUM(10, A1)"
     * @param context The context for resolving cell references
     */
    execute(formula: string, context: EvaluationContext): any;
}
//# sourceMappingURL=FormulaEngine.d.ts.map