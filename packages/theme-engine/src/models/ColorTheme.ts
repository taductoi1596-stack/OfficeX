export interface ColorTheme {
  // Main Text/Background mapping
  dark1: string;   // Usually Black
  light1: string;  // Usually White
  dark2: string;   // Usually Dark Gray
  light2: string;  // Usually Light Gray

  // Accents used heavily by ChartEngine and Shape fills
  accent1: string;
  accent2: string;
  accent3: string;
  accent4: string;
  accent5: string;
  accent6: string;

  // Hyperlink colors
  hyperlink: string;
  followedHyperlink: string;
}
