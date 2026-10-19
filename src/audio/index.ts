import type { TrackAdapter } from './engine';
import type { TrackSource } from '../editions/2026';
import { OwnedAdapter } from './owned';
import { YoutubeAdapter } from './youtube';
import { SpotifyAdapter } from './spotify';

const adapters: Record<TrackSource['kind'], () => TrackAdapter> = {
  owned: () => new OwnedAdapter(),
  youtube: () => new YoutubeAdapter(),
  spotify: () => new SpotifyAdapter(),
};

export function createTrackAdapter(kind: TrackSource['kind']): TrackAdapter {
  return adapters[kind]();
}

export { AmbientAudioEngine } from './ambient';
export type { AmbientAudioContextState } from './ambient';
export type { TrackAdapter } from './engine';
