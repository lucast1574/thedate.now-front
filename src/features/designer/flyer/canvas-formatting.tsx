import ColorPicker from "@/components/color-picker";
import Listbox from "@/components/listbox";
import type { FlyerElement } from "@/lib/events/flyer";
export default function CanvasFormatting({
  item,
  onChange,
}: {
  item?: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  if (!item) return <span>Tu invitación, sección a sección</span>;
  return (
    <div className="canvas-formatting" aria-label="Formato del elemento">
      <span>
        {item.binding === "location"
          ? "Ubicación"
          : item.type === "image"
            ? "Imagen seleccionada"
            : item.type === "icon"
              ? "Símbolo"
              : "Texto"}
      </span>
      {item.type !== "image" && (
        <ColorPicker
          value={item.color}
          onChange={(color) => onChange({ color })}
        />
      )}
      {item.type === "text" && item.locationStyle !== "icon" && (
        <>
          <Listbox
            aria-label="Fuente del texto"
            value={item.font}
            onValueChange={(font) =>
              onChange({ font: font as FlyerElement["font"] })
            }
          >
            <option value="serif">Serif</option>
            <option value="sans">Sans</option>
            <option value="script">Manuscrita</option>
            <option value="mono">Mono</option>
          </Listbox>
          <input
            aria-label="Tamaño de fuente"
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
          <button
            aria-label="Negrita"
            aria-pressed={item.bold}
            onClick={() => onChange({ bold: !item.bold })}
          >
            <b>B</b>
          </button>
        </>
      )}
    </div>
  );
}
