import { SeriesModel } from './SeriesModel';
import { AxisModel, AxisType, AxisPosition } from './AxisModel';

export enum ChartType {
  Column = 'Column',
  Line = 'Line',
  Bar = 'Bar',
  Pie = 'Pie'
}

export class ChartModel {
  public title: string = '';
  public type: ChartType;
  
  public series: SeriesModel[] = [];
  public axes: AxisModel[] = [];

  constructor(type: ChartType) {
    this.type = type;

    // Default setup for basic Cartesian charts
    if (type === ChartType.Column || type === ChartType.Line || type === ChartType.Bar) {
      this.axes.push(new AxisModel(AxisType.Category, type === ChartType.Bar ? AxisPosition.Left : AxisPosition.Bottom));
      this.axes.push(new AxisModel(AxisType.Value, type === ChartType.Bar ? AxisPosition.Bottom : AxisPosition.Left));
    }
  }

  public addSeries(series: SeriesModel): void {
    this.series.push(series);
  }

  public getAxis(type: AxisType): AxisModel | undefined {
    return this.axes.find(a => a.type === type);
  }
}
