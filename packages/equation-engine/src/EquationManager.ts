import { MathASTNode } from './ast/MathASTNode';
import { LaTeXParser } from './parser/LaTeXParser';
import { MathLayoutEngine } from './layout/MathLayoutEngine';

export class EquationManager {
  private parser: LaTeXParser;
  private layoutEngine: MathLayoutEngine;

  constructor() {
    this.parser = new LaTeXParser();
    this.layoutEngine = new MathLayoutEngine();
  }

  /**
   * Compiles a LaTeX string directly into a calculated layout tree ready for rendering.
   */
  public compile(latex: string): { ast: MathASTNode[], bounds: { width: number, height: number } } {
    // 1. Semantic parsing
    const ast = this.parser.parse(latex);
    
    // 2. Physical Layout
    const bounds = this.layoutEngine.layout(ast);
    
    return { ast, bounds };
  }
}
