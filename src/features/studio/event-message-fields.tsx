import type { Dispatch, SetStateAction } from "react";
import type { Event } from "@/lib/events/types";
import { invitationHost } from "@/lib/events/domains";
export default function EventMessageFields({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  const message = draft.invitationMessage || "";
  const link = `https://${invitationHost(draft.kind, draft.slug || "tucelebracion")}/rsvp/enlace-personal`;
  const preview = message.trim()
    ? message.includes("{{enlace}}")
      ? message.replaceAll("{{enlace}}", link)
      : `${message.trim()}\n\nConfirma tu asistencia aquí: ${link}`
    : `${draft.kind === "wedding" ? "Save the Date" : "The Date"} · Hola Ana, te invitamos a ${draft.title || "nuestra celebración"}. Tu invitación permite hasta 2 personas (incluyéndote). Confirma y registra a tus acompañantes aquí: ${link}`;
  return (
    <section className="event-form-card event-message-card">
      <label>
        Mensaje de WhatsApp <span className="form-optional">Opcional</span>
        <textarea
          rows={5}
          maxLength={4000}
          value={message}
          onChange={(e) =>
            setDraft({ ...draft, invitationMessage: e.target.value })
          }
          placeholder={
            "¡Nos hace mucha ilusión celebrar contigo!\nConoce los detalles y confirma aquí: {{enlace}}"
          }
        />
      </label>
      <p className="event-message-help">
        Este es el mensaje que acompañará tu invitación por WhatsApp. Escribe{" "}
        <code>{"{{enlace}}"}</code> donde quieras colocar el enlace personal. Si
        no lo incluyes, lo añadiremos al final.
      </p>
      <button
        type="button"
        disabled={message.includes("{{enlace}}") || message.length > 3988}
        className="map-retry"
        onClick={() =>
          setDraft({
            ...draft,
            invitationMessage: `${message}${message && !message.endsWith("\n") ? "\n" : ""}{{enlace}}`,
          })
        }
      >
        Añadir enlace al mensaje
      </button>
      <div
        className="event-message-preview"
        aria-label="Ejemplo del mensaje de WhatsApp"
      >
        <strong>Así lo verá tu invitado · ejemplo</strong>
        <p>{preview}</p>
        <small>
          Cada invitado recibirá su enlace único. Se envía desde el gestor,
          después de publicar; guardar aquí no envía mensajes.
        </small>
      </div>
      <label>
        Texto de la invitación{" "}
        <span className="form-optional">Opcional · aparece en el diseño</span>
        <textarea
          rows={3}
          maxLength={5000}
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          placeholder="Queremos celebrar este momento contigo…"
        />
      </label>
    </section>
  );
}
