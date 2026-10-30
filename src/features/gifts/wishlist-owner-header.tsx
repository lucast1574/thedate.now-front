import Icon from "@/components/icon";
import { invitationHost } from "@/lib/events/domains";
import type { Event } from "@/lib/events/types";
import type { Wishlist } from "@/lib/events/wishlist";
export default function WishlistOwnerHeader({
  event,
  list,
  busy,
  view,
  onView,
  onToggle,
}: {
  event: Event;
  list: Wishlist;
  busy: boolean;
  view: string;
  onView: (view: string) => void;
  onToggle: () => void;
}) {
  const published =
    event.paymentStatus === "paid" && !event.isDemo && !!event.publishedAt;
  return (
    <>
      <header className="wishlist-owner-header">
        <div>
          <span className="wishlist-eyebrow">DETALLES PARA COMPARTIR</span>
          <h2>Tu lista, regalo a regalo</h2>
          <p>
            Elige lo que les gustaría recibir. Cada regalo encuentra a su
            persona.
          </p>
        </div>
        <button
          type="button"
          className="wishlist-visibility"
          role="switch"
          aria-checked={list.enabled}
          aria-label="Mostrar lista de regalos en la invitación"
          disabled={busy}
          onClick={onToggle}
        >
          <span className="wishlist-toggle-track" aria-hidden="true">
            <span />
          </span>
          <span>
            <strong>
              {list.enabled
                ? published
                  ? "Visible para tus invitados"
                  : "Lista activada"
                : "Solo tú puedes verla"}
            </strong>
            <small>
              {list.enabled
                ? published
                  ? "Pueden elegir y reservar sus regalos"
                  : "Se mostrará al publicar la invitación"
                : "Actívala cuando esté lista para compartir"}
            </small>
          </span>
        </button>
      </header>
      <div className="wishlist-owner-navigation">
        <div className="wishlist-view-actions">
          {view !== "manage" && (
            <button type="button" onClick={() => onView("manage")}>
              <Icon name="lucide:arrow-left" />
              Mi lista
            </button>
          )}
          <button
            type="button"
            aria-pressed={view === "guest"}
            onClick={() => onView(view === "guest" ? "manage" : "guest")}
          >
            <Icon name="lucide:eye" />
            Vista de invitado
          </button>
          <button
            type="button"
            aria-pressed={view === "example"}
            onClick={() => onView(view === "example" ? "manage" : "example")}
          >
            <Icon name="lucide:book-open" />
            Ver ejemplo
          </button>
        </div>
        {published && list.enabled ? (
          <a
            className="wishlist-share-link"
            href={`https://${invitationHost(event.kind, event.slug)}/regalos`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="external" />
            Abrir lista publicada
          </a>
        ) : (
          <span className="wishlist-publication-hint">
            <Icon name={list.enabled ? "clock" : "lock"} />
            {!list.enabled
              ? "Puedes prepararla sin mostrarla todavía"
              : "Publica la invitación para compartirla"}
          </span>
        )}
      </div>
    </>
  );
}
