import { TextRun } from '../models/DocumentModel';
import { IMeasurementEngine } from './MeasurementEngine';
import { LayoutRun, LayoutLine } from '../models/LayoutTree';

export class LineBreakingEngine {
  private measurementEngine: IMeasurementEngine;

  constructor(measurementEngine: IMeasurementEngine) {
    this.measurementEngine = measurementEngine;
  }

  /**
   * Breaks a list of text runs into multiple lines based on maximum width constraint.
   * Basic greedy word-wrap algorithm.
   */
  public breakLines(runs: TextRun[], maxWidth: number): LayoutLine[] {
    const lines: LayoutLine[] = [];
    
    let currentLineRuns: LayoutRun[] = [];
    let currentLineWidth = 0;
    let currentLineHeight = 0;

    for (const run of runs) {
      // Split run text by spaces to evaluate words
      const words = run.text.split(' ');

      for (let i = 0; i < words.length; i++) {
        const word = words[i] + (i < words.length - 1 ? ' ' : '');
        if (!word) continue;

        const metrics = this.measurementEngine.measureText(word, run.fontFamily, run.fontSize, run.isBold, run.isItalic);

        // If the word alone exceeds maxWidth and the line is empty, we must break the word (simplified: just put it in)
        if (currentLineWidth + metrics.width > maxWidth && currentLineWidth > 0) {
          // Push current line
          lines.push(this.createLayoutLine(currentLineRuns, currentLineWidth, currentLineHeight));
          
          // Reset for new line
          currentLineRuns = [];
          currentLineWidth = 0;
          currentLineHeight = 0;
        }

        // Add word to current line run (we can merge with previous run if same formatting, but keeping simple here)
        currentLineRuns.push({
          type: 'run',
          text: word,
          x: currentLineWidth,
          y: 0, // Relative to line
          width: metrics.width,
          height: metrics.height,
          fontFamily: run.fontFamily,
          fontSize: run.fontSize
        });

        currentLineWidth += metrics.width;
        currentLineHeight = Math.max(currentLineHeight, metrics.height);
      }
    }

    if (currentLineRuns.length > 0) {
      lines.push(this.createLayoutLine(currentLineRuns, currentLineWidth, currentLineHeight));
    }

    return lines;
  }

  private createLayoutLine(runs: LayoutRun[], width: number, height: number): LayoutLine {
    return {
      type: 'line',
      x: 0,
      y: 0,
      width,
      height,
      baseline: height * 0.8, // Simplified baseline calculation
      runs
    };
  }
}
