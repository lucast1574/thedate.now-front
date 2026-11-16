import { useTranslator } from "@/lib/i18n/react";
import { type Translator, localized } from "@/lib/i18n/translator";
import type { FlyerElement } from "@/lib/events/flyer";
const choices = localized(
  (i18n: Translator) =>
    [
      ["fabric", i18n("Telas")],
      ["petal", i18n("Pétalos")],
      ["bar", i18n("Barras")],
      ["jewel", i18n("Joyas")],
      ["wave", i18n("Ondas")],
      ["ticket", i18n("Tickets")],
      ["circle", i18n("Círculos")],
      ["square", i18n("Cuadrados")],
      ["arch", i18n("Arcos")],
      ["diamond", i18n("Rombos")],
      ["hexagon", i18n("Hexágonos")],
      ["leaf", i18n("Hojas")],
      ["splash", i18n("Salpicadura")],
    ] as const,
);
export default function DressPalettePicker({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  const i18n = useTranslator();

  return (
    <div className="dress-palette-options">
      <header>
        <h4>{i18n("Muestras de color")}</h4>
        <button
          type="button"
          aria-pressed={!item.dressPaletteStyle}
          onClick={() => onChange({ dressPaletteStyle: undefined })}
        >
          {i18n("Según la invitación")}
        </button>
      </header>
      <div
        role="group"
        aria-label={i18n("Presentación de los colores a evitar")}
      >
        {choices(i18n).map(([value, label]) => (
          <button
            type="button"
            key={value}
            aria-pressed={item.dressPaletteStyle === value}
            onClick={() => onChange({ dressPaletteStyle: value })}
          >
            <span
              className="dress-excluded-colors dress-palette-sample"
              data-palette={value}
              aria-hidden="true"
            >
              <i className="dress-excluded-swatch" />
            </span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
