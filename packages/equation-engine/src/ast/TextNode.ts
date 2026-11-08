import { MathASTNode, MathNodeType } from './MathASTNode';

/**
 * Represents standard text characters or mathematical symbols.
 */
export class TextNode extends MathASTNode {
  public content: string;
  public isSymbol: boolean;

  constructor(content: string, isSymbol: boolean = false) {
    super(isSymbol ? MathNodeType.Symbol : MathNodeType.Text);
    this.content = content;
    this.isSymbol = isSymbol;
  }
}
