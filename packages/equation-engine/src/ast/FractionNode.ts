import { MathASTNode, MathNodeType } from './MathASTNode';

/**
 * Represents a mathematical fraction.
 * A fraction strictly contains a numerator (top) and a denominator (bottom).
 */
export class FractionNode extends MathASTNode {
  // A fraction can contain multiple nodes in the top or bottom (e.g. \frac{a+b}{c})
  public numerator: MathASTNode[];
  public denominator: MathASTNode[];
  
  // The calculated thickness of the fraction bar line
  public barThickness: number = 1.0;
  // The calculated Y position of the fraction bar (relative to the node's origin)
  public barY: number = 0;

  constructor(numerator: MathASTNode[] = [], denominator: MathASTNode[] = []) {
    super(MathNodeType.Fraction);
    this.numerator = numerator;
    this.denominator = denominator;
  }
}
