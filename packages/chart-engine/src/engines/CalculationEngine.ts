import { ChartModel } from '../models/ChartModel';
import { AxisType } from '../models/AxisModel';

export class CalculationEngine {
  /**
   * Recalculates the scales for the chart based on current series data.
   * This handles the math for setting Axis Min, Max, and Tick intervals.
   */
  public calculateScales(chart: ChartModel): void {
    const valueAxis = chart.getAxis(AxisType.Value);
    if (!valueAxis) return; // Pie charts might not have a value axis

    if (chart.series.length === 0) {
      valueAxis.min = 0;
      valueAxis.max = 10;
      return;
    }

    let globalMin = Number.MAX_VALUE;
    let globalMax = Number.MIN_VALUE;

    // Scan all series to find the absolute min and max
    chart.series.forEach(series => {
      if (!series.isVisible) return;
      series.values.forEach(val => {
        if (val < globalMin) globalMin = val;
        if (val > globalMax) globalMax = val;
      });
    });

    // Basic scale rounding logic
    // In a real Excel engine, this is extremely complex to make numbers look "nice" (e.g. 0, 50, 100).
    // Here we use a simplified approach.
    if (globalMin > 0) {
      valueAxis.min = 0; // Usually column charts start Y axis at 0
    } else {
      valueAxis.min = Math.floor(globalMin * 1.1); // Add some padding
    }

    valueAxis.max = Math.ceil(globalMax * 1.1); // Add 10% padding to the top
    
    // Very basic tick calculation
    valueAxis.tickInterval = Math.max(1, Math.round((valueAxis.max - valueAxis.min) / 5));
  }
}
