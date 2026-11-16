import { useTranslator } from "@/lib/i18n/react";
import type { FlyerElement } from "@/lib/events/flyer";
export default function PhotoFocalFields({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  const i18n = useTranslator();

  if (item.photoFit !== "cover") return null;
  return (
    <fieldset className="photo-focal-fields">
      <legend>{i18n("Posición dentro del marco")}</legend>
      <p>
        {i18n("Mueve el encuadre para conservar lo importante de tu foto.")}
      </p>
      {(["X", "Y"] as const).map((axis) => {
        const key = axis === "X" ? "photoPositionX" : "photoPositionY";
        return (
          <label key={axis}>
            {axis === "X" ? i18n("Horizontal") : i18n("Vertical")}
            <output>{item[key] ?? 50}%</output>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={item[key] ?? 50}
              aria-label={`Encuadre ${axis === "X" ? "horizontal" : "vertical"}`}
              onChange={(e) => onChange({ [key]: Number(e.target.value) })}
            />
          </label>
        );
      })}
      <button
        type="button"
        onClick={() => onChange({ photoPositionX: 50, photoPositionY: 50 })}
      >
        {i18n("Centrar fotografía")}
      </button>
    </fieldset>
  );
}
