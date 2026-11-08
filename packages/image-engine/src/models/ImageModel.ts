import { TransformAction } from './Transformations';

export class ImageModel {
  public id: string;
  public sourceUrl: string; // URL, File path, or Base64 string
  
  // Original intrinsic size
  public originalWidth: number;
  public originalHeight: number;

  // The pipeline of non-destructive actions
  public pipeline: TransformAction[] = [];

  constructor(id: string, sourceUrl: string, width: number, height: number) {
    this.id = id;
    this.sourceUrl = sourceUrl;
    this.originalWidth = width;
    this.originalHeight = height;
  }

  public addTransform(action: TransformAction): void {
    this.pipeline.push(action);
  }

  public resetTransforms(): void {
    this.pipeline = [];
  }
}
