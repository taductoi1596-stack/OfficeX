import { Keyframe } from './Keyframe';
import { Easing } from '../math/Easing';

export class AnimationTrack {
  public objectId: string;
  public property: string; // e.g. 'x', 'y', 'opacity', 'scale'
  private keyframes: Keyframe[] = [];

  constructor(objectId: string, property: string) {
    this.objectId = objectId;
    this.property = property;
  }

  public addKeyframe(kf: Keyframe): void {
    this.keyframes.push(kf);
    // Sort keyframes by time
    this.keyframes.sort((a, b) => a.timeMs - b.timeMs);
  }

  /**
   * Evaluates the interpolated value at a specific time.
   */
  public evaluate(timeMs: number): number | undefined {
    if (this.keyframes.length === 0) return undefined;
    
    // Before first keyframe
    if (timeMs <= this.keyframes[0].timeMs) {
      return this.keyframes[0].value;
    }
    
    // After last keyframe
    const lastKf = this.keyframes[this.keyframes.length - 1];
    if (timeMs >= lastKf.timeMs) {
      return lastKf.value;
    }
    
    // Find surrounding keyframes
    let startKf = this.keyframes[0];
    let endKf = this.keyframes[1];
    
    for (let i = 0; i < this.keyframes.length - 1; i++) {
      if (timeMs >= this.keyframes[i].timeMs && timeMs < this.keyframes[i + 1].timeMs) {
        startKf = this.keyframes[i];
        endKf = this.keyframes[i + 1];
        break;
      }
    }
    
    // Calculate normalized progress t (0.0 to 1.0)
    const duration = endKf.timeMs - startKf.timeMs;
    const elapsed = timeMs - startKf.timeMs;
    let t = elapsed / duration;
    
    // Apply easing
    const easeFn = startKf.easing || Easing.linear;
    t = easeFn(t);
    
    // Interpolate value
    return startKf.value + (endKf.value - startKf.value) * t;
  }
}
