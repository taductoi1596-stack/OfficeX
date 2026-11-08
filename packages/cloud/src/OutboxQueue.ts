export class OutboxQueue {
  private queue: any[] = [];
  
  public enqueue(change: any) {
    this.queue.push(change);
  }

  public peekAll(): any[] {
    return [...this.queue];
  }

  public dequeue(count: number) {
    this.queue.splice(0, count);
  }

  public get length(): number {
    return this.queue.length;
  }
}
