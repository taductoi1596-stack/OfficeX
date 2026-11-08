import { ColorTheme } from './ColorTheme';
import { TypographyTheme } from './TypographyTheme';

export class ThemeModel {
  public id: string;
  public name: string;
  
  public colors: ColorTheme;
  public typography: TypographyTheme;

  constructor(id: string, name: string, colors: ColorTheme, typography: TypographyTheme) {
    this.id = id;
    this.name = name;
    this.colors = colors;
    this.typography = typography;
  }
}
