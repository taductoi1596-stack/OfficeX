export class SeriesModel {
  public id: string;
  public name: string;
  public values: number[];
  public categories: string[]; // e.g. ["Q1", "Q2", "Q3", "Q4"]
  
  public color: string = '#4285F4'; // Default blue
  public isVisible: boolean = true;

  constructor(id: string, name: string, values: number[], categories: string[] = []) {
    this.id = id;
    this.name = name;
    this.values = values;
    this.categories = categories;
  }
}
