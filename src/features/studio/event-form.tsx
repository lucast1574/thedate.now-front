import ActionButton from "@/components/action-button";
import type { Dispatch, SetStateAction } from "react";
import type { Event } from "@/lib/events/types";
import type { FormEvent } from "react";
import EventBasics from "./event-basics";
import EventLocationFields from "./event-location-fields";
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
    <form className="event-form" onSubmit={onSubmit}>
      <EventBasics draft={draft} setDraft={setDraft} selected={!!selected} />
      <EventLocationFields
        draft={draft}
        setDraft={setDraft}
        savedMapURL={selected?.mapUrl}
      />
      <div className="form-grid">
        <label>
          Aforo del evento
          <select
            value={draft.capacityUnlimited ? "unlimited" : "limited"}
            onChange={(e) =>
              setDraft({
                ...draft,
                capacityUnlimited: e.target.value === "unlimited",
                capacity: draft.capacity || 50,
              })
            }
          >
            <option value="limited">Aforo limitado</option>
            <option value="unlimited">Aforo ilimitado</option>
          </select>
          {!draft.capacityUnlimited && (
            <input
              aria-label="Aforo máximo de personas"
              required
              type="number"
              min="1"
              max="100000"
              value={draft.capacity}
              onChange={(e) =>
                setDraft({ ...draft, capacity: Number(e.target.value) })
              }
            />
          )}
          <small>Incluye titulares y todos sus acompañantes.</small>
        </label>
        <label>
          Reserva temporal para «Tal vez» (horas)
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
        </label>
      </div>
      <label>
        Mensaje de la invitación
        <textarea
          rows={4}
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          placeholder="Queremos celebrar este momento contigo..."
        />
      </label>
      <StyleFields
        template={draft.template}
        accentColor={draft.accentColor}
        classicLabel="Clásico editorial"
        colorLabel="Color de acento"
        onChange={(patch) => setDraft((current) => ({ ...current, ...patch }))}
      />
      <ActionButton className="office-button" disabled={busy}>
        {selected ? "Guardar cambios" : "Crear evento"} ↗
      </ActionButton>
    </form>
  );
}
