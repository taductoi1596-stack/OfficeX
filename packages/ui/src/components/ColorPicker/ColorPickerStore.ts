/**
 * ColorPickerStore.ts
 * Manages Recent Colors state for the Office Color Picker.
 */

const RECENT_COLORS_KEY = 'officex_recent_colors';
const MAX_RECENT_COLORS = 20;

export class ColorPickerStore {
  private static recentColors: string[] = [];
  private static initialized = false;
  private static listeners: Set<() => void> = new Set();

  static init() {
    if (this.initialized) return;
    try {
      const stored = localStorage.getItem(RECENT_COLORS_KEY);
      if (stored) {
        this.recentColors = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load recent colors', e);
    }
    this.initialized = true;
  }

  static getRecentColors(): string[] {
    this.init();
    return [...this.recentColors];
  }

  static addRecentColor(hex: string) {
    this.init();
    const upperHex = hex.toUpperCase();
    
    // Remove if already exists (to move to front)
    this.recentColors = this.recentColors.filter(c => c.toUpperCase() !== upperHex);
    
    // Add to front
    this.recentColors.unshift(upperHex);
    
    // Cap at max
    if (this.recentColors.length > MAX_RECENT_COLORS) {
      this.recentColors = this.recentColors.slice(0, MAX_RECENT_COLORS);
    }

    try {
      localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(this.recentColors));
    } catch (e) {
      console.warn('Failed to save recent colors', e);
    }
    
    this.notify();
  }

  static subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private static notify() {
    this.listeners.forEach(l => l());
  }
}
