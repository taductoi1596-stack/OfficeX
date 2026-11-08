import { FontModel } from './models/FontModel';
import { FontMetrics } from './models/FontMetrics';
import { FontRegistry } from './engines/FontRegistry';
import { FontFallbackEngine } from './engines/FontFallbackEngine';

export class FontManager {
  private registry: FontRegistry;
  private fallbackEngine: FontFallbackEngine;

  constructor() {
    this.registry = new FontRegistry();
    this.fallbackEngine = new FontFallbackEngine(this.registry);
    this.registerSystemDefaults();
  }

  private registerSystemDefaults(): void {
    // Mocking Arial as a highly compatible font
    const arial = new FontModel('arial_1', 'Arial', 'local://Arial');
    // Basic Latin + Latin Extended (Vietnamese, etc.)
    arial.supportedUnicodeRanges = [[0x0000, 0x024F], [0x1E00, 0x1EFF]]; 
    
    // Mocking a Custom Font that only supports Basic ASCII
    const custom = new FontModel('custom_1', 'MyCustomFont', 'local://MyCustomFont');
    custom.supportedUnicodeRanges = [[0x0000, 0x007F]];

    this.registry.registerFont(arial);
    this.registry.registerFont(custom);
  }

  public registerFont(font: FontModel): void {
    this.registry.registerFont(font);
  }

  public getFont(family: string, weight: number = 400, style: string = 'normal'): FontModel | undefined {
    return this.registry.getFont(family, weight, style);
  }

  public getFallbackFont(char: string, preferredFont: FontModel): FontModel {
    return this.fallbackEngine.findFallbackFont(char, preferredFont);
  }

  /**
   * In a real environment, this delegates to HarfBuzz or OpenType.js.
   * Here we mock some metrics to let the Layout Engine do math.
   */
  public getMetrics(font: FontModel): FontMetrics {
    // Mock values: Typical Arial metrics
    // Ascent ~ 1491, Descent ~ -431, LineGap ~ 303, UnitsPerEm = 2048
    return new FontMetrics(1491, -431, 303, 2048);
  }
}
