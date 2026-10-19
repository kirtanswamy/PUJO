import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface Bulb {
  id: number;
  x: number;
  y: number;
  phase: number;
  baseOpacity: number;
  opacity?: number;
}

export function useStringLights(sceneId: string, containerWidth: number, containerHeight: number): Bulb[] {
  const reducedMotion = useReducedMotion();
  const [bulbs, setBulbs] = useState<Bulb[]>([]);
  const animationRef = useRef<number | null>(null);

  const deviceClass = useMemo(() => {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width < 480) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }, []);

  const maxBulbs = useMemo(() => {
    switch (deviceClass) {
      case 'mobile': return 12;
      case 'tablet': return 20;
      default: return 30;
    }
  }, [deviceClass]);

  useEffect(() => {
    const newBulbs: Bulb[] = [];
    const count = Math.min(maxBulbs, 8 + Math.floor(Math.random() * (maxBulbs - 8)));

    for (let i = 0; i < count; i++) {
      const x = 100 + Math.random() * (containerWidth - 200);
      const y = 150 + Math.random() * (containerHeight * 0.6 - 150);
      newBulbs.push({
        id: i,
        x,
        y,
        phase: Math.random() * Math.PI * 2,
        baseOpacity: 0.4 + Math.random() * 0.4,
      });
    }

    setBulbs(newBulbs);
  }, [sceneId, containerWidth, containerHeight, maxBulbs]);

  useEffect(() => {
    if (reducedMotion || bulbs.length === 0) return;

    let startTime: number;
    const duration = 3000;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      setBulbs((prev) =>
        prev.map((bulb) => {
          const progress = (elapsed / duration + bulb.phase / (Math.PI * 2)) % 1;
          const flicker = Math.sin(progress * Math.PI * 2 * 3) * 0.15;
          const slowPulse = Math.sin(elapsed / 4000 + bulb.phase) * 0.1;
          const opacity = Math.max(0.1, Math.min(1, bulb.baseOpacity + flicker + slowPulse));
          return { ...bulb, opacity };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [reducedMotion, bulbs.length]);

  return bulbs;
}