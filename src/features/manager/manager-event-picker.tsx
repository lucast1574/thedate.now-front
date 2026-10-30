import Link from "next/link";
import Icon from "@/components/icon";
import InvitationThumbnail from "@/features/studio/invitation-thumbnail";
import { organizationEventDate } from "@/lib/events/organization-events";
import type { Event } from "@/lib/events/types";

export default function ManagerEventPicker({
  events,
  wedding,
  tab,
  lastOpened,
}: {
  events: Event[];
  wedding: boolean;
  tab: string;
  lastOpened?: string;
}) {
  const label =
    tab === "tables"
      ? "Organizar mesas"
      : tab === "gifts"
        ? "Ver lista de regalos"
        : "Gestionar invitados";
  return (
    <div className="organization-selection">
      <header className="organization-selection-heading">
        <h2>{wedding ? "Tus bodas" : "Tus eventos"}</h2>
        <span>
          {events.length} {wedding ? "bodas" : "eventos"} disponibles
        </span>
      </header>
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
              {item.id === lastOpened && (
                <span className="organization-recent">
                  <Icon name="clock" />
                  Última abierta
                </span>
              )}
              <InvitationThumbnail event={item} />
            </span>
            <span className="organization-event-info">
              <span className="organization-event-meta">
                <small>{organizationEventDate(item)}</small>
                <small
                  className="organization-publication"
                  data-published={Boolean(item.publishedAt)}
                >
                  {item.publishedAt ? "Publicada" : "Borrador"}
                </small>
              </span>
              <strong>{item.title}</strong>
              <span className="organization-event-action">
                {label}
                <Icon name="arrow" />
              </span>
            </span>
          </Link>
        ))}
      </section>
      <p className="organization-selection-hint">
        <Icon name="clock" />
        La última que abriste aparece primero. Después, las más recientes.
      </p>
    </div>
  );
}
