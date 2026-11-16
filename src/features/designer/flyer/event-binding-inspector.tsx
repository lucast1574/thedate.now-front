import { useTranslator } from "@/lib/i18n/react";
import type { FlyerElement } from "@/lib/events/flyer";
import EditorToggle from "./editor-toggle";
export default function EventBindingInspector({
  item,
  onChange,
}: {
  item: FlyerElement;
  onChange: (patch: Partial<FlyerElement>) => void;
}) {
  const i18n = useTranslator();

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
      title={i18n("Usar los datos del evento")}
      hint="Se actualiza al editar los datos. Desactívalo para usar contenido propio."
    />
  );
}
