export function getColName(colIndex: number): string {
  let name = '';
  let c = colIndex;
  while (c > 0) {
    let mod = (c - 1) % 26;
    name = String.fromCharCode(65 + mod) + name;
    c = Math.floor((c - 1) / 26);
  }
  return name;
}

export function getCellRef(row: number, col: number): string {
  return `${getColName(col)}${row}`;
}

export function parseCellRef(ref: string): { row: number; col: number } | null {
  const match = ref.match(/^([A-Z]+)(\d+)$/i);
  if (!match) return null;

  const colStr = match[1].toUpperCase();
  const rowStr = match[2];

  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64);
  }

  return {
    col,
    row: parseInt(rowStr, 10),
  };
}
