import { usePujoStore } from '../store/pujo';

export function Caption() {
  const scene = usePujoStore((s) => s.getActiveScene());

  return (
    <div className="caption-safe-area font-body text-xs text-paper/80" data-testid="caption">
      <span>{scene.caption.text}</span>
      <span className="shrink-0 tabular-nums" data-testid="pujo-clock">
        {scene.tithi.text} · {scene.inWorldTime.text}
      </span>
    </div>
  );
}
