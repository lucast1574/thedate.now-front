import type { Event, User, Kind } from "@/lib/events/types";
export default function EventSidebar({
  user,
  portal,
  events,
  selectedId,
  onCreate,
  onSelect,
}: {
  user: User;
  portal: Kind;
  events: Event[];
  selectedId?: string;
  onCreate: () => void;
  onSelect: (event: Event) => void;
}) {
  return (
    <aside className="office-sidebar">
      <p className="office-kicker">TUS EVENTOS</p>
      {user.role !== "couple" &&
        (!user.creatorPortals || user.creatorPortals.includes(portal)) && (
          <button className="new-event" onClick={onCreate}>
            ＋ Crear evento
          </button>
        )}
      <div className="event-list">
        {events.map((event) => (
          <button
            key={event.id}
            className={selectedId === event.id ? "active" : ""}
            onClick={() => onSelect(event)}
          >
            <strong>{event.title}</strong>
            <small>
              {event.isDemo
                ? "Demo · marca de agua"
                : event.kind === "wedding"
                  ? "Boda"
                  : "Evento"}{" "}
              ·{" "}
              {event.publishedAt
                ? "Publicado"
                : event.paymentStatus === "paid"
                  ? "Listo para publicar"
                  : "Borrador"}
            </small>
          </button>
        ))}
      </div>
    </aside>
  );
}
