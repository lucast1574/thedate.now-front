import Link from "next/link";
import InvitationThumbnail from "@/features/studio/invitation-thumbnail";
import { organizationEventDate } from "@/lib/events/organization-events";
import type { Event } from "@/lib/events/types";

export default function ManagerEventPicker({
  events,
  wedding,
  tab,
}: {
  events: Event[];
  wedding: boolean;
  tab: string;
}) {
  return (
    <section
      className="organization-event-cards"
      aria-label={wedding ? "Seleccionar boda" : "Seleccionar evento"}
    >
      {events.map((item) => (
        <Link
          key={item.id}
          className="organization-event-card"
          href={`/manager/${encodeURIComponent(item.id)}?tab=${tab}`}
        >
          <span className="organization-event-thumbnail">
            <InvitationThumbnail event={item} />
          </span>
          <span className="organization-event-info">
            <strong>{item.title}</strong>
            <small>{organizationEventDate(item)}</small>
          </span>
        </Link>
      ))}
    </section>
  );
}
