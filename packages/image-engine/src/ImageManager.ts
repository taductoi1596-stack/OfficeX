import { ImageModel } from './models/ImageModel';
import { TransformType } from './models/Transformations';
import { ImageProcessor, BoundingBox } from './pipeline/ImageProcessor';

export class ImageManager {
  private processor: ImageProcessor;

  constructor() {
    this.processor = new ImageProcessor();
  }

  public createImage(id: string, url: string, originalWidth: number, originalHeight: number): ImageModel {
    return new ImageModel(id, url, originalWidth, originalHeight);
  }

  public crop(image: ImageModel, x: number, y: number, width: number, height: number): void {
    image.addTransform({ type: TransformType.Crop, x, y, width, height });
  }

  public rotate(image: ImageModel, angleInDegrees: number): void {
    image.addTransform({ type: TransformType.Rotate, angleInDegrees });
  }

  public scale(image: ImageModel, scaleX: number, scaleY: number): void {
    image.addTransform({ type: TransformType.Scale, scaleX, scaleY });
  }

  public reset(image: ImageModel): void {
    image.resetTransforms();
  }

  public getFinalGeometry(image: ImageModel): BoundingBox {
    return this.processor.calculateFinalGeometry(image);
  }
}
