/**
 * Represents a single logical node in a SmartArt diagram.
 * It contains semantic content but NO layout coordinates yet.
 */
export class SmartArtNode {
  public id: string;
  public text: string;
  public shapeType: string = 'rectangle';
  public level: number = 0; // Hierarchy level (e.g. 0 = root, 1 = child)

  constructor(id: string, text: string) {
    this.id = id;
    this.text = text;
  }
}

/**
 * Output of the LayoutGenerator: A node combined with its calculated physical coordinates.
 */
export interface LayoutNode extends SmartArtNode {
  x: number;
  y: number;
  width: number;
  height: number;
}
