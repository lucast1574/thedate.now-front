import type { Dispatch, SetStateAction } from "react";
import Icon from "@/components/icon";
import { defaultCelebration } from "@/lib/events/celebration";
import type { Event } from "@/lib/events/types";

export default function EventGiftsChoice({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  const giftsEnabled = draft.celebration?.giftsEnabled !== false;

  function setEnabled(enabled: boolean) {
    setDraft((current) => ({
      ...current,
      celebration: {
        ...(current.celebration ||
          defaultCelebration(current.kind === "wedding")),
        giftsEnabled: enabled,
      },
    }));
  }

  return (
    <fieldset className="event-gifts-choice">
      <legend>¿Incluir lista de regalos?</legend>
      <div
        className="gift-radio-group"
        role="radiogroup"
        aria-label="Lista de regalos"
      >
        <label
          className={`gift-radio-card ${giftsEnabled ? "is-selected" : ""}`}
        >
          <input
            type="radio"
            name="event-gifts-enabled"
            checked={giftsEnabled}
            onChange={() => setEnabled(true)}
          />
          <span className="custom-radio-indicator" aria-hidden="true">
            <span className="custom-radio-dot" />
          </span>
          <div className="gift-radio-body">
            <span className="gift-radio-heading">
              <Icon name="lucide:gift" />
              <strong>Con lista de regalos</strong>
            </span>
            <small>
              Tus invitados podrán ver la lista de deseos o tus datos para
              regalos.
            </small>
          </div>
        </label>

        <label
          className={`gift-radio-card ${!giftsEnabled ? "is-selected" : ""}`}
        >
          <input
            type="radio"
            name="event-gifts-enabled"
            checked={!giftsEnabled}
            onChange={() => setEnabled(false)}
          />
          <span className="custom-radio-indicator" aria-hidden="true">
            <span className="custom-radio-dot" />
          </span>
          <div className="gift-radio-body">
            <span className="gift-radio-heading">
              <Icon name="lucide:ban" />
              <strong>Sin lista de regalos</strong>
            </span>
            <small>
              No se mostrará sección de regalos ni enlace en la invitación.
            </small>
          </div>
        </label>
      </div>
    </fieldset>
  );
}
