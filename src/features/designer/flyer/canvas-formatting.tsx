import ColorPicker from "@/components/color-picker";
import TypefacePicker from "./typeface-picker";
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
          <TypefacePicker item={item} onChange={onChange} />
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
