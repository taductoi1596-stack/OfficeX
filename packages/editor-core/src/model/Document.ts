import { v4 as uuidv4 } from 'uuid';

export abstract class DocumentNode {
  public id: string;
  public parent: DocumentNode | null = null;
  public children: DocumentNode[] = [];

  constructor(id?: string) {
    this.id = id || uuidv4();
  }

  appendChild(child: DocumentNode) {
    child.parent = this;
    this.children.push(child);
  }

  removeChild(child: DocumentNode) {
    this.children = this.children.filter(c => c !== child);
    child.parent = null;
  }
}

export class Run extends DocumentNode {
  public text: string;
  public formatting: any; // Simplified for now

  constructor(text: string, formatting: any = {}) {
    super();
    this.text = text;
    this.formatting = formatting;
  }
}

export class Paragraph extends DocumentNode {
  constructor() {
    super();
  }

  addText(text: string, formatting?: any) {
    this.appendChild(new Run(text, formatting));
  }
}

export class Section extends DocumentNode {
  constructor() {
    super();
  }
}

export class Document extends DocumentNode {
  constructor() {
    super();
    // A document always has at least one section and paragraph
    const section = new Section();
    section.appendChild(new Paragraph());
    this.appendChild(section);
  }

  public get text(): string {
    return this.children.map(section => 
      section.children.map(paragraph => 
        paragraph.children.map((run: any) => run.text).join('')
      ).join('\n')
    ).join('\n---\n');
  }
}
