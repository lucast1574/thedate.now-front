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
    <section className="element-geometry">
      <h4>
        Tamaño y posición{" "}
        {proportional && (
          <span title="Proporciones protegidas">
            <Icon name="lock" />
          </span>
        )}
      </h4>
      <div className="inspector-grid">
        {(
          [
            ["width", "Ancho"],
            ["height", "Alto"],
            ["x", "Horizontal"],
            ["y", "Vertical"],
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
        <div className="editor-button-row">
          <button
            onClick={() => onChange({ x: (canvas.width - item.width) / 2 })}
          >
            Centrar horizontal
          </button>
          <button
            onClick={() => onChange({ y: (canvas.height - item.height) / 2 })}
          >
            Centrar vertical
          </button>
        </div>
      )}
      {proportional && (
        <p className="editor-hint">
          Arrastra una esquina para cambiar el tamaño sin deformar.
        </p>
      )}
    </section>
  );
}
