import { useEffect, useState } from 'react';

const svgCache = new Map<string, SVGSVGElement>();

export function useSceneSvg(sceneId: string): SVGSVGElement | null {
  const [svg, setSvg] = useState<SVGSVGElement | null>(null);

  useEffect(() => {
    if (svgCache.has(sceneId)) {
      setSvg(svgCache.get(sceneId)!);
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/src/art/${sceneId}.svg`);
        if (!res.ok) throw new Error(`Failed to load ${sceneId}.svg`);
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'image/svg+xml');
        const svgEl = doc.documentElement as unknown as SVGSVGElement;
        if (svgEl.tagName !== 'svg') throw new Error('Not an SVG');
        svgEl.removeAttribute('xmlns');
        if (!cancelled) {
          svgCache.set(sceneId, svgEl);
          setSvg(svgEl);
        }
      } catch (e) {
        console.error(`Failed to load scene SVG: ${sceneId}`, e);
        if (!cancelled) setSvg(null);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [sceneId]);

  return svg;
}

export function extractLayerIds(
  svg: SVGSVGElement,
  requiredIds: readonly string[]
): Map<string, SVGGElement | SVGEllipseElement | SVGRectElement | SVGPathElement> {
  const found = new Map<string, SVGGElement | SVGEllipseElement | SVGRectElement | SVGPathElement>();
  for (const id of requiredIds) {
    const el = svg.getElementById(id) as SVGGElement | SVGEllipseElement | SVGRectElement | SVGPathElement | null;
    if (el) found.set(id, el);
  }
  return found;
}

export const REQUIRED_LAYER_IDS = [
  'sky',
  'structure',
  'chalchitra',
  'protima',
  'lights',
  'lamp-pradip',
  'foreground',
] as const;

export type RequiredLayerId = (typeof REQUIRED_LAYER_IDS)[number];