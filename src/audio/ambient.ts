import type { BusName, MixerLevels } from '../store/pujo';

export type AmbientAudioContextState = globalThis.AudioContextState | 'unavailable';

const BUS_NAMES: BusName[] = ['crowd', 'dhaak', 'bells', 'music'];
const SILENT_GAIN = 0.0001;

export class AmbientAudioEngine {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private buses = new Map<BusName, GainNode>();
  private muted = false;
  private masterVolume = 0.8;
  private debugNodes: OscillatorNode[] = [];

  async resume(): Promise<void> {
    const context = this.ensureGraph();
    if (context?.state === 'suspended') await context.resume();
  }

  getContextState(): AmbientAudioContextState {
    return this.context?.state ?? 'unavailable';
  }

  setMasterVolume(volume: number): void {
    this.masterVolume = volume;
    this.applyMasterGain();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    this.applyMasterGain();
  }

  setBusLevel(bus: BusName, level: number): void {
    this.ensureGraph();
    const gain = this.buses.get(bus);
    if (gain) gain.gain.setTargetAtTime(level, this.currentTime(), 0.02);
  }

  setMixerLevels(levels: MixerLevels): void {
    BUS_NAMES.forEach((bus) => this.setBusLevel(bus, levels[bus]));
  }

  crossfade(from: BusName, to: BusName, duration = 1): void {
    const graph = this.ensureGraph();
    if (!graph) return;

    const now = graph.currentTime;
    const fromGain = this.buses.get(from);
    const toGain = this.buses.get(to);
    if (!fromGain || !toGain) return;

    fromGain.gain.cancelScheduledValues(now);
    toGain.gain.cancelScheduledValues(now);
    fromGain.gain.linearRampToValueAtTime(SILENT_GAIN, now + duration);
    toGain.gain.setValueAtTime(SILENT_GAIN, now);
    toGain.gain.linearRampToValueAtTime(1, now + duration);
  }

  setDistance(_sourceId: string, _metres: number): void {
    // Phase 6: route source nodes through PannerNodes.
  }

  startDebugSounds(): void {
    if (!import.meta.env.DEV || this.debugNodes.length > 0) return;
    const graph = this.ensureGraph();
    if (!graph) return;

    const tones: Array<[BusName, number]> = [
      ['crowd', 92],
      ['dhaak', 73],
      ['bells', 523],
      ['music', 220],
    ];

    tones.forEach(([bus, frequency]) => {
      const oscillator = graph.createOscillator();
      const gain = graph.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.value = 0.008;
      oscillator.connect(gain).connect(this.buses.get(bus)!);
      oscillator.start();
      this.debugNodes.push(oscillator);
    });
  }

  private ensureGraph(): AudioContext | null {
    if (this.context) return this.context;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;

    const context = new AudioContextClass();
    const master = context.createGain();
    master.connect(context.destination);

    BUS_NAMES.forEach((bus) => {
      const gain = context.createGain();
      gain.gain.value = 1;
      gain.connect(master);
      this.buses.set(bus, gain);
    });

    this.context = context;
    this.master = master;
    this.applyMasterGain();
    return context;
  }

  private applyMasterGain(): void {
    if (!this.master || !this.context) return;
    this.master.gain.setTargetAtTime(
      this.muted ? SILENT_GAIN : this.masterVolume,
      this.context.currentTime,
      0.02,
    );
  }

  private currentTime(): number {
    return this.context?.currentTime ?? 0;
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
