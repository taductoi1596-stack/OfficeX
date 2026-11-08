export interface InkPoint {
  x: number;
  y: number;
  pressure: number; // 0.0 to 1.0
}

export interface InkStroke {
  points: InkPoint[];
  color: string;
  width: number;
}

export class InkManager {
  private currentStroke: InkStroke | null = null;
  private strokes: InkStroke[] = [];
  
  private currentColor: string = '#000000';
  private currentWidth: number = 2.0;

  public setPenStyle(color: string, width: number): void {
    this.currentColor = color;
    this.currentWidth = width;
  }

  public beginStroke(x: number, y: number, pressure: number = 0.5): void {
    this.currentStroke = {
      color: this.currentColor,
      width: this.currentWidth,
      points: [{ x, y, pressure }]
    };
  }

  public continueStroke(x: number, y: number, pressure: number = 0.5): void {
    if (this.currentStroke) {
      this.currentStroke.points.push({ x, y, pressure });
    }
  }

  /**
   * Finalizes the stroke and saves it.
   * Returns the completed stroke so DrawingManager can wrap it in a DrawingObject.
   */
  public endStroke(): InkStroke | null {
    if (this.currentStroke) {
      const stroke = this.currentStroke;
      this.strokes.push(stroke);
      this.currentStroke = null;
      return stroke;
    }
    return null;
  }
}
