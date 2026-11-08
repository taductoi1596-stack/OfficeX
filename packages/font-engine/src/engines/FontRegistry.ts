import { FontModel } from '../models/FontModel';

export class FontRegistry {
  private fonts: Map<string, FontModel> = new Map();

  public registerFont(font: FontModel): void {
    // Basic key: Family + Weight + Style
    const key = `${font.family}-${font.weight}-${font.style}`.toLowerCase();
    this.fonts.set(key, font);
  }

  public getFont(family: string, weight: number = 400, style: string = 'normal'): FontModel | undefined {
    const key = `${family}-${weight}-${style}`.toLowerCase();
    return this.fonts.get(key);
  }

  public getAllFonts(): FontModel[] {
    return Array.from(this.fonts.values());
  }
}
