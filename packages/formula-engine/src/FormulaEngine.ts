import { Lexer } from './parser/Lexer';
import { Parser } from './parser/Parser';
import { Evaluator, EvaluationContext } from './evaluator/Evaluator';
import { FunctionRegistry } from './evaluator/FunctionRegistry';

export type { EvaluationContext };

export class FormulaEngine {
  private evaluator: Evaluator;

  constructor(functionRegistry?: FunctionRegistry) {
    this.evaluator = new Evaluator(functionRegistry);
  }

  /**
   * Executes a formula string and returns the result.
   * @param formula The formula string, e.g. "=SUM(10, A1)"
   * @param context The context for resolving cell references
   */
  public execute(formula: string, context: EvaluationContext): any {
    try {
      const lexer = new Lexer(formula);
      const tokens = lexer.tokenize();
      
      const parser = new Parser(tokens);
      const ast = parser.parse();
      
      return this.evaluator.evaluate(ast, context);
    } catch (error: any) {
      // In a real engine, we return #VALUE! or #NAME? based on error type
      return error.message || '#ERROR!';
    }
  }
}
