import { ambientAudio } from './audio/runtime';
import { Caption } from './components/Caption';
import { EntryGate } from './components/EntryGate';
import { Mixer } from './components/Mixer';
import { Stage } from './components/Stage';
import { usePujoStore } from './store/pujo';

export default function App() {
  const entered = usePujoStore((s) => s.entered);

  return (
    <main
      className="relative min-h-svh overflow-hidden"
      data-entered={entered}
      data-audio-context={entered ? ambientAudio.getContextState() : 'unavailable'}
    >
      <Stage />
      <Caption />
      {entered && <Mixer />}
      {!entered && <EntryGate />}
    </main>
  );
}
