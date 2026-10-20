import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

export interface SmokeParticle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speedX: number;
  speedY: number;
  life: number;
  maxLife: number;
}

export function useIncenseSmoke(
  sceneId: string,
  containerWidth: number,
  containerHeight: number
): { particles: SmokeParticle[]; canvasRef: React.RefObject<HTMLCanvasElement | null> } {
  const reducedMotion = useReducedMotion();
  const [particles, setParticles] = useState<SmokeParticle[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const deviceClass = useMemo(() => {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width < 480) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }, []);

  const maxParticles = useMemo(() => {
    switch (deviceClass) {
      case 'mobile': return 12;
      case 'tablet': return 20;
      default: return 30;
    }
  }, [deviceClass]);

  // Protima base/feet area in SVG coordinates: torso center 580, ry=140 -> bottom at 720
  // Scale to container
  const svgHeight = 1000;
  const protimaFeetY = 720; // SVG y coordinate of protima base
  const spawnX = containerWidth * 0.5;
  const spawnY = (protimaFeetY / svgHeight) * containerHeight;

  useEffect(() => {
    const newParticles: SmokeParticle[] = [];
    for (let i = 0; i < maxParticles; i++) {
      newParticles.push(createParticle(spawnX, spawnY));
    }
    setParticles(newParticles);
  }, [sceneId, maxParticles, spawnX, spawnY]);

  useEffect(() => {
    if (reducedMotion) return;

    let startTime: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (document.hidden) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      setParticles((prev) => {
        const next = prev.map((p) => {
          const newLife = p.life - deltaTime;
          if (newLife <= 0) {
            return createParticle(spawnX, spawnY);
          }

          const lifeRatio = newLife / p.maxLife;
          return {
            ...p,
            x: p.x + p.speedX * deltaTime * 60,
            y: p.y + p.speedY * deltaTime * 60,
            opacity: p.opacity * lifeRatio * 0.6,
            radius: p.radius * (0.3 + lifeRatio * 0.7),
            life: newLife,
          };
        });

        while (next.length < maxParticles) {
          next.push(createParticle(spawnX, spawnY));
        }

        return next.slice(0, maxParticles);
      });

      if (canvasRef.current) {
        drawSmoke(canvasRef.current, particles);
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [reducedMotion, maxParticles, spawnX, spawnY]);

  return { particles, canvasRef };
}

function createParticle(spawnX: number, spawnY: number): SmokeParticle {
  // Rise upward with gentle drift
  const angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.4;
  const speed = 8 + Math.random() * 12; // Slower, more gentle
  const life = 6 + Math.random() * 8; // Longer life for softer rise

  return {
    x: spawnX + (Math.random() - 0.5) * 60, // Wider spread at base
    y: spawnY + (Math.random() - 0.5) * 20,
    radius: 12 + Math.random() * 20, // Larger, softer particles
    opacity: 0.08 + Math.random() * 0.12, // Low opacity, paper tint
    speedX: Math.cos(angle) * speed,
    speedY: Math.sin(angle) * speed,
    life,
    maxLife: life,
  };
}

function drawSmoke(canvas: HTMLCanvasElement, particles: SmokeParticle[]): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  for (const p of particles) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    // Paper tint (#f4e9d3) - warm pale color for incense smoke
    // RGB(244, 233, 211)
    ctx.fillStyle = `rgba(244, 233, 211, ${p.opacity})`;
    ctx.fill();
  }
}