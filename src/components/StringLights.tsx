import { type Bulb } from '../hooks/useStringLights';

interface StringLightsProps {
  bulbs: Bulb[];
  svgWidth: number;
  svgHeight: number;
  containerWidth: number;
  containerHeight: number;
}

export function StringLights({ bulbs, svgWidth, svgHeight, containerWidth, containerHeight }: StringLightsProps) {
  const scaleX = containerWidth / svgWidth;
  const scaleY = containerHeight / svgHeight;

  if (bulbs.length === 0) return null;

  return (
    <div
      className="string-lights-overlay"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {bulbs.map((bulb) => (
        <div
          key={bulb.id}
          className="string-bulb"
          style={{
            position: 'absolute',
            left: `${bulb.x * scaleX}px`,
            top: `${bulb.y * scaleY}px`,
            width: `${3 * scaleX}px`,
            height: `${3 * scaleY}px`,
            borderRadius: '50%',
            backgroundColor: '#e9a82f',
            opacity: bulb.opacity ?? bulb.baseOpacity,
            boxShadow: `0 0 ${6 * Math.max(scaleX, scaleY)}px 2px #e9a82f`,
            transform: 'translate(-50%, -50%)',
            willChange: 'opacity',
          }}
        />
      ))}
    </div>
  );
}