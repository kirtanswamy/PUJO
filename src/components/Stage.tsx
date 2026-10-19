import type { LayerDef } from '../editions/2026';
import { LAYER_NAMES } from '../editions/2026';
import { usePujoStore } from '../store/pujo';

function layerStyle(layer: LayerDef, index: number): React.CSSProperties {
  return {
    backgroundColor: layer.color,
    opacity: layer.opacity ?? 1,
    zIndex: index,
  };
}

export function Stage() {
  const scene = usePujoStore((s) => s.getActiveScene());
  const layerMap = new Map(scene.layers.map((layer) => [layer.name, layer]));

  return (
    <div className="stage-camera" data-testid="stage">
      {LAYER_NAMES.map((name, index) => {
        const layer = layerMap.get(name);
        if (!layer) return null;
        const bleedsToViewport = name === 'sky' || name === 'foreground';

        return (
          <div
            key={name}
            className={`stage-layer ${bleedsToViewport ? 'stage-layer--bleed' : 'stage-layer--safe'}`}
            data-layer={name}
            style={layerStyle(layer, index)}
          />
        );
      })}
    </div>
  );
}
