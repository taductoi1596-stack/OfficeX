import { FormulaParser } from '../formula/FormulaParser';
import { DependencyGraph } from './DependencyGraph';
import { Worksheet, Cell } from '../model/Workbook';
import { getCellRef } from '../utils/cellUtils';

export class CalculationEngine {
  private parser: FormulaParser;
  private graph: DependencyGraph;

  constructor(parser: FormulaParser, graph: DependencyGraph) {
    this.parser = parser;
    this.graph = graph;
  }

  // Helper to fetch cell value by string ref
  public getCellValue = (sheet: Worksheet, ref: string): any => {
    // Naive parsing A1 -> col A, row 1
    const match = ref.match(/^([A-Z]+)(\d+)$/i);
    if (!match) return 0;
    
    const colStr = match[1].toUpperCase();
    const rowStr = match[2];
    
    let col = 0;
    for (let i = 0; i < colStr.length; i++) {
      col = col * 26 + (colStr.charCodeAt(i) - 64);
    }
    const row = parseInt(rowStr, 10);
    
    const cell = sheet.getCell(row, col);
    if (cell.value === undefined || cell.value === null || cell.value === '') {
      return null;
    }
    const parsed = parseFloat(cell.value);
    return isNaN(parsed) ? cell.value : parsed;
  };

  public updateCell(sheet: Worksheet, row: number, col: number, input: string): string[] {
    const cell = sheet.getCell(row, col);
    const cellRef = getCellRef(row, col);
    
    // Clear old dependencies where this cell is the consumer
    this.graph.clearDependencies(cellRef);

    if (input.startsWith('=')) {
      cell.formula = input;
      // Extract new dependencies
      const refs = this.parser.extractReferences(input);
      for (const ref of refs) {
        this.graph.addDependency(ref, cellRef);
      }
    } else {
      cell.formula = null;
      cell.value = input;
    }

    // Array to track which cells were updated (for UI re-rendering)
    const updatedCells: string[] = [];

    // Recalculate this cell and its dependents
    this.recalculateNode(sheet, cellRef, updatedCells);

    return updatedCells;
  }

  private recalculateNode(sheet: Worksheet, ref: string, updatedCells: string[], visited = new Set<string>()) {
    if (visited.has(ref)) {
       // Circular dependency detected
       return;
    }
    visited.add(ref);
    
    // Get the cell object
    const match = ref.match(/^([A-Z]+)(\d+)$/i);
    if (!match) return;
    
    let col = 0;
    for (let i = 0; i < match[1].length; i++) {
      col = col * 26 + (match[1].charCodeAt(i) - 64);
    }
    const row = parseInt(match[2], 10);
    const cell = sheet.getCell(row, col);

    // Re-evaluate if it's a formula
    if (cell.formula) {
      cell.value = this.parser.parseAndEvaluate(cell.formula, (depRef) => this.getCellValue(sheet, depRef));
    }
    
    updatedCells.push(ref);

    // Recursively recalculate dependents
    const dependents = this.graph.getDependents(ref);
    for (const dep of dependents) {
      this.recalculateNode(sheet, dep, updatedCells, visited);
    }
  }
}
