import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

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
        <span>{i18n("Posición y tamaño")}</span>
        <Icon name="chevron" />
      </summary>
      <div className="inspector-disclosure-body">
        {proportional && (
          <p className="inspector-proportions">
            <Icon name="lock" /> {i18n("Proporciones vinculadas")}
          </p>
        )}
        <div className="inspector-grid">
          {(
            [
              ["width", i18n("Ancho")],
              ["height", i18n("Alto")],
              ["x", i18n("Posición X")],
              ["y", i18n("Posición Y")],
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
            aria-label={i18n("Centrar en el lienzo")}
          >
            <button
              onClick={() => onChange({ x: (canvas.width - item.width) / 2 })}
            >
              <Icon name="lucide:align-center-horizontal" />
              {i18n("Horizontal")}
            </button>
            <button
              onClick={() => onChange({ y: (canvas.height - item.height) / 2 })}
            >
              <Icon name="lucide:align-center-vertical" />
              {i18n("Vertical")}
            </button>
          </div>
        )}
      </div>
    </details>
  );
}
