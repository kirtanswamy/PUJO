import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface ParallaxOffset {
  x: number;
  y: number;
}

export function useParallax(): { offsets: Record<string, ParallaxOffset>; isActive: boolean } {
  const reducedMotion = useReducedMotion();
  const [offsets, setOffsets] = useState<Record<string, ParallaxOffset>>({
    far: { x: 0, y: 0 },
    mid: { x: 0, y: 0 },
    near: { x: 0, y: 0 },
  });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    setIsActive(true);

    if (isMobile && typeof DeviceOrientationEvent !== 'undefined') {
      const requestPermission = (DeviceOrientationEvent as any).requestPermission;
      if (typeof requestPermission === 'function') {
        requestPermission()
          .then((state: string) => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            }
          })
          .catch(() => {});
      } else {
        window.addEventListener('deviceorientation', handleOrientation);
      }
    } else {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [reducedMotion]);

  function handleMouseMove(e: MouseEvent) {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    setOffsets({
      far: { x: x * 8, y: y * 4 },
      mid: { x: x * 15, y: y * 8 },
      near: { x: x * 25, y: y * 12 },
    });
  }

  function handleOrientation(e: DeviceOrientationEvent) {
    if (e.gamma === null || e.beta === null) return;

    const gamma = Math.max(-30, Math.min(30, e.gamma));
    const beta = Math.max(-30, Math.min(30, e.beta));
    const x = gamma / 30;
    const y = beta / 30;

    setOffsets({
      far: { x: x * 6, y: y * 3 },
      mid: { x: x * 12, y: y * 6 },
      near: { x: x * 20, y: y * 10 },
    });
  }

  return { offsets, isActive };
}