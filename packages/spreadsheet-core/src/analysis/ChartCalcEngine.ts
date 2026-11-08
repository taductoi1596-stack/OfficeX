export type ChartType = 
  | 'Column' | 'Bar' | 'Line' | 'Area' | 'Pie' | 'Doughnut' 
  | 'Scatter' | 'Bubble' | 'Radar' | 'Surface' | 'Stock' 
  | 'Histogram' | 'Pareto' | 'Waterfall' | 'Treemap' 
  | 'Sunburst' | 'BoxWhisker' | 'Funnel' | 'Map' | 'Combo';

export interface ChartSeries {
  id: string;
  name: string;
  values: number[]; // the calculated values
  categories?: string[]; // X-axis labels
  formula?: string; // Series formula
  trendline?: TrendlineData;
}

export interface TrendlineData {
  type: 'Linear' | 'Polynomial' | 'Logarithmic' | 'Power' | 'Exponential' | 'MovingAverage';
  equation: string;
  rSquared: number;
}

export interface ChartDataModel {
  chartType: ChartType;
  title: string;
  series: ChartSeries[];
  xAxis: { categories: string[] };
  yAxis: { min?: number, max?: number };
}

export class SeriesEngine {
  public calculateSeries(dataSourceRef: string, data: any[]): ChartSeries[] {
    // Scaffold: extract series from data array
    return [];
  }
}

export class AxisEngine {
  public calculateAxisBounds(series: ChartSeries[]): { min: number, max: number } {
    let min = Number.MAX_VALUE;
    let max = -Number.MAX_VALUE;
    
    for (const s of series) {
      const sMin = Math.min(...s.values);
      const sMax = Math.max(...s.values);
      if (sMin < min) min = sMin;
      if (sMax > max) max = sMax;
    }
    return { min, max };
  }
}

export class StatisticsEngine {
  public calculateTrendline(values: number[], type: TrendlineData['type']): TrendlineData {
    // Scaffold trendline math
    return {
      type,
      equation: 'y = mx + b',
      rSquared: 0.99
    };
  }
}

export class ChartCalcEngine {
  private seriesEngine = new SeriesEngine();
  private axisEngine = new AxisEngine();
  private statsEngine = new StatisticsEngine();

  public calculate(chartType: ChartType, dataSourceRef: string, rawData: any[]): ChartDataModel {
    const seriesList = this.seriesEngine.calculateSeries(dataSourceRef, rawData);
    const yAxisBounds = this.axisEngine.calculateAxisBounds(seriesList);

    const model: ChartDataModel = {
      chartType,
      title: "Generated Chart",
      series: seriesList,
      xAxis: { categories: seriesList[0]?.categories || [] },
      yAxis: yAxisBounds
    };

    return model;
  }
}
