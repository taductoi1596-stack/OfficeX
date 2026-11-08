import { AddressConverter } from '../utils/AddressConverter';

export class DynamicArrayEngine {
  /**
   * Resizes an output array based on its dynamic evaluation size.
   */
  public evaluateArray(formulaResult: any): any[][] {
    if (Array.isArray(formulaResult)) {
      if (Array.isArray(formulaResult[0])) {
        // It's already 2D
        return formulaResult;
      }
      // Wrap 1D into 2D (1 row, N cols)
      return [formulaResult];
    }
    // Single value to 1x1 array
    return [[formulaResult]];
  }

  /**
   * Performs implicit intersection if needed.
   */
  public getImplicitIntersection(result: any[][], row: number, col: number): any {
    if (result.length === 1 && result[0].length === 1) return result[0][0];
    
    // In actual implementation, we map row/col to the array boundaries
    return result[0][0]; 
  }
}

export interface SpillContext {
  getCellValue(cellRef: string): any;
}

export class SpillEngine {
  private spillCache = new Map<string, { sizeR: number, sizeC: number }>();

  public checkSpillCollision(targetCell: string, sizeR: number, sizeC: number, context: SpillContext): boolean {
    if (sizeR <= 1 && sizeC <= 1) return false;

    const startCoords = AddressConverter.toRC(targetCell);

    for (let r = 0; r < sizeR; r++) {
      for (let c = 0; c < sizeC; c++) {
        // Skip the origin cell itself
        if (r === 0 && c === 0) continue;

        const checkCoords = { row: startCoords.row + r, col: startCoords.col + c };
        const checkRef = AddressConverter.toAddress(checkCoords);
        const existingVal = context.getCellValue(checkRef);
        
        // If there's an existing value that is not undefined/null/empty string, it's a collision
        if (existingVal !== undefined && existingVal !== null && existingVal !== '') {
          return true; // #SPILL!
        }
      }
    }
    return false;
  }

  public registerSpill(originCell: string, sizeR: number, sizeC: number) {
    this.spillCache.set(originCell, { sizeR, sizeC });
  }

  public clearSpill(originCell: string) {
    this.spillCache.delete(originCell);
  }
}
