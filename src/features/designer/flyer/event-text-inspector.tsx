import Listbox from "@/components/listbox";
import type { FlyerElement } from "@/lib/events/flyer";
export default function EventTextInspector({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  const token =
    item.binding === "couple_names"
      ? "{{novios}}"
      : item.binding === "event_date"
        ? "{{fecha_hora}}"
        : "{{evento}}";
  return (
    <div className="inspector-group">
      <label>
        {item.eventBound ? "Texto alrededor del dato" : "Texto personalizado"}
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
        <small>Conserva {token} para que se actualice automáticamente.</small>
      )}
      {item.binding === "couple_names" && (
        <label>
          Composición de los nombres
          <Listbox
            value={item.nameFormat || "names"}
            onValueChange={(nameFormat) =>
              onChange({ nameFormat: nameFormat as FlyerElement["nameFormat"] })
            }
          >
            <option value="names">Juntos</option>
            <option value="stacked">En líneas separadas</option>
            <option value="initials">Iniciales</option>
            <option value="uppercase">Mayúsculas</option>
          </Listbox>
        </label>
      )}
    </div>
  );
}
