import { useEffect, useRef, useState } from 'react';

export function useDebugFlags(): { showFps: boolean } {
  const [showFps, setShowFps] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fps = params.get('debug') === 'fps' || params.get('debug') === 'all';
    setShowFps(fps);
  }, []);

  return { showFps };
}

export function useFps(): number {
  const [fps, setFps] = useState(60);
  const framesRef = useRef<number[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    function tick(now: number) {
      framesRef.current.push(now);
      while (framesRef.current.length > 0 && framesRef.current[0] < now - 1000) {
        framesRef.current.shift();
      }
      setFps(framesRef.current.length);
      animationRef.current = requestAnimationFrame(tick);
    }

    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return fps;
}