import type { TrackAdapter } from './engine';
import type { TrackSource } from '../editions/2026';

// TODO: Implement Spotify Embed SDK integration
export class SpotifyAdapter implements TrackAdapter {
  load(_track: TrackSource): void {}
  play(): void {}
  pause(): void {}
  stop(): void {}
  setVolume(_vol: number): void {}
  isPlaying(): boolean {
    return false;
  }
}
