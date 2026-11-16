import { useTranslator } from "@/lib/i18n/react";
import ColorPicker from "@/components/color-picker";
import TypefacePicker from "./typeface-picker";
import Icon from "@/components/icon";
import TextAlignment from "./text-alignment";
import TextSpacingFields from "./text-spacing-fields";
import type { FlyerElement } from "@/lib/events/flyer";
export default function CanvasFormatting({
  item,
  onChange,
}: {
  item?: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  const i18n = useTranslator();

  if (!item) return <span>{i18n("Tu invitación, sección a sección")}</span>;
  return (
    <div
      className="canvas-formatting"
      aria-label={i18n("Formato del elemento")}
    >
      <span>
        {item.binding === "location"
          ? i18n("Ubicación")
          : item.type === "image"
            ? i18n("Imagen seleccionada")
            : item.type === "icon"
              ? i18n("Símbolo")
              : i18n("Texto")}
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
            aria-label={i18n("Tamaño de fuente")}
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
            type="button"
            title={i18n("Negrita")}
            aria-label={i18n("Negrita")}
            aria-pressed={item.bold}
            onClick={() => onChange({ bold: !item.bold })}
          >
            <Icon name="lucide:bold" />
          </button>
          <button
            type="button"
            title={i18n("Cursiva")}
            aria-label={i18n("Cursiva")}
            aria-pressed={!!item.italic}
            onClick={() => onChange({ italic: !item.italic })}
          >
            <Icon name="lucide:italic" />
          </button>
          <TextAlignment item={item} onChange={onChange} />
          <TextSpacingFields compact item={item} onChange={onChange} />
        </>
      )}
    </div>
  );
}
