import Icon from "@/components/icon";
import type { Gift } from "@/lib/events/wishlist";
import { giftStore } from "@/lib/events/gift-store";
import GiftImage from "./gift-image";
import OwnerGiftActions from "./owner-gift-actions";
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
  const status = gift.delivered
    ? "received"
    : gift.guestId
      ? "reserved"
      : "available";
  return (
    <article className="gift-card owner-gift-card" data-status={status}>
      <div className="owner-gift-visual">
        <GiftImage
          key={gift.imageUrl}
          title={gift.title}
          src={
            gift.imageUrl
              ? `/api/wishlist-images/${eventId}/${gift.id}`
              : undefined
          }
        />
        <span className="gift-status">
          <Icon
            name={
              gift.delivered ? "check" : gift.guestId ? "users" : "lucide:gift"
            }
          />
          {gift.delivered
            ? "Recibido"
            : gift.guestId
              ? "Reservado"
              : "Disponible"}
        </span>
      </div>
      <div className="gift-card-content">
        <span className="gift-merchant">{giftStore(gift.url)}</span>
        <h3>
          <a href={gift.url} target="_blank" rel="noopener noreferrer">
            {gift.title}
            <Icon name="external" />
          </a>
        </h3>
        {gift.description && <p>{gift.description}</p>}
        {gift.guestId && (
          <div className="gift-assignment">
            <Icon name="users" />
            <span>
              <small>Lo regala</small>
              <strong>{name || "Invitado"}</strong>
            </span>
          </div>
        )}
        <OwnerGiftActions
          reserved={!!gift.guestId}
          delivered={gift.delivered}
          busy={busy}
          title={gift.title}
          onEdit={onEdit}
          onRemove={onRemove}
          onReservation={onReservation}
        />
      </div>
    </article>
  );
}
