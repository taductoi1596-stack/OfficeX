import { EasingFunction, Easing } from '../math/Easing';

export interface Keyframe {
  /**
   * The relative time of this keyframe in milliseconds.
   * e.g. 0 means start, 1000 means 1 second into the animation.
   */
  timeMs: number;
  
  /**
   * The numeric value of the property at this time.
   */
  value: number;
  
  /**
   * The easing function applied to the segment between this keyframe and the next.
   * Defaults to Linear.
   */
  easing?: EasingFunction;
}
