export class RowModel {
  public index: number;
  public height: number = 20; // Default height
  public isHidden: boolean = false;

  constructor(index: number) {
    this.index = index;
  }
}

export class ColumnModel {
  public index: number;
  public width: number = 100; // Default width
  public isHidden: boolean = false;

  constructor(index: number) {
    this.index = index;
  }
}
