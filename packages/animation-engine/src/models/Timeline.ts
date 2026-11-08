import { AnimationTrack } from './AnimationTrack';

export class Timeline {
  public id: string;
  private tracks: AnimationTrack[] = [];
  
  // State
  private _isPlaying: boolean = false;
  private _currentTime: number = 0;
  
  constructor(id: string) {
    this.id = id;
  }

  public addTrack(track: AnimationTrack): void {
    this.tracks.push(track);
  }

  public play(): void {
    this._isPlaying = true;
  }

  public pause(): void {
    this._isPlaying = false;
  }

  public stop(): void {
    this._isPlaying = false;
    this._currentTime = 0;
  }
  
  public get isPlaying(): boolean {
    return this._isPlaying;
  }
  
  public get currentTime(): number {
    return this._currentTime;
  }

  /**
   * Advances the timeline by delta time (in ms) and returns a snapshot
   * of all animated properties.
   */
  public tick(dt: number): Record<string, Record<string, number>> {
    if (!this._isPlaying) return {};
    
    this._currentTime += dt;
    
    // Build snapshot: snapshot[objectId][property] = interpolatedValue
    const snapshot: Record<string, Record<string, number>> = {};
    
    for (const track of this.tracks) {
      const value = track.evaluate(this._currentTime);
      if (value !== undefined) {
        if (!snapshot[track.objectId]) snapshot[track.objectId] = {};
        snapshot[track.objectId][track.property] = value;
      }
    }
    
    return snapshot;
  }
}
