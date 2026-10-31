import { useEventRecency } from "./use-event-recency";
import Link from "next/link";
import Icon from "@/components/icon";
import type { Event, Kind, User } from "@/lib/events/types";
import { galleryEvents } from "@/lib/events/studio-gallery";
import DemoCover from "./demo-cover";
import { defaultDemoCover } from "@/lib/events/thumbnail";
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
  const lastOpened = useEventRecency(user.id, portal);
  const all = galleryEvents(events, user, portal, lastOpened),
    pending = all.filter((e) => !e.isDemo && e.paymentStatus !== "paid"),
    items = all.filter((e) => e.isDemo || e.paymentStatus === "paid"),
    wedding = portal === "wedding";
  return (
    <section className="workspace-gallery">
      <div className="gallery-heading">
        <div>
          <p className="office-kicker">
            {wedding
              ? "SAVE THE DATE · TU ESTUDIO"
              : "THE DATE · QUE EMPIECE LA FIESTA"}
          </p>
          <h1>
            {wedding ? (
              <>
                Cada historia merece
                <br />
                <em>su invitación.</em>
              </>
            ) : (
              <>
                Tus planes.
                <br />
                <em>Grandes momentos.</em>
              </>
            )}
          </h1>
          <p>
            {wedding
              ? "Un espacio para diseñar, imaginar y celebrar juntos."
              : "Crea algo que se sienta tan único como tu celebración."}
          </p>
        </div>
        <button className="gallery-create" onClick={onCreate}>
          <Icon name="plus" />
          {wedding ? "Crear una boda" : "Crear un evento"}
        </button>
      </div>
      {pending.length > 0 && (
        <section className="demo-continuity-note">
          <h2>Compras pendientes</h2>
          <p>Conservamos tu diseño hasta que completes el pago.</p>
          {pending.map((event) => (
            <p key={event.id}>
              <Link href={`/?event=${encodeURIComponent(event.id)}`}>
                Continuar con {event.title}
              </Link>
            </p>
          ))}
        </section>
      )}
      <div className="gallery-section-heading">
        <h2>Mis invitaciones</h2>
        <span>
          {loading
            ? "Cargando…"
            : `${items.length} ${items.length === 1 ? "invitación" : "invitaciones"}`}{" "}
          · Recientes primero
        </span>
      </div>
      {loading ? (
        <p role="status">Preparando tu galería…</p>
      ) : (
        <div className="invitation-grid">
          {items.map((event) => (
            <article className="invitation-card" key={event.id}>
              {!event.isDemo &&
                (event.ownerId === user.id || user.role === "admin") && (
                  <Link
                    className="invitation-quick-edit"
                    href={`/?event=${encodeURIComponent(event.id)}`}
                    aria-label={`Editar datos de ${event.title}`}
                    title="Editar datos"
                  >
                    <Icon name="lucide:pencil" />
                  </Link>
                )}
              <Link
                className="invitation-card-preview"
                href={`/editor/${encodeURIComponent(event.id)}`}
                aria-label={`Editar ${event.title}`}
              >
                {defaultDemoCover(event) ? (
                  <DemoCover event={event} />
                ) : (
                  <InvitationThumbnail event={event} />
                )}
              </Link>
              {!event.isDemo && (
                <div className="invitation-card-meta">
                  <div>
                    <span className="card-status">
                      {event.publishedAt ? "Publicada" : "Borrador"}
                      {event.ownerId !== user.id ? " · Compartida" : ""}
                    </span>
                    <h3>
                      <Link href={`/editor/${encodeURIComponent(event.id)}`}>
                        {event.title}
                      </Link>
                    </h3>
                    <small>
                      {new Intl.DateTimeFormat("es", {
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
                      href={`/manager/${encodeURIComponent(event.id)}`}
                      aria-label={`Gestionar ${event.title}`}
                    >
                      <Icon name="users" />
                      Gestionar
                    </Link>
                  )}
                </div>
              )}
              {!event.isDemo &&
                event.paymentStatus === "paid" &&
                event.publishedAt &&
                validInvitationSlug(event.slug) && (
                  <a
                    className="invitation-card-public-link"
                    href={`https://${invitationHost(event.kind, event.slug)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ver la invitación de ${event.title}`}
                  >
                    Ver invitación <Icon name="arrow" />
                  </a>
                )}
            </article>
          ))}
          <button className="invitation-new-card" onClick={onCreate}>
            <Icon name="plus" />
            <strong>{wedding ? "Crear otra boda" : "Crear otro evento"}</strong>
            <span>Nueva invitación</span>
          </button>
        </div>
      )}
    </section>
  );
}
