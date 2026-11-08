import { TableModel } from '../models/TableModel';

export class MergeManager {
  private table: TableModel;

  constructor(table: TableModel) {
    this.table = table;
  }

  /**
   * Merges a rectangular block of cells.
   * @param startRow Top-left row index
   * @param startCol Top-left col index
   * @param endRow Bottom-right row index
   * @param endCol Bottom-right col index
   */
  public mergeCells(startRow: number, startCol: number, endRow: number, endCol: number): void {
    // Basic bounds validation
    if (startRow < 0 || endRow >= this.table.rows.length || startRow > endRow) {
      throw new Error('Invalid row range for merge');
    }
    if (startCol < 0 || endCol >= this.table.columns.length || startCol > endCol) {
      throw new Error('Invalid col range for merge');
    }

    // Advanced: Check if area overlaps with existing merges
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const cell = this.table.getCell(r, c);
        if (cell.isHidden || cell.rowSpan > 1 || cell.colSpan > 1) {
          throw new Error(`Cannot merge overlapping cells at (${r}, ${c})`);
        }
      }
    }

    // Set the master cell
    const masterCell = this.table.getCell(startRow, startCol);
    masterCell.rowSpan = endRow - startRow + 1;
    masterCell.colSpan = endCol - startCol + 1;

    // Hide the rest of the cells in the block
    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        if (r === startRow && c === startCol) continue; // Skip master cell
        
        const cellToHide = this.table.getCell(r, c);
        cellToHide.isHidden = true;
      }
    }
  }
}
