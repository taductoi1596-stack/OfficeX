import { FontRegistry } from './FontRegistry';
import { FontModel } from '../models/FontModel';

export class FontFallbackEngine {
  private registry: FontRegistry;

  constructor(registry: FontRegistry) {
    this.registry = registry;
  }

  /**
   * Tries to find a font that can render the requested character.
   * Very similar to CSS font-family fallback: `font-family: "MyCustomFont", Arial, sans-serif;`
   * @param char The character to render (e.g. 'Đ')
   * @param preferredFont The font the user originally wanted
   */
  public findFallbackFont(char: string, preferredFont: FontModel): FontModel {
    // 1. Check if the preferred font actually supports it
    if (preferredFont.supportsCharacter(char)) {
      return preferredFont;
    }

    // 2. Scan the registry for ANY font that supports this char
    const allFonts = this.registry.getAllFonts();
    for (const font of allFonts) {
      if (font.supportsCharacter(char)) {
        // Ideally, we should rank fonts by how similar they are to the preferredFont
        // (e.g. matching Weight and Style first). But for this foundation, returning the first match is fine.
        return font;
      }
    }

    // 3. Absolute Fallback: Return the preferred font anyway, which will render as a missing glyph (tofu square)
    return preferredFont;
  }
}
