import { useRouter } from "next/navigation";
import InvitationThumbnail from "@/features/studio/invitation-thumbnail";
import Icon from "@/components/icon";
import {
  organizationEvents,
  organizationEventDate,
} from "@/lib/events/organization-events";
import type { Event, User } from "@/lib/events/types";

export default function ManagerEventPicker({
  events,
  event,
  user,
  tab,
  guard,
}: {
  events: Event[];
  event: Event;
  user: User;
  tab: string;
  guard: () => boolean;
}) {
  const router = useRouter();
  const items = organizationEvents(events, event.kind, user);
  if (items.length < 2)
    return <p className="manager-event-context">{event.title}</p>;
  return (
    <section
      className="organization-event-cards"
      aria-label={
        event.kind === "wedding" ? "Seleccionar boda" : "Seleccionar evento"
      }
    >
      {items.map((item) => (
        <button
          type="button"
          key={item.id}
          className="organization-event-card"
          aria-pressed={item.id === event.id}
          onClick={() => {
            if (item.id !== event.id && guard())
              router.push(`/manager/${encodeURIComponent(item.id)}?tab=${tab}`);
          }}
        >
          <span className="organization-event-thumbnail">
            <InvitationThumbnail event={item} />
          </span>
          <span className="organization-event-info">
            <strong>{item.title}</strong>
            <small>{organizationEventDate(item)}</small>
          </span>
          {item.id === event.id && <Icon name="check" />}
        </button>
      ))}
    </section>
  );
}
