import { Caption } from './components/Caption';
import { EntryGate } from './components/EntryGate';
import { Mixer } from './components/Mixer';
import { Stage } from './components/Stage';
import { usePujoStore } from './store/pujo';

export default function App() {
  const entered = usePujoStore((s) => s.entered);

  return (
    <main className="flex min-h-full flex-col items-center justify-center p-4">
      <Stage />
      <Caption />
      {entered && <Mixer />}
      {!entered && <EntryGate />}
    </main>
  );
}
