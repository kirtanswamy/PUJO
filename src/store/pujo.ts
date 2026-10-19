import { create } from 'zustand';
import type { Scene } from '../editions/2026';
import { scenes } from '../editions/2026';

interface PujoState {
  scenes: Scene[];
  activeSceneId: string;
  setActiveScene: (id: string) => void;
  getActiveScene: () => Scene;
}

export const usePujoStore = create<PujoState>((set, get) => ({
  scenes,
  activeSceneId: scenes[0].id,
  setActiveScene: (id) => set({ activeSceneId: id }),
  getActiveScene: () => {
    const { scenes: s, activeSceneId } = get();
    return s.find((sc) => sc.id === activeSceneId) ?? s[0];
  },
}));
