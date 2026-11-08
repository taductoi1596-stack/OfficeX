import { StyleModel } from '../models/StyleModel';

export class StyleRegistry {
  // Keyed by Style ID (e.g. 'Normal', 'Heading1')
  private styles: Map<string, StyleModel> = new Map();

  public registerStyle(style: StyleModel): void {
    this.styles.set(style.id, style);
  }

  public getStyle(id: string): StyleModel | undefined {
    return this.styles.get(id);
  }

  public getAllStyles(): StyleModel[] {
    return Array.from(this.styles.values());
  }
}
