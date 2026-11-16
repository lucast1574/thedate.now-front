import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

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
        aria-label={i18n("Ver {v0} en {v1}", {
          v0: item.title,
          v1: giftStore(item.url),
        })}
      >
        <GiftImage src={image} title={item.title} />
      </a>
      <div className="gift-card-content">
        <div className="gift-card-meta">
          <span className="gift-merchant">{giftStore(item.url)}</span>
          <span className={`gift-status ${item.mine ? "is-mine" : ""}`}>
            {item.mine
              ? item.delivered
                ? i18n("Recibido")
                : i18n("Tu elección")
              : item.reserved
                ? i18n("Reservado")
                : i18n("Disponible")}
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
          {i18n("Ver producto en la tienda")} <Icon name="external" />
        </a>
        {item.mine ? (
          <button
            className="gift-secondary"
            disabled={busy || item.delivered}
            onClick={() => onChoose(item, true)}
          >
            {item.delivered
              ? i18n("Gracias, regalo recibido")
              : i18n("Cambiar mi elección")}
          </button>
        ) : (
          <button
            className="gift-primary"
            disabled={busy || item.reserved || hasChoice}
            onClick={() => onChoose(item)}
          >
            {item.reserved
              ? i18n("Otro invitado lo eligió")
              : hasChoice
                ? i18n("Ya tienes un regalo elegido")
                : i18n("Quiero regalarlo")}
          </button>
        )}
      </div>
    </article>
  );
}
