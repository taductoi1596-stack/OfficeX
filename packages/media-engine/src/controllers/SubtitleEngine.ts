import { SubtitleCue } from '../models/SubtitleCue';

export class SubtitleEngine {
  private cues: SubtitleCue[] = [];

  /**
   * Load subtitles into the engine.
   * In a real system, this would parse a .vtt or .srt string.
   */
  public loadCues(cues: SubtitleCue[]): void {
    // Sort by start time just to be safe
    this.cues = [...cues].sort((a, b) => a.startTime - b.startTime);
  }

  /**
   * Retrieve the active subtitle cue for a given playback time.
   * Returns null if no subtitle is active at that time.
   */
  public getActiveCue(currentTime: number): SubtitleCue | null {
    // Binary search could be used for performance if there are thousands of cues.
    // For simplicity, a linear scan is used here.
    for (const cue of this.cues) {
      if (currentTime >= cue.startTime && currentTime <= cue.endTime) {
        return cue;
      }
      
      // Since it's sorted, if we passed the current time, we can stop early
      if (cue.startTime > currentTime) {
        break;
      }
    }
    return null;
  }
}
