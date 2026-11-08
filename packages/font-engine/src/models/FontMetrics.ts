export class FontMetrics {
  public ascent: number;
  public descent: number;
  public lineGap: number;
  public unitsPerEm: number;

  constructor(ascent: number, descent: number, lineGap: number, unitsPerEm: number) {
    this.ascent = ascent;
    this.descent = descent;
    this.lineGap = lineGap;
    this.unitsPerEm = unitsPerEm;
  }

  /**
   * Calculates the final line height in pixels based on a font size.
   * Typical formula: (ascent - descent + lineGap) / unitsPerEm * fontSize
   * Note: descent is usually negative.
   */
  public calculateLineHeight(fontSize: number): number {
    return ((this.ascent - this.descent + this.lineGap) / this.unitsPerEm) * fontSize;
  }
}
