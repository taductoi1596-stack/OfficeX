export interface NamedRange {
  name: string;
  formula: string; // The AST or formula string
  scope: string; // Workbook or Sheet1
  comment?: string;
}

export class NameManager {
  private names = new Map<string, NamedRange>();

  public addName(name: string, formula: string, scope: string = 'Workbook', comment: string = '') {
    const key = this.getKey(name, scope);
    this.names.set(key, { name, formula, scope, comment });
  }

  public removeName(name: string, scope: string = 'Workbook') {
    this.names.delete(this.getKey(name, scope));
  }

  public getName(name: string, scope: string = 'Workbook'): NamedRange | undefined {
    return this.names.get(this.getKey(name, scope)) || this.names.get(this.getKey(name, 'Workbook'));
  }

  private getKey(name: string, scope: string): string {
    return `${scope.toUpperCase()}!${name.toUpperCase()}`;
  }
}
