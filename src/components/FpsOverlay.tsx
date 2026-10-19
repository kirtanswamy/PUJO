import { useFps } from '../hooks/useDebug';

interface FpsOverlayProps {
  bulbCount: number;
  particleCount: number;
}

export function FpsOverlay({ bulbCount, particleCount }: FpsOverlayProps) {
  const fps = useFps();
  const frameTime = fps > 0 ? (1000 / fps).toFixed(2) : '0.00';

  return (
    <div
      className="debug-fps-overlay"
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        padding: '0.5rem 0.75rem',
        backgroundColor: 'rgba(20, 18, 43, 0.9)',
        color: '#e9a82f',
        fontFamily: 'monospace',
        fontSize: '0.75rem',
        borderRadius: '4px',
        border: '1px solid #c9973a',
        zIndex: 9999,
        pointerEvents: 'none',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <div>FPS: {fps}</div>
      <div>Frame: {frameTime}ms</div>
      <div>Bulbs: {bulbCount}</div>
      <div>Particles: {particleCount}</div>
    </div>
  );
}