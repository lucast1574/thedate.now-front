import Link from "next/link";
import Icon from "@/components/icon";
import type { Event, Kind, User } from "@/lib/events/types";
import { galleryEvents } from "@/lib/events/studio-gallery";
import InvitationThumbnail from "./invitation-thumbnail";
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
  const items = galleryEvents(events, user, portal),
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
              <Link
                className="invitation-card-preview"
                href={`/editor/${encodeURIComponent(event.id)}`}
                aria-label={`Editar ${event.title}`}
              >
                <InvitationThumbnail event={event} />
                <span className="card-edit">
                  <Icon name="arrow" />
                  Abrir editor
                </span>
              </Link>
              <div className="invitation-card-meta">
                <div>
                  <span className={`card-status ${event.isDemo ? "demo" : ""}`}>
                    {event.isDemo
                      ? "Tu muestra gratuita"
                      : event.publishedAt
                        ? "Publicada"
                        : "Borrador"}
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
                    href={`/?event=${encodeURIComponent(event.id)}`}
                    aria-label={`Gestionar ${event.title}`}
                  >
                    <Icon name="users" />
                    Gestionar
                  </Link>
                )}
              </div>
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
