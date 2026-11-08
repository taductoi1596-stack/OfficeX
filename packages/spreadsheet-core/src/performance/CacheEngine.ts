import { ASTNode } from '@officex/formula-engine';

export class CacheEngine {
  private astCache = new Map<string, ASTNode>();
  private resultCache = new Map<string, any>();
  private volatileCells = new Set<string>();

  public getAST(formula: string): ASTNode | undefined {
    return this.astCache.get(formula);
  }

  public setAST(formula: string, ast: ASTNode) {
    this.astCache.set(formula, ast);
  }

  public getResult(cellId: string): any {
    return this.resultCache.get(cellId);
  }

  public setResult(cellId: string, result: any, isVolatile: boolean = false) {
    this.resultCache.set(cellId, result);
    if (isVolatile) {
      this.volatileCells.add(cellId);
    }
  }

  public invalidate(cellId: string) {
    this.resultCache.delete(cellId);
  }

  public getVolatileCells(): Set<string> {
    return this.volatileCells;
  }
}
