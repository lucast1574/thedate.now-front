import Icon from "@/components/icon";
import type { GuestGift } from "@/lib/events/wishlist";
import { giftStore } from "@/lib/events/gift-store";
import GiftImage from "./gift-image";
export default function GuestGiftCard({
  item,
  image,
  busy,
  hasChoice,
  onChoose,
}: {
  item: GuestGift;
  image?: string;
  busy: boolean;
  hasChoice: boolean;
  onChoose: (item: GuestGift, release?: boolean) => void;
}) {
  return (
    <article
      className={`gift-card ${item.mine ? "is-mine" : item.reserved ? "is-reserved" : ""}`}
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        referrerPolicy="no-referrer"
        className="gift-product-link"
        aria-label={`Ver ${item.title} en ${giftStore(item.url)}`}
      >
        <GiftImage src={image} title={item.title} />
      </a>
      <div className="gift-card-content">
        <div className="gift-card-meta">
          <span className="gift-merchant">{giftStore(item.url)}</span>
          <span className={`gift-status ${item.mine ? "is-mine" : ""}`}>
            {item.mine
              ? item.delivered
                ? "Recibido"
                : "Tu elección"
              : item.reserved
                ? "Reservado"
                : "Disponible"}
          </span>
        </div>
        <h2>{item.title}</h2>
        {item.description && <p>{item.description}</p>}
        <a
          className="gift-store-link"
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="no-referrer"
        >
          Ver producto en la tienda <Icon name="external" />
        </a>
        {item.mine ? (
          <button
            className="gift-secondary"
            disabled={busy || item.delivered}
            onClick={() => onChoose(item, true)}
          >
            {item.delivered
              ? "Gracias, regalo recibido"
              : "Cambiar mi elección"}
          </button>
        ) : (
          <button
            className="gift-primary"
            disabled={busy || item.reserved || hasChoice}
            onClick={() => onChoose(item)}
          >
            {item.reserved
              ? "Otro invitado lo eligió"
              : hasChoice
                ? "Ya tienes un regalo elegido"
                : "Quiero regalarlo"}
          </button>
        )}
      </div>
    </article>
  );
}
