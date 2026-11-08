import { DependencyGraph } from './DependencyGraph';
import { FormulaEngine } from '@officex/formula-engine';
import type { EvaluationContext } from '@officex/formula-engine';
import { SpillEngine, SpillContext } from './DynamicArrayEngine';
import { AddressConverter } from '../utils/AddressConverter';
import { VolatileEngine } from './VolatileEngine';
import { MultithreadEngine } from './MultithreadEngine';

export class CalculationEngine {
  private dependencyGraph = new DependencyGraph();
  private formulaEngine: FormulaEngine;
  private spillEngine = new SpillEngine();
  private volatileEngine = new VolatileEngine();
  private cellValues = new Map<string, any>();
  private cellFormulas = new Map<string, string>();

  constructor() {
    this.formulaEngine = new FormulaEngine();
  }

  public setCellValue(cell: string, value: any) {
    this.cellValues.set(cell, value);
    this.cellFormulas.delete(cell);
    this.dependencyGraph.clearDependencies(cell);
    this.spillEngine.clearSpill(cell);
    this.volatileEngine.clearVolatileCell(cell);
    this.recalculateDependents(cell);
    
    // Always trigger all volatile cells on any state change
    this.recalculateVolatiles();
  }

  public setCellFormula(cell: string, formula: string) {
    this.cellFormulas.set(cell, formula);
    
    // When setting a formula, calculate it first to establish its dependencies
    this.calculateCell(cell);
    
    // Then trigger a recalculation of its dependents just in case its value changed
    this.recalculateDependents(cell);

    // Also trigger volatiles
    this.recalculateVolatiles();
  }

  private recalculateVolatiles() {
    const volatiles = this.volatileEngine.getVolatileCells();
    for (const vCell of volatiles) {
      if (this.cellFormulas.has(vCell)) {
        this.calculateCell(vCell);
        this.recalculateDependents(vCell);
      }
    }
  }

  public getCellValue(cell: string): any {
    return this.cellValues.get(cell);
  }

  private calculateCell(cell: string) {
    const formula = this.cellFormulas.get(cell);
    if (!formula) return;

    this.dependencyGraph.clearDependencies(cell);
    this.spillEngine.clearSpill(cell);
    this.volatileEngine.clearVolatileCell(cell);

    const context: EvaluationContext = {
      getCellValue: (ref: string) => {
        this.dependencyGraph.addDependency(cell, ref);
        return this.getCellValue(ref);
      },
      setVolatile: () => {
        this.volatileEngine.registerVolatileCell(cell);
      },
      getRangeValues: (startRef: string, endRef: string) => {
        this.dependencyGraph.addDependency(cell, startRef);
        this.dependencyGraph.addDependency(cell, endRef);
        
        // Proper range resolution
        const start = AddressConverter.toRC(startRef);
        const end = AddressConverter.toRC(endRef);
        
        const minRow = Math.min(start.row, end.row);
        const maxRow = Math.max(start.row, end.row);
        const minCol = Math.min(start.col, end.col);
        const maxCol = Math.max(start.col, end.col);
        
        const result: any[][] = [];
        for (let r = minRow; r <= maxRow; r++) {
          const row: any[] = [];
          for (let c = minCol; c <= maxCol; c++) {
            const ref = AddressConverter.toAddress({ row: r, col: c });
            this.dependencyGraph.addDependency(cell, ref); // Add every cell in range
            row.push(this.getCellValue(ref) ?? null);
          }
          result.push(row);
        }
        return result;
      }
    };

    try {
      const result = this.formulaEngine.execute(formula, context);
      
      // Handle Dynamic Arrays and Spills
      if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0])) {
        const sizeR = result.length;
        const sizeC = result[0].length;
        
        const spillCtx: SpillContext = {
          getCellValue: (ref) => this.getCellValue(ref)
        };

        if (this.spillEngine.checkSpillCollision(cell, sizeR, sizeC, spillCtx)) {
          this.cellValues.set(cell, '#SPILL!');
        } else {
          this.spillEngine.registerSpill(cell, sizeR, sizeC);
          const start = AddressConverter.toRC(cell);
          
          for (let r = 0; r < sizeR; r++) {
            for (let c = 0; c < sizeC; c++) {
              const targetRef = AddressConverter.toAddress({ row: start.row + r, col: start.col + c });
              this.cellValues.set(targetRef, result[r][c]);
            }
          }
        }
      } else {
        this.cellValues.set(cell, result);
      }
      
    } catch (e: any) {
      this.cellValues.set(cell, e.message);
    }
  }

  private recalculateDependents(startCell: string) {
    try {
      // Phase 4: Use MultithreadEngine to calculate parallel tiers
      const tiers = MultithreadEngine.splitIndependentChains(this.dependencyGraph, [startCell]);
      
      for (const tier of tiers) {
        // In a true multithreaded environment, we would dispatch this 'tier' array to Web Workers here
        // Promise.all(tier.map(cell => workerPool.execute(cell)))
        
        for (const cell of tier) {
          if (cell === startCell) continue;
          
          if (this.cellFormulas.has(cell)) {
            this.calculateCell(cell);
          }
        }
      }
    } catch (e) {
      console.error(e);
      this.cellValues.set(startCell, '#REF!');
    }
  }
}
