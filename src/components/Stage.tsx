import { useMemo } from 'react';
import { motion } from 'motion/react';
import { useSceneSvg, REQUIRED_LAYER_IDS, extractLayerIds } from '../art/loader';
import { usePujoStore } from '../store/pujo';
import { useReducedMotion } from '../hooks/useReducedMotion';

const LAYER_Z_INDEX: Record<string, number> = {
  sky: 0,
  structure: 1,
  chalchitra: 2,
  protima: 3,
  lights: 4,
  'lamp-pradip': 5,
  fx: 6,
  smoke: 7,
  foreground: 8,
  tone: 9,
  grain: 10,
};

const BLEED_LAYERS = ['sky', 'foreground'] as const;

export function Stage() {
  const scene = usePujoStore((s) => s.getActiveScene());
  const svg = useSceneSvg(scene.id);
  const reducedMotion = useReducedMotion();

  const layers = useMemo(() => {
    if (!svg) return new Map<string, Element>();
    return extractLayerIds(svg, REQUIRED_LAYER_IDS);
  }, [svg]);

  if (!svg) {
    return (
      <div className="stage-camera" data-testid="stage" data-scene={scene.id}>
        <div className="stage-layer stage-layer--bleed" data-layer="sky" style={{ backgroundColor: '#14122b' }} />
        <div className="stage-layer stage-layer--safe" data-layer="structure" style={{ backgroundColor: '#2a1a12' }} />
        <div className="stage-layer stage-layer--safe" data-layer="protima" style={{ backgroundColor: '#2a1a12' }} />
        <div className="stage-layer stage-layer--safe" data-layer="lights" style={{ backgroundColor: 'transparent' }} />
        <div className="stage-layer stage-layer--bleed" data-layer="foreground" style={{ backgroundColor: '#2a1a12' }} />
      </div>
    );
  }

  const sortedLayers = Array.from(layers.entries()).sort(
    (a, b) => (LAYER_Z_INDEX[a[0]] ?? 99) - (LAYER_Z_INDEX[b[0]] ?? 99)
  );

  return (
    <div className="stage-camera" data-testid="stage" data-scene={scene.id} data-reduced-motion={reducedMotion}>
      <svg
        className="stage-svg"
        viewBox={svg.viewBox.baseVal.width > 0 ? `${svg.viewBox.baseVal.x} ${svg.viewBox.baseVal.y} ${svg.viewBox.baseVal.width} ${svg.viewBox.baseVal.height}` : '0 0 1200 1000'}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {sortedLayers.map(([layerId, element]) => {
          const bleeds = BLEED_LAYERS.includes(layerId as 'sky' | 'foreground');
          const zIndex = LAYER_Z_INDEX[layerId] ?? 0;
          const Component = reducedMotion ? 'g' : motion.g;
          const props = reducedMotion
            ? { key: layerId }
            : { key: layerId, style: { zIndex } as any };

          return (
            <Component
              {...props}
              id={layerId}
              data-layer={layerId}
              className={`stage-svg-layer ${bleeds ? 'stage-svg-layer--bleed' : 'stage-svg-layer--safe'}`}
              dangerouslySetInnerHTML={{ __html: element.innerHTML }}
            />
          );
        })}
      </svg>
    </div>
  );
}