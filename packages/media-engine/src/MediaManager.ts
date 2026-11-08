import { MediaPlayer } from './controllers/MediaPlayer';
import { SubtitleEngine } from './controllers/SubtitleEngine';
import { PlaybackState } from './models/MediaState';

export class MediaManager {
  private players: Map<string, MediaPlayer> = new Map();
  private subtitleEngines: Map<string, SubtitleEngine> = new Map();

  public registerPlayer(player: MediaPlayer): void {
    this.players.set(player.id, player);
  }

  public getPlayer(id: string): MediaPlayer | undefined {
    return this.players.get(id);
  }

  public registerSubtitleEngine(mediaId: string, engine: SubtitleEngine): void {
    this.subtitleEngines.set(mediaId, engine);
  }

  public getSubtitleEngine(mediaId: string): SubtitleEngine | undefined {
    return this.subtitleEngines.get(mediaId);
  }

  /**
   * Pause all active media playing in the document.
   * Crucial for presentation transitions or pausing the entire slide show.
   */
  public pauseAll(): void {
    for (const player of this.players.values()) {
      if (player.state === PlaybackState.Playing) {
        player.pause();
      }
    }
  }
}
