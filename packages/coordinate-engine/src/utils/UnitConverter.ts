import { CoordinateUnit } from '../models/Coordinate';

// ─────────────────────────────────────────────────────────────────────────────
// Unit Converter
// Supports standard Office/Web units. Base calculation uses DPI = 96.
// 1 inch = 96 px = 72 pt = 1440 twips = 914400 EMUs
// ─────────────────────────────────────────────────────────────────────────────
export class UnitConverter {
  private static readonly DPI = 96;
  private static readonly PT_PER_INCH = 72;
  private static readonly TWIPS_PER_INCH = 1440;
  private static readonly EMUS_PER_INCH = 914400;
  private static readonly MM_PER_INCH = 25.4;
  private static readonly CM_PER_INCH = 2.54;

  /**
   * Convert any unit to standard Pixels (px)
   */
  public static toPixels(value: number, fromUnit: CoordinateUnit): number {
    switch (fromUnit) {
      case 'px': return value;
      case 'in': return value * this.DPI;
      case 'pt': return (value / this.PT_PER_INCH) * this.DPI;
      case 'twip': return (value / this.TWIPS_PER_INCH) * this.DPI;
      case 'emu': return (value / this.EMUS_PER_INCH) * this.DPI;
      case 'mm': return (value / this.MM_PER_INCH) * this.DPI;
      case 'cm': return (value / this.CM_PER_INCH) * this.DPI;
      case 'dip': return value; // Device independent pixels often map 1:1 to px initially
      default: throw new Error(`Unsupported unit: ${fromUnit}`);
    }
  }

  /**
   * Convert Pixels (px) to any target unit
   */
  public static fromPixels(px: number, toUnit: CoordinateUnit): number {
    switch (toUnit) {
      case 'px': return px;
      case 'in': return px / this.DPI;
      case 'pt': return (px / this.DPI) * this.PT_PER_INCH;
      case 'twip': return (px / this.DPI) * this.TWIPS_PER_INCH;
      case 'emu': return (px / this.DPI) * this.EMUS_PER_INCH;
      case 'mm': return (px / this.DPI) * this.MM_PER_INCH;
      case 'cm': return (px / this.DPI) * this.CM_PER_INCH;
      case 'dip': return px;
      default: throw new Error(`Unsupported unit: ${toUnit}`);
    }
  }

  /**
   * Direct conversion between two arbitrary units
   */
  public static convert(value: number, fromUnit: CoordinateUnit, toUnit: CoordinateUnit): number {
    if (fromUnit === toUnit) return value;
    const px = this.toPixels(value, fromUnit);
    return this.fromPixels(px, toUnit);
  }
}
