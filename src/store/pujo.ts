import { create } from 'zustand';
import type { Scene } from '../editions/2026';
import { scenes } from '../editions/2026';

export type BusName = 'crowd' | 'dhaak' | 'bells' | 'music';
export type MixerLevels = Record<BusName, number>;

interface PersistedState {
  masterVolume: number;
  muted: boolean;
}

function loadPersisted(): Partial<PersistedState> {
  try {
    const raw = localStorage.getItem('pujo:audio');
    if (!raw) return {};
    return JSON.parse(raw) as Partial<PersistedState>;
  } catch {
    return {};
  }
}

function savePersisted(s: PersistedState): void {
  try {
    localStorage.setItem('pujo:audio', JSON.stringify(s));
  } catch {
    // storage full or unavailable — silently ignore
  }
}

export interface PujoState {
  // gate
  entered: boolean;
  enter: () => void;

  // scene
  scenes: Scene[];
  sceneId: string;
  setScene: (id: string) => void;
  getActiveScene: () => Scene;

  // audio
  masterVolume: number;
  muted: boolean;
  mixerLevels: MixerLevels;
  activeRites: string[];

  setMasterVolume: (v: number) => void;
  toggleMute: () => void;
  setMixerLevel: (bus: BusName, v: number) => void;
}

const persisted = loadPersisted();

export const usePujoStore = create<PujoState>((set, get) => ({
  entered: false,
  enter: () => set({ entered: true }),

  scenes,
  sceneId: scenes[0].id,
  setScene: (id) => set({ sceneId: id }),
  getActiveScene: () => {
    const { scenes: s, sceneId } = get();
    return s.find((sc) => sc.id === sceneId) ?? s[0];
  },

  masterVolume: persisted.masterVolume ?? 0.8,
  muted: persisted.muted ?? false,
  mixerLevels: { crowd: 0.6, dhaak: 0.8, bells: 0.5, music: 0.7 },
  activeRites: [],

  setMasterVolume: (v) => {
    set({ masterVolume: v });
    savePersisted({ masterVolume: v, muted: get().muted });
  },
  toggleMute: () => {
    const next = !get().muted;
    set({ muted: next });
    savePersisted({ masterVolume: get().masterVolume, muted: next });
  },
  setMixerLevel: (bus, v) =>
    set((s) => ({ mixerLevels: { ...s.mixerLevels, [bus]: v } })),
}));

