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

  // Catenary swags between anchor points on structure top
  // Structure top spans from x=150 to x=1050 at y=300
  // 4 swags: anchors at x=150, 375, 600, 825, 1050
  // Catenary: y = y0 + a * cosh((x - x0) / a) - a, where a controls sag
  // For gentle sag: a = 40, dip at midpoint is about 40px
  const anchors = [150, 375, 600, 825, 1050];
  const anchorY = 300;
  const catenaryA = 40;

  useEffect(() => {
    const newBulbs: Bulb[] = [];
    const count = Math.min(maxBulbs, 8 + Math.floor(Math.random() * (maxBulbs - 8)));

    // Distribute bulbs across all swags
    const bulbsPerSwag = Math.ceil(count / (anchors.length - 1));
    let bulbId = 0;

    for (let swag = 0; swag < anchors.length - 1; swag++) {
      const x1 = anchors[swag];
      const x2 = anchors[swag + 1];
      const xMid = (x1 + x2) / 2;
      const swagWidth = x2 - x1;

      for (let i = 0; i < bulbsPerSwag && bulbId < count; i++) {
        const t = (i + 0.5 + Math.random() * 0.3) / bulbsPerSwag;
        const x = x1 + t * swagWidth;
        
        // Catenary curve: y = anchorY + a * cosh((x - xMid) / a) - a
        const dx = x - xMid;
        const y = anchorY + catenaryA * Math.cosh(dx / catenaryA) - catenaryA + (Math.random() - 0.5) * 5;
        
        newBulbs.push({
          id: bulbId++,
          x,
          y,
          phase: Math.random() * Math.PI * 2,
          baseOpacity: 0.4 + Math.random() * 0.4,
        });
      }
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