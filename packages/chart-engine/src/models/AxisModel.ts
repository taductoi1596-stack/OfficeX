export enum AxisType {
  Category = 'Category', // Typically X-Axis
  Value = 'Value'        // Typically Y-Axis
}

export enum AxisPosition {
  Bottom = 'Bottom',
  Left = 'Left',
  Top = 'Top',
  Right = 'Right'
}

export class AxisModel {
  public type: AxisType;
  public position: AxisPosition;
  
  // Calculated dynamically by CalculationEngine
  public min: number = 0;
  public max: number = 0;
  public tickInterval: number = 0;

  public title: string = '';
  public showGridlines: boolean = true;

  constructor(type: AxisType, position: AxisPosition) {
    this.type = type;
    this.position = position;
  }
}
