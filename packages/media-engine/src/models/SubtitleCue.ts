/**
 * Represents a single block of subtitle text displayed over a specific time range.
 */
export interface SubtitleCue {
  id: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  text: string;
}
