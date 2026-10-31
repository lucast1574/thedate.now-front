import type { FlyerElement } from "@/lib/events/flyer";
const choices = [
  ["fabric", "Telas"],
  ["petal", "Pétalos"],
  ["bar", "Barras"],
  ["jewel", "Joyas"],
  ["wave", "Ondas"],
  ["ticket", "Tickets"],
] as const;
export default function DressPalettePicker({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  return (
    <div className="dress-palette-options">
      <header>
        <h4>Muestras de color</h4>
        <button
          type="button"
          aria-pressed={!item.dressPaletteStyle}
          onClick={() => onChange({ dressPaletteStyle: undefined })}
        >
          Según la invitación
        </button>
      </header>
      <div role="group" aria-label="Presentación de los colores a evitar">
        {choices.map(([value, label]) => (
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
