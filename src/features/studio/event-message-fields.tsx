import InvitationMessageInput from "./invitation-message-input";
import {
  ensureInvitationLink,
  invitationMessagePreview,
} from "@/lib/events/invitation-message";
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
  const message = ensureInvitationLink(
    draft.invitationMessage ?? defaultInvitationMessage,
  );
  const link = `https://${invitationHost(draft.kind, draft.slug || "tucelebracion")}/rsvp/enlace-personal`;
  return (
    <section className="event-form-card event-message-card">
      <InvitationMessageInput
        value={message}
        onChange={(invitationMessage) =>
          setDraft({ ...draft, invitationMessage })
        }
      />
      <div
        className="event-message-preview"
        aria-label="Ejemplo del mensaje de WhatsApp"
      >
        <strong>Así lo verá tu invitado · ejemplo</strong>
        <p>{invitationMessagePreview(message, link)}</p>
        <small>
          Se envía desde el gestor después de publicar. Guardar aquí no envía
          mensajes.
        </small>
      </div>
    </section>
  );
}
