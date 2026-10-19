import type { LayerDef } from '../editions/2026';
import { LAYER_NAMES } from '../editions/2026';
import { usePujoStore } from '../store/pujo';

const STAGE_W = 400;
const STAGE_H = 500;

function layerStyle(layer: LayerDef, index: number): React.CSSProperties {
  return {
    position: 'absolute',
    inset: 0,
    backgroundColor: layer.color,
    opacity: layer.opacity ?? 1,
    zIndex: index,
  };
}

export function Stage() {
  const scene = usePujoStore((s) => s.getActiveScene());
  const layerMap = new Map(scene.layers.map((l) => [l.name, l]));

  return (
    <div
      className="relative mx-auto"
      style={{ width: STAGE_W, height: STAGE_H, maxWidth: '100%', aspectRatio: '4/5' }}
      data-testid="stage"
    >
      {LAYER_NAMES.map((name, i) => {
        const layer = layerMap.get(name);
        if (!layer) return null;
        return (
          <div
            key={name}
            data-layer={name}
            style={layerStyle(layer, i)}
          />
        );
      })}
    </div>
  );
}
