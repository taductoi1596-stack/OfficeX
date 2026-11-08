export enum MathNodeType {
  Text = 'text',
  Symbol = 'symbol',
  Fraction = 'fraction',
  // Future expansions: Radical, Integral, Matrix, Script...
}

/**
 * Base Abstract Syntax Tree Node for mathematical equations.
 * It separates the meaning (type/children) from the visual representation (x/y/width/height).
 */
export abstract class MathASTNode {
  public type: MathNodeType;
  
  // Physical layout box (calculated later by MathLayoutEngine)
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;

  // The baseline offset from the top of the bounding box.
  // Critical for aligning mathematical characters of different heights (e.g. 'a' vs 'f').
  public baseline: number = 0;

  constructor(type: MathNodeType) {
    this.type = type;
  }
}
