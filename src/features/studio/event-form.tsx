import ActionButton from "@/components/action-button";
import Icon from "@/components/icon";
import type { Dispatch, SetStateAction, FormEvent } from "react";
import type { Event } from "@/lib/events/types";
import EventBasics from "./event-basics";
import EventLocationFields from "./event-location-fields";
import EventCapacity from "./event-capacity";
import StyleFields from "@/components/style-fields";
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
          <span>
            <Icon name="calendar" />
          </span>
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
          <span>
            <Icon name="users" />
          </span>
          <div>
            <h2>El lugar y tus invitados</h2>
            <p>Cuéntanos dónde será y cuántas personas esperas.</p>
          </div>
        </div>
        <EventLocationFields
          draft={draft}
          setDraft={setDraft}
          savedMapURL={selected?.mapUrl}
        />
        <EventCapacity draft={draft} setDraft={setDraft} />
      </section>
      <details className="event-form-options">
        <summary>
          <Icon name="sparkle" />
          <span>
            Mensaje y estilo
            <small>Puedes personalizarlos ahora o en el editor.</small>
          </span>
          <Icon name="chevron" />
        </summary>
        <div>
          <label>
            ¿Qué les quieres decir a tus invitados?
            <textarea
              rows={3}
              value={draft.description}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
              placeholder="Queremos celebrar este momento contigo…"
            />
          </label>
          <StyleFields
            template={draft.template}
            accentColor={draft.accentColor}
            classicLabel="Clásico editorial"
            colorLabel="Color de acento"
            onChange={(patch) =>
              setDraft((current) => ({ ...current, ...patch }))
            }
          />
        </div>
      </details>
      <details className="event-form-options">
        <summary>
          <Icon name="layout" />
          <span>
            Más opciones<small>Quién organiza y tiempo para confirmar.</small>
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
          <label>
            Si responden «Tal vez», ¿cuántas horas guardamos su lugar?
            <input
              required
              type="number"
              min="1"
              max="168"
              value={draft.maybeHoldHours}
              onChange={(e) =>
                setDraft({ ...draft, maybeHoldHours: Number(e.target.value) })
              }
            />
            <small>
              Por defecto, 48 horas. Después podrán confirmar si todavía hay
              espacio.
            </small>
          </label>
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
