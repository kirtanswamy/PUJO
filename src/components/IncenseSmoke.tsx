import { useEffect, useRef } from 'react';
import { type SmokeParticle } from '../hooks/useIncenseSmoke';

interface IncenseSmokeProps {
  particles: SmokeParticle[];
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerWidth: number;
  containerHeight: number;
}

export function IncenseSmoke({ particles, canvasRef, containerWidth, containerHeight }: IncenseSmokeProps) {
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime: number;

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp;
      lastTimeRef.current = timestamp;

      if (document.hidden) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      if (canvasRef.current) {
        drawSmoke(canvasRef.current, particles);
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [particles, canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = containerWidth;
    canvas.height = containerHeight;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
  }, [containerWidth, containerHeight, canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      className="incense-smoke-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 6,
      }}
      aria-hidden="true"
    />
  );
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
    ctx.fillStyle = `rgba(233, 168, 47, ${p.opacity})`;
    ctx.fill();
  }
}