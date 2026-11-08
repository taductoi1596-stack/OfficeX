export class FontModel {
  public id: string;
  public family: string;
  public style: 'normal' | 'italic' | 'oblique' = 'normal';
  public weight: number = 400; // 400 is normal, 700 is bold

  public sourceUrl: string;

  // A mock array of supported Unicode ranges for this specific font.
  // In a real app, this is parsed from the OS/2 table of the TrueType font.
  public supportedUnicodeRanges: [number, number][] = [];

  constructor(id: string, family: string, sourceUrl: string) {
    this.id = id;
    this.family = family;
    this.sourceUrl = sourceUrl;
  }

  /**
   * Extremely simplified check to see if this font supports a specific unicode char.
   */
  public supportsCharacter(char: string): boolean {
    const codePoint = char.codePointAt(0);
    if (!codePoint) return false;

    // If no ranges defined, assume it supports basic ASCII for mocking
    if (this.supportedUnicodeRanges.length === 0) {
      return codePoint >= 0x0000 && codePoint <= 0x007F; 
    }

    for (const range of this.supportedUnicodeRanges) {
      if (codePoint >= range[0] && codePoint <= range[1]) {
        return true;
      }
    }
    return false;
  }
}
