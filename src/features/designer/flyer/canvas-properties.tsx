import ColorPicker from "@/components/color-picker";
import ElementInspector from "./element-inspector";
import { clamp } from "./canvas-model";
import type { DesignSection } from "@/lib/events/types";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
export default function CanvasProperties({
  kind,
  active,
  index,
  canvas,
  selected,
  photos,
  update,
  change,
  patch,
  layer,
  add,
  remove,
}: {
  kind?: "wedding" | "general";
  active?: DesignSection;
  index: number;
  canvas: FlyerCanvas;
  selected?: FlyerElement;
  photos: string[];
  update: (patch: Partial<DesignSection>) => void;
  change: (canvas: FlyerCanvas) => void;
  patch: (patch: Partial<FlyerElement>) => void;
  layer: (direction: number) => void;
  add: (element: FlyerElement) => void;
  remove: () => void;
}) {
  return (
    <>
      {" "}
      {selected && (
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
      )}{" "}
      {active && (
        <section className="canvas-settings">
          <h3>Sección {index + 1}</h3>
          <label>
            Nombre
            <input
              value={active.heading}
              maxLength={120}
              onChange={(e) => update({ heading: e.target.value })}
            />
          </label>
          <div className="color-field">
            <span>Color de fondo</span>
            <ColorPicker
              value={canvas.background}
              onChange={(background) => change({ ...canvas, background })}
            />
          </div>
          <label>
            Altura del lienzo
            <input
              type="number"
              min={320}
              max={2000}
              step={40}
              value={canvas.height}
              onChange={(e) =>
                change({
                  ...canvas,
                  height: clamp(
                    Number(e.target.value),
                    Math.max(
                      320,
                      ...canvas.elements.map((el) => el.y + el.height),
                    ),
                    2000,
                  ),
                })
              }
            />
          </label>
        </section>
      )}
    </>
  );
}
