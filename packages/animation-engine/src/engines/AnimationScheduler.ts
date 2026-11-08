import { Timeline } from '../models/Timeline';

export type FrameCallback = (snapshot: Record<string, Record<string, number>>) => void;

export class AnimationScheduler {
  private timelines: Map<string, Timeline> = new Map();
  private isRunning: boolean = false;
  private lastTime: number = 0;
  private rafId: number | null = null;
  private onFrameCallback: FrameCallback | null = null;

  /**
   * Register the callback that will push calculated properties to the Rendering Engine.
   */
  public setRenderCallback(callback: FrameCallback): void {
    this.onFrameCallback = callback;
  }

  public registerTimeline(timeline: Timeline): void {
    this.timelines.set(timeline.id, timeline);
  }

  public getTimeline(id: string): Timeline | undefined {
    return this.timelines.get(id);
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    this.loop(this.lastTime);
  }

  public stop(): void {
    this.isRunning = false;
    if (this.rafId !== null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private loop = (currentTime: number): void => {
    if (!this.isRunning) return;

    const dt = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Aggregate snapshot from all running timelines
    const globalSnapshot: Record<string, Record<string, number>> = {};
    let anyPlaying = false;

    for (const timeline of this.timelines.values()) {
      if (timeline.isPlaying) {
        anyPlaying = true;
        const snapshot = timeline.tick(dt);
        
        // Merge into global snapshot
        for (const [objId, props] of Object.entries(snapshot)) {
          if (!globalSnapshot[objId]) globalSnapshot[objId] = {};
          Object.assign(globalSnapshot[objId], props);
        }
      }
    }

    // Send to Rendering Engine
    if (anyPlaying && this.onFrameCallback && Object.keys(globalSnapshot).length > 0) {
      this.onFrameCallback(globalSnapshot);
    }

    // Continue loop
    if (typeof requestAnimationFrame !== 'undefined') {
      this.rafId = requestAnimationFrame(this.loop);
    } else {
      // Fallback for Node.js testing environment (run approx 60fps)
      setTimeout(() => this.loop(Date.now()), 16);
    }
  };
}
