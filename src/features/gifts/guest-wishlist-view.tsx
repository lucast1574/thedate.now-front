"use client";
import GiftListEmpty from "./gift-list-empty";
import { useTranslator } from "@/lib/i18n/react";

import { useState } from "react";
import Icon from "@/components/icon";
import type { GuestGift, GuestWishlist } from "@/lib/events/wishlist";
import { giftStore } from "@/lib/events/gift-store";
import GuestGiftCard from "./guest-gift-card";
import GiftConfirmation from "./gift-confirmation";
export default function GuestWishlistView({
  data,
  busy = false,
  error = "",
  notice = "",
  imageSource,
  onChoose,
  preview = false,
  onIdentify,
  initialGiftId,
}: {
  data: GuestWishlist;
  busy?: boolean;
  error?: string;
  notice?: string;
  preview?: boolean;
  initialGiftId?: string;
  onIdentify?: (item: GuestGift) => void;
  imageSource: (item: GuestGift) => string | undefined;
  onChoose: (id: string, release: boolean) => Promise<boolean>;
}) {
  const i18n = useTranslator();

  const [pending, setPending] = useState<{
    item: GuestGift;
    release: boolean;
  } | null>(() => {
    const item = data.items.find(
      (item) => item.id === initialGiftId && !item.reserved,
    );
    return item && data.guestName && !data.items.some((gift) => gift.mine)
      ? { item, release: false }
      : null;
  });
  const [filter, setFilter] = useState("all");
  const mine = data.items.find((item) => item.mine);
  const available = data.items.filter((item) => !item.reserved).length;
  const visible =
    filter === "available"
      ? data.items.filter((item) => !item.reserved || item.mine)
      : data.items;
  const Heading = preview ? "h2" : "h1";
  return (
    <>
      <header className="gift-page-heading">
        <span className="gift-event-title">{data.event.title}</span>
        <Heading>{i18n("Un detalle para celebrar")}</Heading>
        <p>
          {data.guestName ? `${data.guestName}, tu` : i18n("Tu")}{" "}
          {i18n(
            "compañía es lo más importante. Si quieres tener un detalle, aquí tienes algunas ideas.",
          )}
        </p>
      </header>
      {mine ? (
        <section className="gift-chosen" aria-label={i18n("Tu regalo elegido")}>
          <Icon name="check" />
          <div>
            <span>
              {mine.delivered
                ? i18n("¡Gracias por tu regalo!")
                : i18n("Tu elección está reservada")}
            </span>
            <h3>{mine.title}</h3>
            <p>
              {mine.delivered
                ? i18n("El organizador ya confirmó que lo recibió.")
                : i18n(
                    "Ahora puedes comprarlo en la tienda. Reservarlo aquí no realiza la compra.",
                  )}
            </p>
          </div>
          <a
            className="gift-primary"
            href={mine.url}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
          >
            {i18n("Ir a")} {giftStore(mine.url)} <Icon name="external" />
          </a>
        </section>
      ) : (
        <ol className="gift-journey" aria-label={i18n("Cómo elegir un regalo")}>
          <li>
            <span>1</span>
            <div>
              <strong>{i18n("Encuentra un detalle")}</strong>
              <small>{i18n("Revisa los productos y sus tiendas.")}</small>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <strong>{i18n("Reserva tu elección")}</strong>
              <small>{i18n("Una opción por invitación, sin repetir.")}</small>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <strong>{i18n("Cómpralo en la tienda")}</strong>
              <small>{i18n("El pago se hace fuera de The Date.")}</small>
            </div>
          </li>
        </ol>
      )}
      {error && !pending && (
        <p role="alert" className="gift-error">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="gift-success">
          {notice}
        </p>
      )}
      {data.items.length > 0 && (
        <div className="gift-catalog-heading">
          <p>
            <strong>{available}</strong>{" "}
            {available === 1
              ? i18n("regalo disponible")
              : i18n("regalos disponibles")}
          </p>
          <div className="gift-filters" aria-label={i18n("Mostrar regalos")}>
            <button
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
            >
              {i18n("Todos (")}
              {data.items.length})
            </button>
            <button
              aria-pressed={filter === "available"}
              onClick={() => setFilter("available")}
            >
              {i18n("Disponibles")}
            </button>
          </div>
        </div>
      )}
      {!data.items.length ? (
        <GiftListEmpty wedding={data.event.kind === "wedding"} />
      ) : !visible.length ? (
        <p className="gift-empty">
          {i18n(
            "Todos los regalos ya están reservados. Gracias por acompañarnos.",
          )}
        </p>
      ) : (
        <div className="gift-grid">
          {visible.map((item) => (
            <GuestGiftCard
              key={item.id}
              item={item}
              image={imageSource(item)}
              busy={busy}
              hasChoice={!!mine}
              onChoose={(item, release = false) =>
                onIdentify ? onIdentify(item) : setPending({ item, release })
              }
            />
          ))}
        </div>
      )}
      <footer className="gift-privacy">
        <Icon name="lock" />
        {i18n("Tu nombre y tu elección solo los ve quien organiza el evento.")}
      </footer>
      {pending && (
        <GiftConfirmation
          item={pending.item}
          release={pending.release}
          image={imageSource(pending.item)}
          busy={busy}
          error={error}
          onClose={() => setPending(null)}
          onConfirm={() => {
            void onChoose(pending.item.id, pending.release).then((ok) => {
              if (ok) setPending(null);
            });
          }}
        />
      )}
    </>
  );
}
