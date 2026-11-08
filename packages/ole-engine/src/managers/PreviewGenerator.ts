import { OleObject } from '../models/OleObject';

export class PreviewGenerator {
  
  /**
   * Generates a static preview (thumbnail) for an OLE Object.
   * In a real implementation, this would ask the external engine or use a cached snapshot.
   */
  public async generate(obj: OleObject): Promise<string> {
    // Mock generating a base64 image representation
    // e.g., drawing a gray box with the object type text inside it.
    return `data:image/png;base64,mock_preview_for_${obj.type}`;
  }
}
