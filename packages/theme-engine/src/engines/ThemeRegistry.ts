import { ThemeModel } from '../models/ThemeModel';

export class ThemeRegistry {
  private themes: Map<string, ThemeModel> = new Map();

  public registerTheme(theme: ThemeModel): void {
    this.themes.set(theme.id, theme);
  }

  public getTheme(id: string): ThemeModel | undefined {
    return this.themes.get(id);
  }

  public getAllThemes(): ThemeModel[] {
    return Array.from(this.themes.values());
  }
}
