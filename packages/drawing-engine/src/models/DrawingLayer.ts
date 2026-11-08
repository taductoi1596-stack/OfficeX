import { DrawingObject } from './DrawingObject';

export class DrawingLayer {
  public id: string;
  public name: string;
  public isVisible: boolean = true;
  public isLocked: boolean = false;
  
  // Z-Order is determined by the array index (0 = bottom, length-1 = top)
  private objects: DrawingObject[] = [];

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  public addObject(obj: DrawingObject): void {
    if (this.isLocked) return;
    this.objects.push(obj);
  }

  public removeObject(id: string): void {
    if (this.isLocked) return;
    this.objects = this.objects.filter(o => o.id !== id);
  }

  public getObjects(): DrawingObject[] {
    return this.objects;
  }

  public bringToFront(id: string): void {
    if (this.isLocked) return;
    const index = this.objects.findIndex(o => o.id === id);
    if (index > -1 && index < this.objects.length - 1) {
      const [obj] = this.objects.splice(index, 1);
      this.objects.push(obj); // push to end (top)
    }
  }

  public sendToBack(id: string): void {
    if (this.isLocked) return;
    const index = this.objects.findIndex(o => o.id === id);
    if (index > 0) {
      const [obj] = this.objects.splice(index, 1);
      this.objects.unshift(obj); // push to start (bottom)
    }
  }
}
