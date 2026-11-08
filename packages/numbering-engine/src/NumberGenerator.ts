// ─────────────────────────────────────────────────────────────────────────────
// Number Generator — Converts integers to string representations
// Ref: NUMBERING_ENGINE.md §8, §14
// ─────────────────────────────────────────────────────────────────────────────

import type { NumberFormat } from './models/List';

export class NumberGenerator {
  generate(value: number, format: NumberFormat, bulletChar?: string): string {
    switch (format) {
      case 'bullet':
        return bulletChar ?? '•';
      
      case 'arabic':
        return value.toString();

      case 'alpha-lower':
        return this.toAlpha(value).toLowerCase();

      case 'alpha-upper':
        return this.toAlpha(value).toUpperCase();

      case 'roman-lower':
        return this.toRoman(value).toLowerCase();

      case 'roman-upper':
        return this.toRoman(value).toUpperCase();

      default:
        return value.toString();
    }
  }

  private toAlpha(value: number): string {
    let result = '';
    let temp = value;
    while (temp > 0) {
      const remainder = (temp - 1) % 26;
      result = String.fromCharCode(65 + remainder) + result;
      temp = Math.floor((temp - 1) / 26);
    }
    return result || 'A';
  }

  private toRoman(value: number): string {
    if (value <= 0 || value >= 4000) return value.toString();
    const romanNumerals: [number, string][] = [
      [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
      [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
      [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];
    let result = '';
    let num = value;
    for (const [val, char] of romanNumerals) {
      while (num >= val) {
        result += char;
        num -= val;
      }
    }
    return result;
  }
}
