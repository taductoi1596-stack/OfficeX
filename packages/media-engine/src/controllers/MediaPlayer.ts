import { PlaybackState, MediaType } from '../models/MediaState';

/**
 * A controller that abstracts away the underlying HTMLVideoElement or WebAudio API.
 * It manages logic, timing, and state.
 */
export class MediaPlayer {
  public id: string;
  public type: MediaType;
  public state: PlaybackState = PlaybackState.Paused;
  
  public currentTime: number = 0;
  public duration: number = 0;
  public volume: number = 1.0;
  public isMuted: boolean = false;
  
  // URL to the media blob or stream
  public sourceUrl: string;

  constructor(id: string, type: MediaType, sourceUrl: string) {
    this.id = id;
    this.type = type;
    this.sourceUrl = sourceUrl;
  }

  public play(): void {
    if (this.state !== PlaybackState.Playing) {
      this.state = PlaybackState.Playing;
      // Actual implementation would interface with HTMLMediaElement.play()
    }
  }

  public pause(): void {
    if (this.state === PlaybackState.Playing) {
      this.state = PlaybackState.Paused;
      // Actual implementation would interface with HTMLMediaElement.pause()
    }
  }

  public seek(time: number): void {
    this.currentTime = Math.max(0, Math.min(time, this.duration));
    // Actual implementation would set HTMLMediaElement.currentTime
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(volume, 1.0));
  }
}
