import { MathASTNode } from '../ast/MathASTNode';
import { TextNode } from '../ast/TextNode';
import { FractionNode } from '../ast/FractionNode';

/**
 * A mock parser to demonstrate how a LaTeX string is converted to an AST.
 * In a real implementation, this would use a Lexer and recursive descent parser.
 */
export class LaTeXParser {
  
  /**
   * Mock implementation. Only understands `\frac{a}{b}` for demonstration.
   */
  public parse(latex: string): MathASTNode[] {
    const trimmed = latex.trim();
    
    // Very naive mock check for \frac{a}{b}
    if (trimmed.startsWith('\\frac{') && trimmed.endsWith('}')) {
      // Extract contents roughly
      const content = trimmed.substring(6, trimmed.length - 1); // "a}{b"
      const parts = content.split('}{');
      
      if (parts.length === 2) {
        const num = new TextNode(parts[0]);
        const den = new TextNode(parts[1]);
        return [new FractionNode([num], [den])];
      }
    }

    // Fallback: just return it as a text node
    return [new TextNode(trimmed)];
  }
}
