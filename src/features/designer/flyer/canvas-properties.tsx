import ElementInspector from "./element-inspector";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
export default function CanvasProperties({
  kind,
  canvas,
  selected,
  photos,
  patch,
  layer,
  add,
  remove,
}: {
  kind?: "wedding" | "general";
  canvas: FlyerCanvas;
  selected?: FlyerElement;
  photos: string[];
  patch: (patch: Partial<FlyerElement>) => void;
  layer: (direction: number) => void;
  add: (element: FlyerElement) => void;
  remove: () => void;
}) {
  if (!selected) return null;
  return (
    <ElementInspector
      item={selected}
      canvas={canvas}
      kind={kind}
      photos={photos}
      onChange={patch}
      onLayer={layer}
      onDuplicate={() =>
        add({
          ...selected,
          id: crypto.randomUUID(),
          x: Math.min(selected.x + 16, canvas.width - selected.width),
          y: Math.min(selected.y + 16, canvas.height - selected.height),
        })
      }
      onRemove={remove}
    />
  );
}
