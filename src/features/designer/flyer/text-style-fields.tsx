import { useTranslator } from "@/lib/i18n/react";
import Icon from "@/components/icon";
import TypefacePicker from "./typeface-picker";
import TextSpacingFields from "./text-spacing-fields";
import TextAlignment from "./text-alignment";
import type { FlyerElement } from "@/lib/events/flyer";
export default function TextStyleFields({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  const i18n = useTranslator();

  return (
    <>
      <label>
        {i18n("Tipografía")} <TypefacePicker item={item} onChange={onChange} />
      </label>
      <div className="inspector-type-size">
        <label>
          {i18n("Tamaño")}{" "}
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
          title={i18n("Negrita")}
          aria-label={i18n("Negrita")}
          aria-pressed={item.bold}
          onClick={() => onChange({ bold: !item.bold })}
        >
          <Icon name="lucide:bold" />
        </button>
      </div>
      <TextSpacingFields item={item} onChange={onChange} />
      <TextAlignment item={item} onChange={onChange} />
    </>
  );
}
