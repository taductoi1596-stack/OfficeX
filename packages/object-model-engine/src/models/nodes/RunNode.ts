import { DocumentNode } from '../DocumentNode';

export class RunNode extends DocumentNode {
  public readonly type = 'Run';
  private text: string;

  constructor(text: string, id?: string) {
    super(id);
    this.text = text;
  }

  public setText(text: string): void {
    this.text = text;
    this.notifyChanged();
  }

  public getText(): string {
    return this.text;
  }
}
