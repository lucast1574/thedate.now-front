import ColorPicker from "@/components/color-picker";
import Listbox from "@/components/listbox";
import type { FlyerElement } from "@/lib/events/flyer";
import Icon from "@/components/icon";
export default function CanvasFormatting({
  item,
  onChange,
  onEdit,
  onReplace,
  onDuplicate,
  onRemove,
  canDuplicate = true,
}: {
  item?: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
  onEdit?: () => void;
  onReplace?: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
  canDuplicate?: boolean;
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
      {onEdit && (
        <button type="button" onClick={onEdit}>
          <Icon name="lucide:pencil" /> Editar texto
        </button>
      )}
      {onReplace && (
        <button type="button" onClick={onReplace}>
          <Icon name="image" /> Reemplazar foto
        </button>
      )}
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
            <Icon name="lucide:bold" />
          </button>
          {(["left", "center", "right"] as const).map((align) => (
            <button
              key={align}
              type="button"
              aria-label={`Alinear ${align === "left" ? "a la izquierda" : align === "right" ? "a la derecha" : "al centro"}`}
              aria-pressed={item.align === align}
              onClick={() => onChange({ align })}
            >
              <Icon
                name={
                  align === "left"
                    ? "lucide:text-align-start"
                    : align === "right"
                      ? "lucide:text-align-end"
                      : "lucide:text-align-center"
                }
              />
            </button>
          ))}
        </>
      )}
      {onDuplicate && (
        <button
          type="button"
          aria-label="Duplicar elemento"
          disabled={!canDuplicate}
          onClick={onDuplicate}
        >
          <Icon name="lucide:copy" />
        </button>
      )}
      {onRemove && (
        <button type="button" aria-label="Eliminar elemento" onClick={onRemove}>
          <Icon name="lucide:trash" />
        </button>
      )}
    </div>
  );
}
