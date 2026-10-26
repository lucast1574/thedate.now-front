import Icon from "@/components/icon";
import type { FlyerCanvas, FlyerElement } from "@/lib/events/flyer";
import { scaleElement } from "./canvas-geometry";
export default function ElementGeometryFields({
  item,
  canvas,
  onChange,
}: {
  item: FlyerElement;
  canvas?: FlyerCanvas;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  const bounds = canvas || {
    width: 720,
    height: 960,
    background: "#fff",
    elements: [],
  };
  const proportional = item.type !== "text" || item.locationStyle === "icon";
  return (
    <details className="element-geometry inspector-disclosure" key={item.id}>
      <summary>
        <Icon name="lucide:move" />
        <span>Posición y tamaño</span>
        <Icon name="chevron" />
      </summary>
      <div className="inspector-disclosure-body">
        {proportional && (
          <p className="inspector-proportions">
            <Icon name="lock" /> Proporciones vinculadas
          </p>
        )}
        <div className="inspector-grid">
          {(
            [
              ["width", "Ancho"],
              ["height", "Alto"],
              ["x", "Posición X"],
              ["y", "Posición Y"],
              ["rotation", "Giro °"],
            ] as const
          ).map(([field, label]) => (
            <label key={field}>
              {label}
              <input
                type="number"
                value={Math.round(item[field])}
                min={
                  field === "rotation"
                    ? -180
                    : field === "width" || field === "height"
                      ? 16
                      : 0
                }
                max={field === "rotation" ? 180 : undefined}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  onChange(
                    proportional && (field === "width" || field === "height")
                      ? scaleElement(item, value, field, bounds)
                      : { [field]: value },
                  );
                }}
              />
            </label>
          ))}
        </div>
        {canvas && (
          <div
            className="inspector-center-actions"
            role="group"
            aria-label="Centrar en el lienzo"
          >
            <button
              onClick={() => onChange({ x: (canvas.width - item.width) / 2 })}
            >
              <Icon name="lucide:align-center-horizontal" />
              Horizontal
            </button>
            <button
              onClick={() => onChange({ y: (canvas.height - item.height) / 2 })}
            >
              <Icon name="lucide:align-center-vertical" />
              Vertical
            </button>
          </div>
        )}
      </div>
    </details>
  );
}
