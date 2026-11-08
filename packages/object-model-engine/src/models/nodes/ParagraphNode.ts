import { DocumentNode } from '../DocumentNode';

export class ParagraphNode extends DocumentNode {
  public readonly type = 'Paragraph';

  public getText(): string {
    return this.children.map(child => child.getText()).join('') + '\n';
  }
}
