import { TableModel } from './models/TableModel';
import { MergeManager } from './managers/MergeManager';

export class TableEngine {
  public createTable(rows: number, cols: number): TableModel {
    return new TableModel(rows, cols);
  }

  public merge(table: TableModel, startRow: number, startCol: number, endRow: number, endCol: number): void {
    const mergeManager = new MergeManager(table);
    mergeManager.mergeCells(startRow, startCol, endRow, endCol);
  }

  // Debug utility to print the table layout
  public printTable(table: TableModel): string {
    let output = '';
    for (let r = 0; r < table.rows.length; r++) {
      for (let c = 0; c < table.columns.length; c++) {
        const cell = table.getCell(r, c);
        if (cell.isHidden) {
          output += '[ HIDDEN ] ';
        } else {
          output += `[(${cell.row},${cell.col}) R:${cell.rowSpan} C:${cell.colSpan}] `;
        }
      }
      output += '\n';
    }
    return output;
  }
}
