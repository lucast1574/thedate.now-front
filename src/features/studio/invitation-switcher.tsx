import Icon from "@/components/icon";
import { organizationEventDate } from "@/lib/events/organization-events";
import Listbox from "@/components/listbox";
import type { Event } from "@/lib/events/types";
import { eventReadOnly } from "@/lib/events/event-closure";
export default function InvitationSwitcher({
  events,
  selected,
  error,
  onSelect,
}: {
  events: Event[];
  selected?: Event;
  error?: string;
  onSelect: (event: Event) => void;
}) {
  const invitations = events.filter(
    (event) => !event.isDemo && !eventReadOnly(event),
  );
  if (invitations.length < 2) return null;
  return (
    <div className="workspace-invitation">
      <span className="workspace-invitation-label">Estás organizando</span>
      <Listbox
        aria-label="Cambiar invitación"
        value={selected?.isDemo ? "" : selected?.id || ""}
        menuMinWidth={320}
        renderLabel={(option, trigger) => {
          const event = invitations.find((item) => item.id === option.value);
          if (!event) return option.label;
          return (
            <span
              className={`invitation-choice ${trigger ? "invitation-choice-trigger" : ""}`}
            >
              {!trigger && (
                <span className="invitation-choice-icon">
                  <Icon name="mail" />
                </span>
              )}
              <span className="invitation-choice-text">
                <strong>{event.title}</strong>
                <small>
                  {organizationEventDate(event)}
                  {event.paymentStatus !== "paid" ? " · Pendiente de pago" : ""}
                </small>
              </span>
            </span>
          );
        }}
        onValueChange={(id) => {
          const event = invitations.find((item) => item.id === id);
          if (event) onSelect(event);
        }}
      >
        {(!selected || selected.isDemo) && (
          <option value="" disabled>
            Elige tu invitación
          </option>
        )}
        {invitations.map((event) => (
          <option key={event.id} value={event.id}>
            {event.title}
            {event.paymentStatus !== "paid" ? " · Pendiente" : ""}
          </option>
        ))}
      </Listbox>
      {error && <small role="alert">{error}</small>}
    </div>
  );
}
