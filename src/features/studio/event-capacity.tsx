import type { Dispatch, SetStateAction } from "react";
import type { Event } from "@/lib/events/types";
export default function EventCapacity({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  return (
    <fieldset className="event-capacity">
      <legend>¿Cuántas personas pueden asistir?</legend>
      <div className="capacity-options">
        <label>
          <input
            type="radio"
            name="capacity-mode"
            checked={!draft.capacityUnlimited}
            onChange={() =>
              setDraft({
                ...draft,
                capacityUnlimited: false,
                capacity: draft.capacity || 50,
              })
            }
          />
          Una cantidad máxima
        </label>
        <label>
          <input
            type="radio"
            name="capacity-mode"
            checked={draft.capacityUnlimited}
            onChange={() => setDraft({ ...draft, capacityUnlimited: true })}
          />
          Sin límite
        </label>
      </div>
      {!draft.capacityUnlimited && (
        <label className="capacity-number">
          Máximo de personas
          <input
            required
            type="number"
            min="1"
            max="100000"
            value={draft.capacity}
            onChange={(e) =>
              setDraft({ ...draft, capacity: Number(e.target.value) })
            }
          />
        </label>
      )}
      <small>Cuenta a cada invitado y a sus acompañantes (+1).</small>
    </fieldset>
  );
}
