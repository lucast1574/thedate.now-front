import ActionButton from "@/components/action-button";
import Icon from "@/components/icon";
import type { Dispatch, SetStateAction, FormEvent } from "react";
import type { Event } from "@/lib/events/types";
import EventAudience from "./event-audience";
import EventBasics from "./event-basics";
import EventLocationFields from "./event-location-fields";
import EventCapacity from "./event-capacity";
import EventTemplateStart from "./event-template-start";
import GuestHoldField from "./guest-hold-field";
export default function EventForm({
  draft,
  setDraft,
  selected,
  busy,
  onSubmit,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
  selected: Event | null;
  busy: boolean;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <form
      className="event-form simple-event-form"
      onSubmit={onSubmit}
      onInvalidCapture={(e) => {
        const field = e.target as HTMLInputElement,
          details = field.closest("details");
        if (details && !details.open) {
          e.preventDefault();
          details.open = true;
          requestAnimationFrame(() => {
            field.focus();
            field.reportValidity();
          });
        }
      }}
    >
      <section className="event-form-card">
        <div className="event-form-card-heading">
          <span>01</span>
          <div>
            <h2>
              {draft.kind === "wedding" ? "Su gran día" : "Tu celebración"}
            </h2>
            <p>Empecemos con el nombre y la fecha.</p>
          </div>
        </div>
        <EventBasics draft={draft} setDraft={setDraft} selected={!!selected} />
      </section>
      <section className="event-form-card">
        <div className="event-form-card-heading">
          <span>02</span>
          <div>
            <h2>El lugar de la celebración</h2>
            <p>Una dirección clara para que todos puedan llegar.</p>
          </div>
        </div>
        <EventLocationFields
          draft={draft}
          setDraft={setDraft}
          savedMapURL={selected?.mapUrl}
        />
      </section>
      <section className="event-form-card event-guests-card">
        <div className="event-form-card-heading">
          <span>
            <Icon name="users" />
          </span>
          <div>
            <h2>A quiénes esperamos</h2>
            <p>Cupos y edades, reunidos en un solo lugar.</p>
          </div>
        </div>
        <div className="event-guest-settings">
          <EventCapacity draft={draft} setDraft={setDraft} />
          <EventAudience draft={draft} setDraft={setDraft} />
        </div>
      </section>
      <section className="event-form-card event-message-card">
        <label>
          Un mensaje para tus invitados{" "}
          <span className="form-optional">Opcional</span>
          <textarea
            rows={3}
            maxLength={5000}
            value={draft.description}
            onChange={(e) =>
              setDraft({ ...draft, description: e.target.value })
            }
            placeholder="Queremos celebrar este momento contigo…"
          />
        </label>
      </section>
      {!selected && <EventTemplateStart draft={draft} setDraft={setDraft} />}
      <details className="event-form-options">
        <summary>
          <Icon name="layout" />
          <span>
            Organización y confirmaciones
            <small>Quién organiza y cuánto dura una respuesta «Tal vez».</small>
          </span>
          <Icon name="chevron" />
        </summary>
        <div>
          <label>
            ¿Quién organiza?
            <input
              required
              value={draft.organizer}
              onChange={(e) =>
                setDraft({ ...draft, organizer: e.target.value })
              }
            />
          </label>
          <GuestHoldField draft={draft} setDraft={setDraft} />
        </div>
      </details>
      <div className="event-form-submit">
        <p>
          {selected
            ? "Tus cambios se guardarán en este evento."
            : "Crear y diseñar es gratis. Publicas cuando estés listo."}
        </p>
        <ActionButton className="office-button" disabled={busy}>
          {selected ? "Guardar cambios" : "Crear mi invitación"}{" "}
          <Icon name="arrow" />
        </ActionButton>
      </div>
    </form>
  );
}
