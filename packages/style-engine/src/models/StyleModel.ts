import { StyleType, CombinedFormatting } from './StyleTypes';

export class StyleModel {
  public id: string;
  public name: string;
  public type: StyleType;
  
  // The ID of the parent style from which this style inherits properties.
  // e.g. 'Heading1' is based on 'Normal'.
  public basedOnId?: string; 

  // The local overrides specific to this style
  public formatting: CombinedFormatting;

  constructor(id: string, name: string, type: StyleType) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.formatting = {};
  }
}
