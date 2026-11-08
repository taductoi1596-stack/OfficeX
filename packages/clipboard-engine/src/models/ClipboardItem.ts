export class ClipboardItem {
  public id: string;
  public timestamp: number;
  
  // Stores the actual payload for each format (e.g. Map<"text/plain", "Hello">)
  private data: Map<string, any> = new Map();

  constructor() {
    this.id = Math.random().toString(36).substring(2, 9);
    this.timestamp = Date.now();
  }

  public setData(format: string, payload: any): void {
    this.data.set(format, payload);
  }

  public getData(format: string): any {
    return this.data.get(format);
  }

  public hasFormat(format: string): boolean {
    return this.data.has(format);
  }

  public getAvailableFormats(): string[] {
    return Array.from(this.data.keys());
  }
}
