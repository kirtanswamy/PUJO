import { useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { useSceneSvg, REQUIRED_LAYER_IDS, extractLayerIds } from '../art/loader';
import { usePujoStore } from '../store/pujo';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useEyesAnimation, type EyeState } from '../hooks/useEyesAnimation';

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

function getEyeStateOpacity(state: EyeState, baseOpacity: number): number {
  switch (state) {
    case 'closed':
      return 0;
    case 'opening':
      return baseOpacity * 0.5;
    case 'closing':
      return baseOpacity * 0.5;
    case 'open':
    default:
      return baseOpacity;
  }
}

export function Stage() {
  const scene = usePujoStore((s) => s.getActiveScene());
  const svg = useSceneSvg(scene.id);
  const reducedMotion = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const { eyeState } = useEyesAnimation();

  const layers = useMemo(() => {
    if (!svg) return new Map<string, Element>();
    return extractLayerIds(svg, REQUIRED_LAYER_IDS);
  }, [svg]);

  useEffect(() => {
    if (reducedMotion || !svgRef.current) return;

    const eyes = svgRef.current.querySelectorAll('#eye-l, #eye-r');
    if (eyes.length === 0) return;

    const animations: number[] = [];

    eyes.forEach((eye, index) => {
      const pupil = eye.querySelector('ellipse[fill="#14122b"], ellipse[fill="rgb(20, 18, 43)"]');
      if (!pupil) return;

      const delay = index * 3500;
      const duration = 7000;
      let startTime: number;

      function animate(timestamp: number) {
        if (!startTime) startTime = timestamp;
        const elapsed = (timestamp - startTime + delay) % duration;
        const progress = elapsed / duration;
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        const baseOpacity = 0.3 + 0.5 * eased;
        const opacity = getEyeStateOpacity(eyeState, baseOpacity);
        const drift = Math.sin(progress * Math.PI * 2) * 0.5;

        (pupil as SVGEllipseElement).style.opacity = opacity.toString();
        (pupil as SVGEllipseElement).style.transform = `translateX(${drift}px)`;
        (pupil as SVGEllipseElement).style.transformOrigin = 'center center';

        animations.push(requestAnimationFrame(animate));
      }

      animations.push(requestAnimationFrame(animate));
    });

    return () => {
      animations.forEach((id) => cancelAnimationFrame(id));
    };
  }, [reducedMotion, scene.id, eyeState]);

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
        ref={svgRef}
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