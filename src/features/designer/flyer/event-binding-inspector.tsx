import type { FlyerElement } from "@/lib/events/flyer";
import EditorToggle from "./editor-toggle";
export default function EventBindingInspector({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  if (
    ![
      "couple_names",
      "event_title",
      "event_date",
      "location",
      "map",
      "dress_code",
      "restrictions",
      "adults_notice",
    ].includes(item.binding || "")
  )
    return null;
  return (
    <EditorToggle
      checked={!!item.eventBound}
      onChange={(eventBound) => onChange({ eventBound })}
      title="Usar los datos del evento"
      hint="Se actualiza al editar los datos. Desactívalo para usar contenido propio."
    />
  );
}
