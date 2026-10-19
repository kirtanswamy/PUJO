import type { TrackSource } from '../editions/2026';

export interface AudioEngine {
  load(track: TrackSource): void;
  play(): void;
  pause(): void;
  stop(): void;
  setVolume(vol: number): void;
  isPlaying(): boolean;
}
