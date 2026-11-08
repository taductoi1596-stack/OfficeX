import { CellModel } from './CellModel';
import { RowModel, ColumnModel } from './RowColumnModel';

export class TableModel {
  public rows: RowModel[] = [];
  public columns: ColumnModel[] = [];
  
  // 2D Array [row][col]
  public cells: CellModel[][] = [];

  constructor(rowCount: number, colCount: number) {
    this.initialize(rowCount, colCount);
  }

  private initialize(rowCount: number, colCount: number): void {
    for (let r = 0; r < rowCount; r++) {
      this.rows.push(new RowModel(r));
      const cellRow: CellModel[] = [];
      for (let c = 0; c < colCount; c++) {
        if (r === 0) {
          this.columns.push(new ColumnModel(c));
        }
        cellRow.push(new CellModel(r, c));
      }
      this.cells.push(cellRow);
    }
  }

  public getCell(row: number, col: number): CellModel {
    if (row < 0 || row >= this.rows.length || col < 0 || col >= this.columns.length) {
      throw new Error(`Cell index out of bounds: (${row}, ${col})`);
    }
    return this.cells[row][col];
  }
}
