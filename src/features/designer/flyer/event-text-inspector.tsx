import { useTranslator } from "@/lib/i18n/react";
import Listbox from "@/components/listbox";
import type { FlyerElement } from "@/lib/events/flyer";
export default function EventTextInspector({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  const i18n = useTranslator();

  const token =
    item.binding === "couple_names"
      ? "{{novios}}"
      : item.binding === "event_date"
        ? "{{fecha_hora}}"
        : "{{evento}}";
  return (
    <div className="inspector-group">
      <label>
        {item.eventBound
          ? i18n("Texto alrededor del dato")
          : i18n("Texto personalizado")}
        <textarea
          rows={3}
          maxLength={2000}
          value={
            item.eventBound && !item.text?.includes(token)
              ? token
              : item.text || ""
          }
          onChange={(e) => onChange({ text: e.target.value })}
        />
      </label>
      {item.eventBound && (
        <small>
          {i18n("Conserva")} {token}{" "}
          {i18n("para que se actualice automáticamente.")}
        </small>
      )}
      {item.binding === "couple_names" && (
        <label>
          {i18n("Composición de los nombres")}{" "}
          <Listbox
            value={item.nameFormat || "names"}
            onValueChange={(nameFormat) =>
              onChange({ nameFormat: nameFormat as FlyerElement["nameFormat"] })
            }
          >
            <option value="names">{i18n("Juntos")}</option>
            <option value="stacked">{i18n("En líneas separadas")}</option>
            <option value="initials">{i18n("Iniciales")}</option>
            <option value="uppercase">{i18n("Mayúsculas")}</option>
          </Listbox>
        </label>
      )}
    </div>
  );
}
