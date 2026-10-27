import type { Dispatch, SetStateAction } from "react";
import type { Event } from "@/lib/events/types";
import { invitationHost } from "@/lib/events/domains";
import { defaultInvitationMessage } from "@/lib/events/event-form";
export default function EventMessageFields({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  const message = (
    draft.invitationMessage ?? defaultInvitationMessage
  ).replaceAll("{{enlace}}", "");
  const link = `https://${invitationHost(draft.kind, draft.slug || "tucelebracion")}/rsvp/enlace-personal`;
  return (
    <section className="event-form-card event-message-card">
      <label>
        Mensaje de WhatsApp
        <textarea
          rows={5}
          maxLength={4000}
          value={message}
          onChange={(e) =>
            setDraft({
              ...draft,
              invitationMessage: e.target.value.replaceAll("{{enlace}}", ""),
            })
          }
          placeholder={defaultInvitationMessage}
        />
      </label>
      <div className="event-message-fixed-link">
        <strong>Enlace personal incluido siempre</strong>
        <span>{link}</span>
        <small>
          Se añade al final del mensaje y no se puede quitar. Cada invitado
          recibirá su enlace único.
        </small>
      </div>
      <div
        className="event-message-preview"
        aria-label="Ejemplo del mensaje de WhatsApp"
      >
        <strong>Así lo verá tu invitado · ejemplo</strong>
        <p>
          {message.trim() || defaultInvitationMessage}
          {"\n\nConfirma tu asistencia aquí: "}
          {link}
        </p>
        <small>
          Se envía desde el gestor después de publicar. Guardar aquí no envía
          mensajes.
        </small>
      </div>
    </section>
  );
}
