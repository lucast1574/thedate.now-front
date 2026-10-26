import Icon from "@/components/icon";
import Listbox from "@/components/listbox";
import type { FlyerElement } from "@/lib/events/flyer";
export default function TextStyleFields({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  return (
    <>
      <label>
        Tipografía
        <Listbox
          value={item.font}
          onValueChange={(font) =>
            onChange({ font: font as FlyerElement["font"] })
          }
        >
          <option value="serif">Elegante · Serif</option>
          <option value="sans">Moderna · Sans</option>
          <option value="script">Manuscrita</option>
          <option value="mono">Monoespaciada</option>
        </Listbox>
      </label>
      <div className="inspector-type-size">
        <label>
          Tamaño
          <input
            type="number"
            min={8}
            max={160}
            value={item.fontSize}
            onChange={(e) =>
              onChange({
                fontSize: Math.max(8, Math.min(160, Number(e.target.value))),
              })
            }
          />
        </label>
        <button
          title="Negrita"
          aria-label="Negrita"
          aria-pressed={item.bold}
          onClick={() => onChange({ bold: !item.bold })}
        >
          <Icon name="lucide:bold" />
        </button>
      </div>
      <div
        className="inspector-alignment"
        role="group"
        aria-label="Alineación del texto"
      >
        {(
          [
            ["left", "Izquierda", "lucide:text-align-start"],
            ["center", "Centro", "lucide:text-align-center"],
            ["right", "Derecha", "lucide:text-align-end"],
          ] as const
        ).map(([align, label, icon]) => (
          <button
            key={align}
            title={label}
            aria-label={`Alinear ${label.toLowerCase()}`}
            aria-pressed={item.align === align}
            onClick={() => onChange({ align })}
          >
            <Icon name={icon} />
          </button>
        ))}
      </div>
    </>
  );
}
