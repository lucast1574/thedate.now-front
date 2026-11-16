import { useTranslator } from "@/lib/i18n/react";
import Link from "next/link";
import Icon from "@/components/icon";
import InvitationThumbnail from "@/features/studio/invitation-thumbnail";
import { eventReadOnly } from "@/lib/events/event-closure";
import {
  organizationEventDate,
  organizationEventHref,
} from "@/lib/events/organization-events";
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
  const i18n = useTranslator();

  const label =
    tab === "tables"
      ? i18n("Organizar mesas")
      : tab === "gifts"
        ? i18n("Ver lista de regalos")
        : i18n("Gestionar invitados");
  return (
    <div className="organization-selection">
      <header className="organization-selection-heading">
        <h2>{wedding ? i18n("Tus bodas") : i18n("Tus eventos")}</h2>
        <span>
          {events.length}{" "}
          {wedding
            ? events.length === 1
              ? i18n("boda")
              : i18n("bodas")
            : events.length === 1
              ? i18n("evento")
              : i18n("eventos")}{" "}
          {events.length === 1 ? i18n("disponible") : i18n("disponibles")}
        </span>
      </header>
      <section
        className="organization-event-cards"
        aria-label={
          wedding ? i18n("Seleccionar boda") : i18n("Seleccionar evento")
        }
      >
        {events.map((item) => (
          <Link
            key={item.id}
            className="organization-event-card"
            href={organizationEventHref(item, tab)}
          >
            <span className="organization-event-thumbnail">
              {item.id === lastOpened && (
                <span className="organization-recent">
                  <Icon name="clock" />
                  {i18n("Última abierta")}
                </span>
              )}
              <InvitationThumbnail event={item} />
            </span>
            <span className="organization-event-info">
              <span className="organization-event-meta">
                <small>{organizationEventDate(item, i18n)}</small>
                <small
                  className="organization-publication"
                  data-published={Boolean(item.publishedAt)}
                >
                  {item.publishedAt ? i18n("Publicada") : i18n("Borrador")}
                </small>
              </span>
              <strong>{item.title}</strong>
              <span className="organization-event-action">
                {eventReadOnly(item)
                  ? tab === "tables"
                    ? i18n("Ver mesas")
                    : tab === "gifts"
                      ? i18n("Ver regalos")
                      : i18n("Ver invitados")
                  : label}
                <Icon name="arrow" />
              </span>
            </span>
          </Link>
        ))}
      </section>
      <p className="organization-selection-hint">
        <Icon name="clock" />
        {i18n(
          "La última que abriste aparece primero. Después, las más recientes.",
        )}
      </p>
    </div>
  );
}
