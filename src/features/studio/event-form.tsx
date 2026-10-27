import DemoContinuation from "./demo-continuation";
import ActionButton from "@/components/action-button";
import Icon from "@/components/icon";
import type { Dispatch, SetStateAction, FormEvent } from "react";
import type { Event } from "@/lib/events/types";
import EventAudience from "./event-audience";
import EventBasics from "./event-basics";
import EventLocationFields from "./event-location-fields";
import EventCapacity from "./event-capacity";
import EventTemplateStart from "./event-template-start";
import EventMessageFields from "./event-message-fields";
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
        <EventBasics
          draft={draft}
          setDraft={setDraft}
          selected={!!selected?.publishedAt}
        />
      </section>
      <section className="event-form-card">
        <div className="event-form-card-heading">
          <span>02</span>
          <div>
            <h2>El lugar de la celebración</h2>
            <p>Una dirección clara para que todos puedan llegar.</p>
          </div>
        </div>
        <EventLocationFields draft={draft} setDraft={setDraft} />
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
      <EventMessageFields draft={draft} setDraft={setDraft} />
      {!selected &&
        (draft.isDemo ? (
          <DemoContinuation draft={draft} />
        ) : (
          <EventTemplateStart draft={draft} setDraft={setDraft} />
        ))}
      <details className="event-form-options" open>
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
            : "Tu diseño se conserva al continuar. Activa tu evento con un único pago."}
        </p>
        <ActionButton className="office-button" disabled={busy}>
          {selected ? "Guardar cambios" : "Continuar al pago"}{" "}
          <Icon name="arrow" />
        </ActionButton>
      </div>
    </form>
  );
}
