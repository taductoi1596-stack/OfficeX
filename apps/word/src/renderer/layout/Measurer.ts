import type { RunFmt } from '../document/DocumentTypes';

export const PT_PX    = 96 / 72;
export const DEF_SIZE = 12;
export const DEF_FONT = 'Calibri';
export const BULLET_INDENT = 24;

export class Measurer {
  private static _i: Measurer;
  private cvs = document.createElement('canvas');
  private ctx = this.cvs.getContext('2d')!;
  private cache = new Map<string, number>();
  
  static get() { return this._i || (this._i = new Measurer()); }

  fontStr(f: RunFmt): string {
    const sz = Math.max(8, (f.fontSize ?? DEF_SIZE) * PT_PX);
    const w  = f.bold   ? 'bold'   : 'normal';
    const s  = f.italic ? 'italic' : 'normal';
    const fm = (f.fontFamily || DEF_FONT).replace(/['"]/g, '');
    return `${s} ${w} ${sz.toFixed(1)}px ${fm}, Arial, sans-serif`;
  }
  
  measure(t: string, f: RunFmt): number {
    if (f.inlineSmartArtId) return 400; // Fixed width for now
    if (f.inlineImage) return f.imageWidth ?? 100;
    if (!t) return 0;
    
    let textToMeasure = t;
    if (f.allCaps || f.smallCaps) textToMeasure = t.toUpperCase();

    const k = this.fontStr(f) + '§' + textToMeasure + '§' + (f.letterSpacing ?? 0) + '§' + (f.fontScale ?? 100) + '§' + (f.smallCaps ? 'sc' : '');
    if (this.cache.has(k)) return this.cache.get(k)!;
    
    this.ctx.font = this.fontStr(f);
    (this.ctx as any).fontKerning = 'normal';
    (this.ctx as any).textRendering = 'geometricPrecision';
    let w = this.ctx.measureText(textToMeasure).width;

    if (f.fontScale && f.fontScale !== 100) {
      w *= (f.fontScale / 100);
    }
    if (f.letterSpacing) {
      w += textToMeasure.length * (f.letterSpacing * PT_PX);
    }

    if (this.cache.size > 60000) this.cache.clear();
    this.cache.set(k, w);
    return w;
  }
  
  lineH(f: RunFmt, spacing = 1.0): number {
    if (f.inlineSmartArtId) return Math.ceil(300 * Math.max(1, spacing)); // Fixed height for now
    if (f.inlineImage) return Math.ceil((f.imageHeight ?? 100) * Math.max(1, spacing));
    return Math.ceil((f.fontSize ?? DEF_SIZE) * PT_PX * 1.35 * Math.max(1, spacing));
  }
  
  ascH(f: RunFmt): number {
    if (f.inlineSmartArtId) return 300;
    if (f.inlineImage) return f.imageHeight ?? 100;
    return (f.fontSize ?? DEF_SIZE) * PT_PX * 0.8;
  }
}
