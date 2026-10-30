import Link from "next/link";
import Icon from "@/components/icon";
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
  const label =
    tab === "tables"
      ? "Organizar mesas"
      : tab === "gifts"
        ? "Ver lista de regalos"
        : "Gestionar invitados";
  const description =
    tab === "tables"
      ? "Dale su lugar a cada persona. Abre una celebraci\u00f3n para distribuir a tus invitados y preparar sus mesas."
      : tab === "gifts"
        ? "Cada historia tiene sus propios deseos. Abre una celebraci\u00f3n para preparar y gestionar su lista de regalos."
        : "Cada celebraci\u00f3n empieza con las personas. Abre una para gestionar su lista, enviar invitaciones y seguir las respuestas.";
  return (
    <div className="organization-selection">
      <h2>
        {wedding ? "Tus bodas" : "Tus eventos"} <span>{events.length}</span>
      </h2>
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
              <span className="organization-event-action">
                {label}
                <Icon name="arrow" />
              </span>
            </span>
          </Link>
        ))}
      </section>
      <aside className="organization-selection-note">
        <h3>
          {tab === "tables"
            ? "Un lugar para todos"
            : tab === "gifts"
              ? "Detalles que cuentan su historia"
              : "Todo empieza con tus invitados"}
        </h3>
        <p>{description}</p>
        <small>
          Puedes volver a esta lista para continuar con otra{" "}
          {wedding ? "boda" : "celebraci\u00f3n"} cuando quieras.
        </small>
      </aside>
    </div>
  );
}
