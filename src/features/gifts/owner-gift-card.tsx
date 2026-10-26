import Icon from "@/components/icon";
import type { Gift } from "@/lib/events/wishlist";
import GiftImage from "./gift-image";
export default function OwnerGiftCard({
  gift,
  eventId,
  name,
  busy,
  onEdit,
  onRemove,
  onReservation,
}: {
  gift: Gift;
  eventId: string;
  name?: string;
  busy: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onReservation: (action: "release" | "delivered" | "pending") => void;
}) {
  return (
    <article className="gift-card owner-gift-card">
      <GiftImage
        key={gift.imageUrl}
        title={gift.title}
        src={
          gift.imageUrl
            ? `/api/wishlist-images/${eventId}/${gift.id}`
            : undefined
        }
      />
      <div className="gift-card-content">
        <span className="gift-status">
          {gift.guestId
            ? gift.delivered
              ? "Recibido"
              : "Con compromiso"
            : "Disponible"}
        </span>
        <h3>
          <a href={gift.url} target="_blank" rel="noopener noreferrer">
            {gift.title}
            <Icon name="external" />
          </a>
        </h3>
        {gift.description && <p>{gift.description}</p>}
        {gift.guestId ? (
          <div className="gift-assignment">
            <Icon name="users" />
            <span>
              <small>Lo regala</small>
              <strong>{name || "Invitado"}</strong>
            </span>
            <button
              className="gift-secondary"
              disabled={busy}
              onClick={() =>
                onReservation(gift.delivered ? "pending" : "delivered")
              }
            >
              {gift.delivered ? "Marcar pendiente" : "Marcar recibido"}
            </button>
            <details>
              <summary>Gestionar reserva</summary>
              <p>
                Si liberas esta reserva, otra persona podrá elegir el regalo.
              </p>
              <button
                className="gift-danger"
                disabled={busy}
                onClick={() => onReservation("release")}
              >
                Liberar reserva
              </button>
            </details>
          </div>
        ) : (
          <div className="gift-card-actions">
            <button className="gift-secondary" disabled={busy} onClick={onEdit}>
              <Icon name="lucide:pencil" />
              Editar
            </button>
            <button
              className="gift-icon-button"
              aria-label={`Eliminar ${gift.title}`}
              disabled={busy}
              onClick={onRemove}
            >
              <Icon name="lucide:trash" />
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
