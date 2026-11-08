export interface IMeasurementEngine {
  measureText(text: string, fontFamily: string, fontSize: number, isBold?: boolean, isItalic?: boolean): { width: number; height: number };
}

export class MockMeasurementEngine implements IMeasurementEngine {
  /**
   * Mock measurement: 
   * - Height = fontSize * 1.2
   * - Width = text.length * fontSize * 0.6
   */
  public measureText(text: string, fontFamily: string, fontSize: number, isBold?: boolean, isItalic?: boolean): { width: number; height: number } {
    return {
      width: text.length * (fontSize * 0.6),
      height: fontSize * 1.2
    };
  }
}
