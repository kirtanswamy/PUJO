import { useEffect, useState } from 'react';
import { usePujoStore } from '../store/pujo';

function formatLocalTime(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })
    .format(date)
    .toLowerCase();
}

export function Caption() {
  const scene = usePujoStore((s) => s.getActiveScene());
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      className="mx-auto mt-2 flex w-full items-center justify-between gap-4 font-body text-xs text-paper/80"
      style={{ maxWidth: 400 }}
      data-testid="caption"
    >
      <span>{scene.caption.text}</span>
      <span className="shrink-0 tabular-nums" data-testid="pujo-clock">
        {scene.tithi.text} · {formatLocalTime(now)}
      </span>
    </div>
  );
}
