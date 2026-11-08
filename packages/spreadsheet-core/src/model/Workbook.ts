import { v4 as uuidv4 } from 'uuid';

export interface Range {
  start: { row: number, col: number };
  end: { row: number, col: number };
}

export interface TableData {
  id: string;
  name: string;
  range: Range;
  hasHeaders: boolean;
}

export interface ShapeData {
  id: string;
  type: string; // 'rect', 'circle', 'line', 'arrow', 'star', etc.
  x: number;
  y: number;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  textColor?: string;
}
export interface ChartData {
  id: string;
  type: 'bar' | 'line' | 'area' | 'pie' | 'donut' | 'scatter' | 'radar' | 'column' | 'bar-horizontal' | 'waterfall' | 'combo';
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  dataRange?: string; // e.g. "A1:C5"
  series?: {
    name: string;
    values: number[];
    color?: string;
  }[];
  labels?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
}


export class Cell {
  public value: any = null;
  public formula: string | null = null;
  public format: any = {};

  constructor(public row: number, public col: number) {}
}

export class Worksheet {
  public id: string;
  public name: string;
  public mergedCells: Range[] = [];
  public tables: TableData[] = [];
  public shapes: ShapeData[] = [];
  public charts: ChartData[] = [];
  public hiddenRows: Set<number> = new Set();
  private cells: Map<string, Cell> = new Map();

  // Internal function exposed for save/load snapshot purposes
  public getCellsMap() { return this.cells; }
  public setCellsMap(cells: Map<string, Cell>) { this.cells = cells; }

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
  }

  public getCell(row: number, col: number): Cell {
    const key = `${row},${col}`;
    if (!this.cells.has(key)) {
      this.cells.set(key, new Cell(row, col));
    }
    return this.cells.get(key)!;
  }

  /** Shift all rows >= atRow down by 1 (insert empty row above atRow) */
  public insertRow(atRow: number) {
    const updated = new Map<string, Cell>();
    this.cells.forEach((cell, key) => {
      if (cell.row >= atRow) {
        const newRow = cell.row + 1;
        cell.row = newRow;
        updated.set(`${newRow},${cell.col}`, cell);
      } else {
        updated.set(key, cell);
      }
    });
    this.cells = updated;
  }

  /** Shift all rows > atRow up by 1 (delete row atRow) */
  public deleteRow(atRow: number) {
    const updated = new Map<string, Cell>();
    this.cells.forEach((cell, key) => {
      if (cell.row === atRow) return; // drop this row
      if (cell.row > atRow) {
        const newRow = cell.row - 1;
        cell.row = newRow;
        updated.set(`${newRow},${cell.col}`, cell);
      } else {
        updated.set(key, cell);
      }
    });
    this.cells = updated;
  }

  /** Shift all cols >= atCol right by 1 (insert empty column before atCol) */
  public insertColumn(atCol: number) {
    const updated = new Map<string, Cell>();
    this.cells.forEach((cell, key) => {
      if (cell.col >= atCol) {
        const newCol = cell.col + 1;
        cell.col = newCol;
        updated.set(`${cell.row},${newCol}`, cell);
      } else {
        updated.set(key, cell);
      }
    });
    this.cells = updated;
  }

  /** Shift all cols > atCol left by 1 (delete column atCol) */
  public deleteColumn(atCol: number) {
    const updated = new Map<string, Cell>();
    this.cells.forEach((cell, key) => {
      if (cell.col === atCol) return; // drop this column
      if (cell.col > atCol) {
        const newCol = cell.col - 1;
        cell.col = newCol;
        updated.set(`${cell.row},${newCol}`, cell);
      } else {
        updated.set(key, cell);
      }
    });
    this.cells = updated;
  }

  public clone(newName: string): Worksheet {
    const newSheet = new Worksheet(newName);
    // clone merged cells
    newSheet.mergedCells = this.mergedCells ? JSON.parse(JSON.stringify(this.mergedCells)) : [];
    // clone cells
    const newCells = new Map<string, Cell>();
    this.cells.forEach((cell, key) => {
      const clonedCell = new Cell(cell.row, cell.col);
      clonedCell.value = cell.value;
      clonedCell.formula = cell.formula;
      clonedCell.format = cell.format ? JSON.parse(JSON.stringify(cell.format)) : {};
      newCells.set(key, clonedCell);
    });
    newSheet.setCellsMap(newCells);
    return newSheet;
  }
}

export class Workbook {
  public id: string;
  public sheets: Worksheet[] = [];
  public activeSheetId: string | null = null;

  constructor() {
    this.id = uuidv4();
    this.addSheet('Sheet1');
  }

  public addSheet(name: string) {
    const sheet = new Worksheet(name);
    this.sheets.push(sheet);
    if (!this.activeSheetId) {
      this.activeSheetId = sheet.id;
    }
    return sheet;
  }

  public serialize(): string {
    const data = {
      id: this.id,
      activeSheetId: this.activeSheetId,
      sheets: this.sheets.map(sheet => ({
        id: sheet.id,
        name: sheet.name,
        mergedCells: sheet.mergedCells,
        tables: sheet.tables,
        shapes: sheet.shapes,
        charts: sheet.charts,
        hiddenRows: Array.from(sheet.hiddenRows),
        cells: Array.from(sheet.getCellsMap().entries())
      }))
    };
    return JSON.stringify(data);
  }

  public static deserialize(json: string): Workbook {
    const wb = new Workbook();
    try {
      const data = JSON.parse(json);
      wb.id = data.id || wb.id;
      wb.activeSheetId = data.activeSheetId;
      if (data.sheets && data.sheets.length > 0) {
        wb.sheets = data.sheets.map((sData: any) => {
          const sheet = new Worksheet(sData.name);
          sheet.id = sData.id;
          sheet.mergedCells = sData.mergedCells || [];
          sheet.tables = sData.tables || [];
          sheet.shapes = sData.shapes || [];
          sheet.charts = sData.charts || [];
          sheet.hiddenRows = new Set(sData.hiddenRows || []);
          
          const cellsMap = new Map<string, Cell>();
          if (sData.cells) {
            sData.cells.forEach(([key, cellData]: [string, any]) => {
              const cell = new Cell(cellData.row, cellData.col);
              cell.value = cellData.value;
              cell.formula = cellData.formula;
              cell.format = cellData.format || {};
              cellsMap.set(key, cell);
            });
          }
          sheet.setCellsMap(cellsMap);
          return sheet;
        });
      }
    } catch (e) {
      console.error('Failed to deserialize workbook', e);
    }
    return wb;
  }
}
