import type { AudioEngine } from './engine';
import type { TrackSource } from '../editions/2026';
import { OwnedAdapter } from './owned';
import { YoutubeAdapter } from './youtube';
import { SpotifyAdapter } from './spotify';

const adapters: Record<TrackSource['kind'], () => AudioEngine> = {
  owned: () => new OwnedAdapter(),
  youtube: () => new YoutubeAdapter(),
  spotify: () => new SpotifyAdapter(),
};

export function createAudioEngine(kind: TrackSource['kind']): AudioEngine {
  return adapters[kind]();
}

export type { AudioEngine } from './engine';
