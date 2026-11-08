import { SmartArtModel } from './models/SmartArtModel';
import { LayoutGenerator, SmartArtLayoutResult } from './layouts/LayoutGenerator';
import { BasicListLayout } from './layouts/BasicListLayout';

export class SmartArtManager {
  private activeModel: SmartArtModel | null = null;
  private layoutGenerator: LayoutGenerator;
  private currentLayoutResult: SmartArtLayoutResult | null = null;

  constructor() {
    // Default to a basic list layout
    this.layoutGenerator = new BasicListLayout();
  }

  public loadModel(model: SmartArtModel): void {
    this.activeModel = model;
    this.recalculateLayout();
  }

  public setLayoutGenerator(generator: LayoutGenerator): void {
    this.layoutGenerator = generator;
    this.recalculateLayout();
  }

  /**
   * Re-runs the algorithm whenever the graph changes.
   */
  public recalculateLayout(): void {
    if (!this.activeModel) return;
    this.currentLayoutResult = this.layoutGenerator.generateLayout(this.activeModel);
  }

  public getLayoutResult(): SmartArtLayoutResult | null {
    return this.currentLayoutResult;
  }
}
