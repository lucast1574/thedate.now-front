import type { Dispatch, SetStateAction } from "react";
import { defaultCelebration } from "@/lib/events/celebration";
import type { Event } from "@/lib/events/types";
import EventOptionChoice from "./event-option-choice";

export default function EventGiftsChoice({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  return (
    <EventOptionChoice
      legend="¿Incluir lista de regalos?"
      name="event-gifts-enabled"
      value={draft.celebration?.giftsEnabled !== false}
      onChange={(enabled) =>
        setDraft((current) => ({
          ...current,
          celebration: {
            ...(current.celebration ||
              defaultCelebration(current.kind === "wedding")),
            giftsEnabled: enabled,
          },
        }))
      }
      choices={[
        {
          value: true,
          title: "Con lista de regalos",
          description:
            "Tus invitados podrán ver la lista de deseos o tus datos para regalos.",
          icon: "lucide:gift",
        },
        {
          value: false,
          title: "Sin lista de regalos",
          description:
            "No se mostrará sección de regalos ni se enviará el enlace de la lista.",
          icon: "lucide:ban",
        },
      ]}
    />
  );
}
