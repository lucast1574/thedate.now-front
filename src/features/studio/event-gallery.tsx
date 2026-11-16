import EventGalleryHeading from "./event-gallery-heading";
import { useTranslator } from "@/lib/i18n/react";
import CourtesyNotice from "./courtesy-notice";
import { hasInvitationCourtesy } from "@/lib/events/courtesy";
import { eventReadOnly } from "@/lib/events/event-closure";
import { useEventRecency } from "./use-event-recency";
import Link from "next/link";
import Icon from "@/components/icon";
import type { Event, Kind, User } from "@/lib/events/types";
import { galleryEvents } from "@/lib/events/studio-gallery";
import DemoCover from "./demo-cover";
import InvitationThumbnail from "./invitation-thumbnail";
import { invitationHost, validInvitationSlug } from "@/lib/events/domains";
export default function EventGallery({
  events,
  user,
  portal,
  loading,
  onCreate,
}: {
  events: Event[];
  user: User;
  portal: Kind;
  loading: boolean;
  onCreate: () => void;
}) {
  const i18n = useTranslator();

  const lastOpened = useEventRecency(user.id, portal);
  const all = galleryEvents(events, user, portal, lastOpened),
    pending = all.filter((e) => !e.isDemo && e.paymentStatus !== "paid"),
    items = all.filter((e) => e.isDemo || e.paymentStatus === "paid"),
    wedding = portal === "wedding";
  return (
    <section className="workspace-gallery">
      <EventGalleryHeading wedding={wedding} onCreate={onCreate} />
      {pending.length > 0 && (
        <section className="demo-continuity-note">
          <h2>{i18n("Compras pendientes")}</h2>
          <p>{i18n("Conservamos tu diseño hasta que completes el pago.")}</p>
          {pending.map((event) => (
            <p key={event.id}>
              <Link href={`/?event=${encodeURIComponent(event.id)}`}>
                {i18n("Continuar con")} {event.title}
              </Link>
            </p>
          ))}
        </section>
      )}
      {hasInvitationCourtesy(events, user.id) && <CourtesyNotice />}
      <div className="gallery-section-heading">
        <div>
          <h2>{i18n("Mis invitaciones")}</h2>
          <span>
            {loading
              ? i18n("Cargando…")
              : `${items.length} ${items.length === 1 ? i18n("invitación") : "invitaciones"}`}{" "}
            {i18n("· Recientes primero")}
          </span>
        </div>
      </div>
      {loading ? (
        <p role="status">{i18n("Preparando tu galería…")}</p>
      ) : (
        <div className="invitation-grid">
          {items.map((event) => (
            <article className="invitation-card" key={event.id}>
              {!eventReadOnly(event) &&
                !event.isDemo &&
                (event.ownerId === user.id || user.role === "admin") && (
                  <Link
                    className="invitation-quick-edit"
                    href={`/?event=${encodeURIComponent(event.id)}`}
                    aria-label={i18n("Editar datos de {v0}", {
                      v0: event.title,
                    })}
                    title={i18n("Editar datos")}
                  >
                    <Icon name="lucide:pencil" />
                  </Link>
                )}
              <Link
                className="invitation-card-preview"
                href={`/editor/${encodeURIComponent(event.id)}`}
                aria-label={`${eventReadOnly(event) ? i18n("Ver") : i18n("Editar")} ${event.title}${event.isDemo ? i18n(" · Invitación de demo") : ""}`}
              >
                {event.isDemo ? (
                  <DemoCover event={event} />
                ) : (
                  <InvitationThumbnail event={event} />
                )}
                {event.isDemo && (
                  <span className="invitation-demo-badge">
                    <Icon name={wedding ? "flower" : "sparkle"} />
                    {i18n("Demo")}
                  </span>
                )}
              </Link>
              {event.isDemo && (
                <div className="invitation-card-meta">
                  <div>
                    <span className="card-status demo">
                      {i18n("Invitación de demo")}
                    </span>
                    <p className="invitation-demo-description">
                      {i18n("Prueba el editor con esta invitación de muestra.")}
                    </p>
                  </div>
                </div>
              )}
              {!event.isDemo && (
                <div className="invitation-card-meta">
                  <div>
                    <span className="card-status">
                      {eventReadOnly(event)
                        ? i18n("Terminada")
                        : event.publishedAt
                          ? i18n("Publicada")
                          : i18n("Borrador")}
                      {event.ownerId !== user.id ? i18n(" · Compartida") : ""}
                    </span>
                    <h3>
                      <Link href={`/editor/${encodeURIComponent(event.id)}`}>
                        {event.title}
                      </Link>
                    </h3>
                    <small>
                      {new Intl.DateTimeFormat(i18n.locale, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        timeZone: event.timeZone || "UTC",
                      }).format(new Date(event.startAt))}
                    </small>
                  </div>
                  {!event.isDemo && (
                    <Link
                      className="card-manage"
                      href={`/${eventReadOnly(event) ? "editor" : "manager"}/${encodeURIComponent(event.id)}`}
                      aria-label={`${eventReadOnly(event) ? "Consultar" : i18n("Gestionar")} ${event.title}`}
                    >
                      <Icon name="users" />
                      {eventReadOnly(event)
                        ? i18n("Consultar")
                        : i18n("Gestionar")}
                    </Link>
                  )}
                </div>
              )}
              {!event.isDemo &&
                event.paymentStatus === "paid" &&
                event.publishedAt &&
                !eventReadOnly(event) &&
                validInvitationSlug(event.slug) && (
                  <a
                    className="invitation-card-public-link"
                    href={`https://${invitationHost(event.kind, event.slug)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={i18n("Ver la invitación de {v0}", {
                      v0: event.title,
                    })}
                  >
                    {i18n("Ver invitación")} <Icon name="arrow" />
                  </a>
                )}
            </article>
          ))}
          <button className="invitation-new-card" onClick={onCreate}>
            <Icon name="plus" />
            <strong>
              {wedding ? i18n("Crear otra boda") : i18n("Crear otro evento")}
            </strong>
            <span>{i18n("Nueva invitación")}</span>
          </button>
        </div>
      )}
    </section>
  );
}
