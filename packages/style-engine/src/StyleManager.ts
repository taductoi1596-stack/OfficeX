import { StyleModel } from './models/StyleModel';
import { StyleType, CombinedFormatting } from './models/StyleTypes';
import { StyleRegistry } from './engines/StyleRegistry';
import { StyleResolver } from './engines/StyleResolver';

export class StyleManager {
  private registry: StyleRegistry;
  private resolver: StyleResolver;

  constructor() {
    this.registry = new StyleRegistry();
    this.resolver = new StyleResolver(this.registry);
    this.createDocumentDefaults();
  }

  /**
   * Initializes the standard "Normal" style that acts as the root of the document.
   */
  private createDocumentDefaults(): void {
    const normal = new StyleModel('Normal', 'Normal', StyleType.Paragraph);
    normal.formatting = {
      fontFamily: 'Calibri',
      fontSize: 11,
      color: '#000000',
      bold: false,
      italic: false,
      lineHeight: 1.15,
      spaceAfter: 8
    };
    this.registry.registerStyle(normal);
  }

  public addStyle(style: StyleModel): void {
    this.registry.registerStyle(style);
  }

  public getStyle(id: string): StyleModel | undefined {
    return this.registry.getStyle(id);
  }

  /**
   * Get the fully resolved CSS-like properties for a style, tracing up its inheritance chain.
   */
  public getComputedFormatting(styleId: string): CombinedFormatting {
    return this.resolver.resolveStyle(styleId);
  }
}
