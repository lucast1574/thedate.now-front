"use client";
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
}: {
  data: GuestWishlist;
  busy?: boolean;
  error?: string;
  notice?: string;
  preview?: boolean;
  imageSource: (item: GuestGift) => string | undefined;
  onChoose: (id: string, release: boolean) => Promise<boolean>;
}) {
  const [pending, setPending] = useState<{
    item: GuestGift;
    release: boolean;
  } | null>(null);
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
        <Heading>Un detalle para celebrar</Heading>
        <p>
          {data.guestName}, tu compañía es lo más importante. Si quieres tener
          un detalle, aquí tienes algunas ideas.
        </p>
      </header>
      {mine ? (
        <section className="gift-chosen" aria-label="Tu regalo elegido">
          <Icon name="check" />
          <div>
            <span>
              {mine.delivered
                ? "¡Gracias por tu regalo!"
                : "Tu elección está reservada"}
            </span>
            <h3>{mine.title}</h3>
            <p>
              {mine.delivered
                ? "El organizador ya confirmó que lo recibió."
                : "Ahora puedes comprarlo en la tienda. Reservarlo aquí no realiza la compra."}
            </p>
          </div>
          <a
            className="gift-primary"
            href={mine.url}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
          >
            Ir a {giftStore(mine.url)} <Icon name="external" />
          </a>
        </section>
      ) : (
        <ol className="gift-journey" aria-label="Cómo elegir un regalo">
          <li>
            <span>1</span>
            <div>
              <strong>Encuentra un detalle</strong>
              <small>Revisa los productos y sus tiendas.</small>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <strong>Reserva tu elección</strong>
              <small>Una opción por invitación, sin repetir.</small>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <strong>Cómpralo en la tienda</strong>
              <small>El pago se hace fuera de The Date.</small>
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
            {available === 1 ? "regalo disponible" : "regalos disponibles"}
          </p>
          <div className="gift-filters" aria-label="Mostrar regalos">
            <button
              aria-pressed={filter === "all"}
              onClick={() => setFilter("all")}
            >
              Todos ({data.items.length})
            </button>
            <button
              aria-pressed={filter === "available"}
              onClick={() => setFilter("available")}
            >
              Disponibles
            </button>
          </div>
        </div>
      )}
      {!data.items.length ? (
        <section className="gift-empty">
          <Icon name="lucide:gift" />
          <h2>Estamos preparando la lista</h2>
          <p>
            Vuelve a tu invitación; pronto encontrarás aquí las ideas de
            regalos.
          </p>
        </section>
      ) : !visible.length ? (
        <p className="gift-empty">
          Todos los regalos ya están reservados. Gracias por acompañarnos.
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
                setPending({ item, release })
              }
            />
          ))}
        </div>
      )}
      <footer className="gift-privacy">
        <Icon name="lock" />
        Tu nombre y tu elección solo los ve quien organiza el evento.
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
