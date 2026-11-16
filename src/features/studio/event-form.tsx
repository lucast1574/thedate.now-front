import { useTranslator } from "@/lib/i18n/react";
import DemoContinuation from "./demo-continuation";
import ActionButton from "@/components/action-button";
import Alert from "@/components/alert";
import Icon from "@/components/icon";
import type { Dispatch, SetStateAction, FormEvent } from "react";
import type { Event } from "@/lib/events/types";
import EventAudience from "./event-audience";
import EventBasics from "./event-basics";
import EventLocationFields from "./event-location-fields";
import EventCapacity from "./event-capacity";
import EventTemplateStart from "./event-template-start";
import EventMessageFields from "./event-message-fields";
import EventDressFields from "./event-dress-fields";
import EventMaybeChoice from "./event-maybe-choice";
import EventGiftsChoice from "./event-gifts-choice";
export default function EventForm({
  draft,
  setDraft,
  selected,
  busy,
  error,
  courtesy = false,
  onSubmit,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
  selected: Event | null;
  busy: boolean;
  error?: string;
  courtesy?: boolean;
  onSubmit: (e: FormEvent) => void;
}) {
  const i18n = useTranslator();

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
              {draft.kind === "wedding"
                ? i18n("Su gran día")
                : i18n("Tu celebración")}
            </h2>
            <p>{i18n("Empecemos con el nombre y la fecha.")}</p>
          </div>
        </div>
        <EventBasics
          draft={draft}
          setDraft={setDraft}
          selected={!!selected?.publishedAt || !!selected?.invitationsEnabled}
        />
      </section>
      <section className="event-form-card">
        <div className="event-form-card-heading">
          <span>02</span>
          <div>
            <h2>{i18n("El lugar de la celebración")}</h2>
            <p>{i18n("Una dirección clara para que todos puedan llegar.")}</p>
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
            <h2>{i18n("A quiénes esperamos")}</h2>
            <p>{i18n("Cupos y edades, reunidos en un solo lugar.")}</p>
          </div>
        </div>
        <div className="event-guest-settings">
          <EventCapacity draft={draft} setDraft={setDraft} />
          <EventAudience draft={draft} setDraft={setDraft} />
        </div>
      </section>
      <EventDressFields draft={draft} setDraft={setDraft} />
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
            {i18n("Organización y confirmaciones")}{" "}
            <small>
              {i18n("Configura las respuestas de tus invitados y los regalos.")}
            </small>
          </span>
          <Icon name="chevron" />
        </summary>
        <div>
          <label>
            {i18n("¿Quién organiza?")}{" "}
            <input
              required
              value={draft.organizer}
              onChange={(e) =>
                setDraft({ ...draft, organizer: e.target.value })
              }
            />
          </label>
          <EventMaybeChoice draft={draft} setDraft={setDraft} />
          <EventGiftsChoice draft={draft} setDraft={setDraft} />
        </div>
      </details>
      <Alert>{error}</Alert>
      <div className="event-form-submit">
        <p>
          {selected
            ? i18n("Tus cambios se guardarán en este evento.")
            : courtesy
              ? i18n(
                  "Tienes una cortesía: esta invitación será gratis. Se consume una sola vez.",
                )
              : i18n(
                  "Tu diseño se conserva al continuar. Activa tu evento con un único pago.",
                )}
        </p>
        <ActionButton className="office-button" disabled={busy}>
          {selected
            ? i18n("Guardar cambios")
            : courtesy
              ? i18n("Crear mi invitación gratis")
              : i18n("Continuar al pago")}{" "}
          <Icon name="arrow" />
        </ActionButton>
      </div>
    </form>
  );
}
