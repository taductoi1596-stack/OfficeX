import { Paragraph } from '../models/DocumentModel';
import { LayoutParagraph, LayoutLine } from '../models/LayoutTree';
import { LineBreakingEngine } from './LineBreakingEngine';

export class ParagraphLayoutEngine {
  private lineBreakingEngine: LineBreakingEngine;

  constructor(lineBreakingEngine: LineBreakingEngine) {
    this.lineBreakingEngine = lineBreakingEngine;
  }

  public layoutParagraph(paragraph: Paragraph, maxWidth: number): LayoutParagraph {
    const effectiveWidth = maxWidth - (paragraph.indent || 0);
    
    // Break runs into lines
    const lines = this.lineBreakingEngine.breakLines(paragraph.runs, effectiveWidth);
    
    let currentY = 0;
    let maxWidthUsed = 0;

    // Position lines vertically
    for (const line of lines) {
      line.y = currentY;
      
      // Handle alignment
      if (paragraph.alignment === 'center') {
        line.x = (effectiveWidth - line.width) / 2 + (paragraph.indent || 0);
      } else if (paragraph.alignment === 'right') {
        line.x = effectiveWidth - line.width + (paragraph.indent || 0);
      } else {
        line.x = (paragraph.indent || 0);
      }

      currentY += line.height * (paragraph.lineSpacing || 1.15); // Standard line spacing
      maxWidthUsed = Math.max(maxWidthUsed, line.width);
    }

    const totalHeight = currentY + (paragraph.spacingBefore || 0) + (paragraph.spacingAfter || 0);

    return {
      type: 'paragraph',
      x: 0,
      y: 0, // Will be set by PaginationEngine
      width: maxWidth, // Paragraph occupies full available width block
      height: totalHeight,
      lines
    };
  }
}
