/**
 * ColorUtils.ts
 * High-performance color manipulation library for Office Color Picker.
 */

export interface OfficeTheme {
  dark1: string;
  light1: string;
  dark2: string;
  light2: string;
  accent1: string;
  accent2: string;
  accent3: string;
  accent4: string;
  accent5: string;
  accent6: string;
}

// Convert HEX to RGB
export function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const num = parseInt(c, 16);
  return [num >> 16, (num >> 8) & 255, num & 255];
}

// Convert RGB to HEX
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255, g /= 255, b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}

// Convert HSL to RGB
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r, g, b;
  h /= 360;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Generate a shade (darker) or tint (lighter) of a hex color.
 * Uses HSL manipulation.
 * @param hex Base color in hex
 * @param lum Target luminance adjustment.
 *   Positive values make it lighter (e.g., 0.8 is +80% lighter)
 *   Negative values make it darker (e.g., -0.2 is 20% darker)
 */
export function adjustLuminance(hex: string, lum: number): string {
  const [r, g, b] = hexToRgb(hex);
  let [h, s, l] = rgbToHsl(r, g, b);

  if (lum > 0) {
    // Tint: blend towards white
    l = l + (1 - l) * lum;
  } else {
    // Shade: blend towards black
    l = l + l * lum;
  }
  
  l = Math.max(0, Math.min(1, l));
  const [nr, ng, nb] = hslToRgb(h, s, l);
  return rgbToHex(nr, ng, nb);
}

/**
 * Standard Office 365 default Theme.
 */
export const DEFAULT_THEME: OfficeTheme = {
  dark1: '#000000',
  light1: '#FFFFFF',
  dark2: '#44546A',
  light2: '#E7E6E6',
  accent1: '#4472C4',
  accent2: '#ED7D31',
  accent3: '#A5A5A5',
  accent4: '#FFC000',
  accent5: '#5B9BD5',
  accent6: '#70AD47'
};

/**
 * Returns the 5 variants for an accent color:
 * Lighter 80%, Lighter 60%, Lighter 40%, Darker 25%, Darker 50%
 * (This is standard for Office Accent colors).
 */
export function getAccentVariants(hex: string): string[] {
  return [
    adjustLuminance(hex, 0.8),
    adjustLuminance(hex, 0.6),
    adjustLuminance(hex, 0.4),
    adjustLuminance(hex, -0.25),
    adjustLuminance(hex, -0.5)
  ];
}

/**
 * Returns variants for Dark 1 / Light 1 / Dark 2 / Light 2
 * Note: Office handles dark/light variants slightly differently,
 * but for V1 we approximate the visual grid.
 */
export function getNeutralVariants(hex: string, isLight: boolean): string[] {
  if (isLight) {
    // Light colors get darker variants: -5%, -15%, -25%, -35%, -50%
    return [
      adjustLuminance(hex, -0.05),
      adjustLuminance(hex, -0.15),
      adjustLuminance(hex, -0.25),
      adjustLuminance(hex, -0.35),
      adjustLuminance(hex, -0.50)
    ];
  } else {
    // Dark colors get lighter variants: +50%, +35%, +25%, +15%, +5%
    return [
      adjustLuminance(hex, 0.50),
      adjustLuminance(hex, 0.35),
      adjustLuminance(hex, 0.25),
      adjustLuminance(hex, 0.15),
      adjustLuminance(hex, 0.05)
    ];
  }
}

export const STANDARD_COLORS = [
  '#C00000', // Dark Red
  '#FF0000', // Red
  '#FFC000', // Orange
  '#FFFF00', // Yellow
  '#92D050', // Light Green
  '#00B050', // Green
  '#00B0F0', // Light Blue
  '#0070C0', // Blue
  '#002060', // Dark Blue
  '#7030A0'  // Purple
];
