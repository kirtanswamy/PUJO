import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { GATE } from '../copy';
import { ambientAudio } from '../audio/runtime';
import { usePujoStore } from '../store/pujo';

export function EntryGate() {
  const enter = usePujoStore((s) => s.enter);
  const reducedMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    buttonRef.current?.focus();
  }, []);

  const handleEnter = async () => {
    if (leaving) return;
    await ambientAudio.resume();
    if (import.meta.env.DEV && new URLSearchParams(window.location.search).get('debug') === 'audio') {
      ambientAudio.startDebugSounds();
    }
    if (reducedMotion) {
      enter();
      return;
    }
    setLeaving(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-indigo p-6"
      data-testid="entry-gate"
      initial={{ opacity: 1 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.3 }}
      onAnimationComplete={() => {
        if (leaving) enter();
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className="border border-paper bg-paper px-5 py-3 font-body text-sm text-ink shadow-[3px_3px_0_#c9973a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-haldi"
        onClick={handleEnter}
      >
        {GATE.enter.text}
      </button>
    </motion.div>
  );
}
