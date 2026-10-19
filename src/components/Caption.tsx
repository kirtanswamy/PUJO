import { usePujoStore } from '../store/pujo';
import { usePujoClock } from '../hooks/usePujoClock';

export function Caption() {
  const scene = usePujoStore((s) => s.getActiveScene());
  const clock = usePujoClock(scene.pujoTime);

  return (
    <div
      className="mx-auto mt-2 flex items-center justify-between font-body text-sm text-indigo/70"
      style={{ maxWidth: 400 }}
      data-testid="caption"
    >
      <span>
        {scene.title}
        {scene.bengaliTitle && (
          <span className="ml-1 opacity-60">{scene.bengaliTitle}</span>
        )}
      </span>
      <span className="tabular-nums">{clock}</span>
    </div>
  );
}
