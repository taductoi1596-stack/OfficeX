import { ThemeModel } from './models/ThemeModel';
import { ColorTheme } from './models/ColorTheme';
import { TypographyTheme } from './models/TypographyTheme';
import { ThemeRegistry } from './engines/ThemeRegistry';

export class ThemeManager {
  private registry: ThemeRegistry;
  private activeThemeId: string;

  constructor() {
    this.registry = new ThemeRegistry();
    this.registerBuiltInThemes();
    
    // Default to Office 2013-2021 standard theme
    this.activeThemeId = 'office-default';
  }

  private registerBuiltInThemes(): void {
    // 1. Office Default Theme (Light)
    const officeColors: ColorTheme = {
      dark1: '#000000', light1: '#FFFFFF',
      dark2: '#44546A', light2: '#E7E6E6',
      accent1: '#4472C4', accent2: '#ED7D31',
      accent3: '#A5A5A5', accent4: '#FFC000',
      accent5: '#5B9BD5', accent6: '#70AD47',
      hyperlink: '#0563C1', followedHyperlink: '#954F72'
    };
    const officeTypo: TypographyTheme = {
      headingFont: { latin: 'Calibri Light' },
      bodyFont: { latin: 'Calibri' }
    };
    this.registry.registerTheme(new ThemeModel('office-default', 'Office', officeColors, officeTypo));

    // 2. Mock Dark Theme
    const darkColors: ColorTheme = {
      dark1: '#FFFFFF', light1: '#000000', // Inverted
      dark2: '#D0D0D0', light2: '#202020',
      accent1: '#5B9BD5', accent2: '#F8A365', // Lighter accents for dark bg
      accent3: '#B0B0B0', accent4: '#FFD966',
      accent5: '#8FAADC', accent6: '#A9D18E',
      hyperlink: '#6BA5E7', followedHyperlink: '#B4789A'
    };
    const darkTypo: TypographyTheme = {
      headingFont: { latin: 'Segoe UI Semilight' },
      bodyFont: { latin: 'Segoe UI' }
    };
    this.registry.registerTheme(new ThemeModel('office-dark', 'Dark Mode', darkColors, darkTypo));
  }

  public getActiveTheme(): ThemeModel {
    const theme = this.registry.getTheme(this.activeThemeId);
    if (!theme) {
      throw new Error('Critical: Active theme not found in registry');
    }
    return theme;
  }

  public switchTheme(themeId: string): void {
    if (!this.registry.getTheme(themeId)) {
      console.error(`Theme ${themeId} not found.`);
      return;
    }
    this.activeThemeId = themeId;
    // In a real app, we would emit an event here so the UI and StyleEngine can re-render.
  }
}
