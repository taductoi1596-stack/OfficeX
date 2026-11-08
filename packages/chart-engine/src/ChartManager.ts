import { ChartModel, ChartType } from './models/ChartModel';
import { SeriesModel } from './models/SeriesModel';
import { CalculationEngine } from './engines/CalculationEngine';

export class ChartManager {
  private calcEngine: CalculationEngine;

  constructor() {
    this.calcEngine = new CalculationEngine();
  }

  public createChart(title: string, type: ChartType): ChartModel {
    const chart = new ChartModel(type);
    chart.title = title;
    return chart;
  }

  public addSeries(chart: ChartModel, series: SeriesModel): void {
    chart.addSeries(series);
  }

  /**
   * Refreshes the chart calculations (typically called before rendering).
   */
  public updateLayout(chart: ChartModel): void {
    this.calcEngine.calculateScales(chart);
  }

  // Debug utility
  public printAxisStatus(chart: ChartModel): string {
    const valueAxis = chart.getAxis(1 as any); // Type safety: 'Value' axis enum
    // Actually we can find it by looking up the model
    const vAxis = chart.axes.find(a => a.type === 'Value');
    if (!vAxis) return 'No Value Axis';
    
    return `Y-Axis -> Min: ${vAxis.min}, Max: ${vAxis.max}, TickInterval: ${vAxis.tickInterval}`;
  }
}
