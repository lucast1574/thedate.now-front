import { useTranslator } from "@/lib/i18n/react";
import Icon from "@/components/icon";
import { invitationHost } from "@/lib/events/domains";
import type { Event } from "@/lib/events/types";
import type { Wishlist } from "@/lib/events/wishlist";
export default function WishlistOwnerHeader({
  event,
  list,
  view,
  onView,
}: {
  event: Event;
  list: Wishlist;
  view: string;
  onView: (view: string) => void;
}) {
  const i18n = useTranslator();

  const published =
    event.paymentStatus === "paid" && !event.isDemo && !!event.publishedAt;
  return (
    <>
      <header className="wishlist-owner-header">
        <div>
          <span className="wishlist-eyebrow">
            {i18n("DETALLES PARA COMPARTIR")}
          </span>
          <h2>{i18n("Tu lista, regalo a regalo")}</h2>
          <p>
            {i18n(
              "Elige lo que les gustaría recibir. Cada regalo encuentra a su persona.",
            )}
          </p>
        </div>
        <div className="wishlist-auto-status" role="status">
          <Icon name={list.items.length ? "lucide:gift" : "clock"} />
          <span>
            <strong>
              {list.items.length
                ? i18n("Tu lista se actualiza automáticamente")
                : i18n("Empieza con un regalo")}
            </strong>
            <small>
              {published
                ? i18n(
                    "Disponible desde el elemento de regalos de tu invitación",
                  )
                : i18n("Se compartirá al publicar la invitación")}
            </small>
          </span>
        </div>
      </header>
      <div className="wishlist-owner-navigation">
        <div className="wishlist-view-actions">
          {view !== "manage" && (
            <button type="button" onClick={() => onView("manage")}>
              <Icon name="lucide:arrow-left" />
              {i18n("Mi lista")}
            </button>
          )}
          <button
            type="button"
            aria-pressed={view === "guest"}
            onClick={() => onView(view === "guest" ? "manage" : "guest")}
          >
            <Icon name="lucide:eye" />
            {i18n("Vista de invitado")}
          </button>
          <button
            type="button"
            aria-pressed={view === "example"}
            onClick={() => onView(view === "example" ? "manage" : "example")}
          >
            <Icon name="lucide:book-open" />
            {i18n("Ver ejemplo")}
          </button>
        </div>
        {published ? (
          <a
            className="wishlist-share-link"
            href={`https://${invitationHost(event.kind, event.slug)}/regalos`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name="external" />
            {i18n("Abrir lista publicada")}
          </a>
        ) : (
          <span className="wishlist-publication-hint">
            <Icon name="clock" />
            {i18n("Publica la invitación para compartirla")}
          </span>
        )}
      </div>
    </>
  );
}
