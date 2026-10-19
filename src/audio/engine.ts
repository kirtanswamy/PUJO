import type { TrackSource } from '../editions/2026';

export interface TrackAdapter {
  load(track: TrackSource): void;
  play(): void;
  pause(): void;
  stop(): void;
  setVolume(vol: number): void;
  isPlaying(): boolean;
}
