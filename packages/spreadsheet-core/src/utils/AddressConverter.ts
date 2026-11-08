export interface CellCoordinates {
  row: number; // 0-indexed
  col: number; // 0-indexed
}

export class AddressConverter {
  /**
   * Converts 'A1' to { row: 0, col: 0 }
   */
  public static toRC(address: string): CellCoordinates {
    const match = address.match(/^([A-Za-z]+)(\d+)$/);
    if (!match) throw new Error(`Invalid cell address: ${address}`);

    const colStr = match[1].toUpperCase();
    const rowStr = match[2];

    let col = 0;
    for (let i = 0; i < colStr.length; i++) {
      col = col * 26 + (colStr.charCodeAt(i) - 64);
    }
    col -= 1; // 0-indexed

    const row = parseInt(rowStr, 10) - 1;

    return { row, col };
  }

  /**
   * Converts { row: 0, col: 0 } to 'A1'
   */
  public static toAddress(coords: CellCoordinates): string {
    let colIndex = coords.col;
    let colStr = '';

    while (colIndex >= 0) {
      colStr = String.fromCharCode((colIndex % 26) + 65) + colStr;
      colIndex = Math.floor(colIndex / 26) - 1;
    }

    return `${colStr}${coords.row + 1}`;
  }
}
