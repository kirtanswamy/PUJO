import { Howl } from 'howler';
import type { AudioEngine } from './engine';
import type { TrackSource } from '../editions/2026';

export class OwnedAdapter implements AudioEngine {
  private howl: Howl | null = null;
  private playing = false;

  load(track: TrackSource): void {
    if (track.kind !== 'owned') return;
    this.stop();
    this.howl = new Howl({ src: [track.src], html5: true });
  }

  play(): void {
    this.howl?.play();
    this.playing = true;
  }

  pause(): void {
    this.howl?.pause();
    this.playing = false;
  }

  stop(): void {
    this.howl?.stop();
    this.howl?.unload();
    this.howl = null;
    this.playing = false;
  }

  setVolume(vol: number): void {
    this.howl?.volume(vol);
  }

  isPlaying(): boolean {
    return this.playing;
  }
}
