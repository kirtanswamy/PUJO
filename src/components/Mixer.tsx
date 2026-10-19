import { useState } from 'react';
import { MIXER } from '../copy';
import { ambientAudio } from '../audio/runtime';
import { type BusName, usePujoStore } from '../store/pujo';

const BUSES: BusName[] = ['crowd', 'dhaak', 'bells', 'music'];

export function Mixer() {
  const [open, setOpen] = useState(false);
  const muted = usePujoStore((s) => s.muted);
  const mixerLevels = usePujoStore((s) => s.mixerLevels);
  const toggleMute = usePujoStore((s) => s.toggleMute);
  const setMixerLevel = usePujoStore((s) => s.setMixerLevel);

  const handleMute = () => {
    toggleMute();
    ambientAudio.setMuted(!muted);
  };

  const handleLevel = (bus: BusName, value: number) => {
    setMixerLevel(bus, value);
    ambientAudio.setBusLevel(bus, value);
  };

  return (
    <aside className="fixed right-4 top-4 z-40 flex flex-col items-end gap-2" data-testid="mixer">
      <button
        type="button"
        className="border border-ink bg-paper px-3 py-2 font-body text-xs text-ink shadow-[2px_2px_0_#c9973a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-haldi"
        onClick={handleMute}
        data-testid="mute-button"
        aria-pressed={muted}
      >
        {muted ? MIXER.unmute.text : MIXER.mute.text}
      </button>
      <button
        type="button"
        className="border border-ink bg-paper px-3 py-2 font-body text-xs text-ink shadow-[2px_2px_0_#c9973a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-haldi"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mixer-controls"
      >
        {MIXER.open.text}
      </button>
      {open && (
        <div
          id="mixer-controls"
          className="w-44 border border-ink bg-paper p-3 text-ink shadow-[3px_3px_0_#c9973a]"
          data-testid="mixer-controls"
        >
          {BUSES.map((bus) => (
            <label key={bus} className="mb-3 block last:mb-0">
              <span className="mb-1 block font-body text-xs">{MIXER[bus].text}</span>
              <input
                className="block w-full accent-alta"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={mixerLevels[bus]}
                onChange={(event) => handleLevel(bus, Number(event.target.value))}
                data-testid={`mixer-${bus}`}
              />
            </label>
          ))}
        </div>
      )}
    </aside>
  );
}
