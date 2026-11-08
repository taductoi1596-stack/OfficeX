/**
 * Easing functions take a normalized time `t` (between 0.0 and 1.0) 
 * and return the interpolated progress.
 */
export type EasingFunction = (t: number) => number;

export const Easing = {
  linear: (t: number) => t,
  
  easeInQuad: (t: number) => t * t,
  
  easeOutQuad: (t: number) => t * (2 - t),
  
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  easeInCubic: (t: number) => t * t * t,
  
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
};
