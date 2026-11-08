import { ImageModel } from '../models/ImageModel';
import { TransformType, CropTransform, RotateTransform, ScaleTransform } from '../models/Transformations';

export interface BoundingBox {
  width: number;
  height: number;
}

export class ImageProcessor {
  /**
   * Calculates the final geometry (width/height) of an image 
   * AFTER applying all transformations in its pipeline.
   * This is crucial for the Layout Engine to know how much space to allocate.
   */
  public calculateFinalGeometry(image: ImageModel): BoundingBox {
    let currentWidth = image.originalWidth;
    let currentHeight = image.originalHeight;

    for (const transform of image.pipeline) {
      switch (transform.type) {
        case TransformType.Crop: {
          const crop = transform as CropTransform;
          currentWidth = crop.width;
          currentHeight = crop.height;
          break;
        }
        case TransformType.Scale: {
          const scale = transform as ScaleTransform;
          currentWidth = currentWidth * scale.scaleX;
          currentHeight = currentHeight * scale.scaleY;
          break;
        }
        case TransformType.Rotate: {
          const rotate = transform as RotateTransform;
          // If rotated by 90 or 270 degrees, swap width and height
          if (rotate.angleInDegrees % 180 !== 0) {
            const temp = currentWidth;
            currentWidth = currentHeight;
            currentHeight = temp;
          }
          break;
        }
      }
    }

    return {
      width: Math.abs(currentWidth),
      height: Math.abs(currentHeight)
    };
  }
}
