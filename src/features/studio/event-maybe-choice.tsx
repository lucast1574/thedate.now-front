import { useTranslator } from "@/lib/i18n/react";
import type { Dispatch, SetStateAction } from "react";
import type { Event } from "@/lib/events/types";
import EventOptionChoice from "./event-option-choice";
import GuestHoldField from "./guest-hold-field";

export default function EventMaybeChoice({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  const i18n = useTranslator();

  const enabled = draft.maybeEnabled !== false;
  return (
    <div className="event-confirmation-settings">
      <EventOptionChoice
        legend="¿Permitir respuestas «Tal vez»?"
        name="event-maybe-enabled"
        value={enabled}
        onChange={(maybeEnabled) =>
          setDraft((current) => ({ ...current, maybeEnabled }))
        }
        choices={[
          {
            value: false,
            title: i18n("Solo Sí o No"),
            description: i18n("Tus invitados confirmarán si asistirán o no."),
            icon: "check",
          },
          {
            value: true,
            title: i18n("Con Tal vez"),
            description: i18n("Podrán reservar su lugar mientras confirman."),
            icon: "clock",
          },
        ]}
      />
      {enabled && <GuestHoldField draft={draft} setDraft={setDraft} />}
      {!enabled && draft.id && (
        <p className="event-option-note">
          {i18n(
            "Las respuestas «Tal vez» ya recibidas conservan su plazo original. Esos invitados podrán confirmar Sí o No.",
          )}
        </p>
      )}
    </div>
  );
}
