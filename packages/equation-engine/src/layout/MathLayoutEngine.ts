import { MathASTNode, MathNodeType } from '../ast/MathASTNode';
import { TextNode } from '../ast/TextNode';
import { FractionNode } from '../ast/FractionNode';

/**
 * Engine responsible for recursively traversing the AST and calculating physical layout
 * (x, y, width, height, baseline) for every node.
 */
export class MathLayoutEngine {
  // Mock font metric data
  private readonly fontSize = 16;
  private readonly fractionBarThickness = 1;
  private readonly padding = 2; // Gap between text and fraction bar

  public layout(nodes: MathASTNode[], startX: number = 0, startY: number = 0): { width: number, height: number } {
    let currentX = startX;
    let maxHeight = 0;

    for (const node of nodes) {
      if (node.type === MathNodeType.Text || node.type === MathNodeType.Symbol) {
        this.layoutTextNode(node as TextNode, currentX, startY);
      } else if (node.type === MathNodeType.Fraction) {
        this.layoutFractionNode(node as FractionNode, currentX, startY);
      }
      
      currentX += node.width;
      maxHeight = Math.max(maxHeight, node.height);
    }

    return {
      width: currentX - startX,
      height: maxHeight
    };
  }

  private layoutTextNode(node: TextNode, x: number, y: number): void {
    // Mock measurement: 10px width per char, 16px height
    const charWidth = 10;
    node.width = node.content.length * charWidth;
    node.height = this.fontSize;
    node.x = x;
    node.y = y;
    node.baseline = this.fontSize * 0.8; // Baseline is typically ~80% down from the top
  }

  private layoutFractionNode(node: FractionNode, x: number, y: number): void {
    // 1. Layout children independently at (0,0) first to get their dimensions
    const numSize = this.layout(node.numerator, 0, 0);
    const denSize = this.layout(node.denominator, 0, 0);

    // 2. The fraction's width is the wider of the two + some margin
    node.width = Math.max(numSize.width, denSize.width) + 4; // +4 for slight overhang
    
    // 3. The fraction's height
    node.height = numSize.height + this.padding + this.fractionBarThickness + this.padding + denSize.height;

    // 4. Set fraction bounding box
    node.x = x;
    node.y = y;
    
    // 5. Calculate bar Y position (middle)
    node.barY = y + numSize.height + this.padding;
    node.barThickness = this.fractionBarThickness;

    // 6. Adjust children's actual X and Y to center them within the fraction
    this.shiftNodes(node.numerator, x + (node.width - numSize.width) / 2, y);
    this.shiftNodes(node.denominator, x + (node.width - denSize.width) / 2, node.barY + this.fractionBarThickness + this.padding);
    
    // Baseline of a fraction is roughly aligned with the fraction bar
    node.baseline = numSize.height + this.padding + (this.fractionBarThickness / 2);
  }

  /**
   * Helper to shift a block of nodes by a relative x/y offset.
   */
  private shiftNodes(nodes: MathASTNode[], deltaX: number, deltaY: number): void {
    for (const node of nodes) {
      node.x += deltaX;
      node.y += deltaY;
      
      // If the node is a fraction, shift its internal parts too (recursive shift is handled if we just use a robust layout system, but for mock we keep it simple)
      if (node.type === MathNodeType.Fraction) {
        const frac = node as FractionNode;
        frac.barY += deltaY;
        this.shiftNodes(frac.numerator, deltaX, deltaY);
        this.shiftNodes(frac.denominator, deltaX, deltaY);
      }
    }
  }
}
