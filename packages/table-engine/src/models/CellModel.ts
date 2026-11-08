export class CellModel {
  public row: number;
  public col: number;
  
  public rowSpan: number = 1;
  public colSpan: number = 1;
  
  // When a cell is merged into another, it becomes 'hidden' and should not be rendered
  public isHidden: boolean = false;
  
  // Internal content (simplified for this foundation)
  public content: string = '';

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
  }
}
