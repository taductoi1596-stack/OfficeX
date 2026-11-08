export class VolatileEngine {
  private volatileCells = new Set<string>();

  public registerVolatileCell(cell: string) {
    this.volatileCells.add(cell);
  }

  public clearVolatileCell(cell: string) {
    this.volatileCells.delete(cell);
  }

  public getVolatileCells(): string[] {
    return Array.from(this.volatileCells);
  }
}
