import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

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
              defaultCelebration(current.kind === "wedding", i18n)),
            giftsEnabled: enabled,
          },
        }))
      }
      choices={[
        {
          value: true,
          title: i18n("Con lista de regalos"),
          description: i18n(
            "Tus invitados podrán ver la lista de deseos o tus datos para regalos.",
          ),
          icon: "lucide:gift",
        },
        {
          value: false,
          title: i18n("Sin lista de regalos"),
          description: i18n(
            "No se mostrará sección de regalos ni se enviará el enlace de la lista.",
          ),
          icon: "lucide:ban",
        },
      ]}
    />
  );
}
