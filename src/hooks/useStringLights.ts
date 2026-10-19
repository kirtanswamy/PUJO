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

export function useStringLights(sceneId: string, _containerWidth: number, _containerHeight: number): Bulb[] {
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

  // Structure top arc: spans from x=150 to x=1050 at y=300, peaks at x=600, y=180
  // Sagging arc formula: y = 300 - 120 * sin(pi * (x - 150) / 900)
  useEffect(() => {
    const newBulbs: Bulb[] = [];
    const count = Math.min(maxBulbs, 8 + Math.floor(Math.random() * (maxBulbs - 8)));

    // Structure arc: x from 150 to 1050, y from 300 (ends) to 180 (center)
    const arcStartX = 150;
    const arcEndX = 1050;
    const arcWidth = arcEndX - arcStartX;
    const arcBaseY = 300;
    const arcPeakY = 180;
    const arcHeight = arcBaseY - arcPeakY;

    for (let i = 0; i < count; i++) {
      // Distribute bulbs along the arc with slight randomness
      const t = (i + 0.5 + Math.random() * 0.5) / count;
      const x = arcStartX + t * arcWidth;
      // Sagging arc: y = baseY - height * sin(pi * t)
      const y = arcBaseY - arcHeight * Math.sin(Math.PI * t) + (Math.random() - 0.5) * 10;
      
      newBulbs.push({
        id: i,
        x,
        y,
        phase: Math.random() * Math.PI * 2,
        baseOpacity: 0.4 + Math.random() * 0.4,
      });
    }

    setBulbs(newBulbs);
  }, [sceneId, maxBulbs]);

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