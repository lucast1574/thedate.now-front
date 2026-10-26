"use client";
import Link from "next/link";
import Icon from "@/components/icon";
import type { GuestWishlist as GuestWishlistData } from "@/lib/events/wishlist";
import GiftImage from "./gift-image";
import { useGuestWishlist } from "./use-guest-wishlist";
export default function GuestWishlist({
  token,
  initial,
}: {
  token: string;
  initial: GuestWishlistData;
}) {
  const { data, busy, error, notice, choose } = useGuestWishlist(
      token,
      initial,
    ),
    mine = data.items.find((item) => item.mine);
  return (
    <main
      className={`gift-page ${data.event.kind === "wedding" ? "gifts-wedding" : "gifts-general"}`}
    >
      <nav>
        <Link href={`/rsvp/${token}`}>
          <Icon name="undo" /> Volver a la invitación
        </Link>
        <span>{data.event.title}</span>
      </nav>
      <header className="gift-page-heading">
        <Icon name="lucide:gift" />
        <h1>Un detalle para celebrar</h1>
        <p>
          {data.guestName}, estas son algunas ideas que nos harían ilusión.
          Elige una y los demás sabrán que ya está reservada.
        </p>
      </header>
      <div className="gift-page-note">
        <Icon name="check" />
        <span>
          {mine
            ? `Tu regalo: ${mine.title}`
            : "Cada regalo puede elegirlo una sola invitación."}
          <small>
            La reserva se hace aquí. La compra se realiza en la tienda del
            enlace.
          </small>
        </span>
      </div>
      {error && (
        <p role="alert" className="gift-error">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="gift-success">
          {notice}
        </p>
      )}
      {!data.items.length ? (
        <section className="gift-empty">
          <h2>Estamos preparando la lista</h2>
          <p>
            Vuelve a tu invitación; pronto encontrarás aquí las ideas de
            regalos.
          </p>
        </section>
      ) : (
        <div className="gift-grid">
          {data.items.map((item) => (
            <article
              key={item.id}
              className={`gift-card ${item.reserved && !item.mine ? "is-reserved" : ""}`}
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="gift-product-link"
                aria-label={`Ver ${item.title} en la tienda`}
              >
                <GiftImage
                  src={
                    item.hasImage
                      ? `/api/gifts/${token}/images/${item.id}`
                      : undefined
                  }
                  title={item.title}
                />
              </a>
              <div className="gift-card-content">
                <span className={`gift-status ${item.mine ? "is-mine" : ""}`}>
                  {item.mine
                    ? item.delivered
                      ? "Gracias, regalo recibido"
                      : "Reservado por ti"
                    : item.reserved
                      ? "Ya elegido"
                      : "Disponible"}
                </span>
                <h2>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                    <Icon name="external" />
                  </a>
                </h2>
                {item.description && <p>{item.description}</p>}
                {item.mine ? (
                  <button
                    className="gift-secondary"
                    disabled={busy || item.delivered}
                    onClick={() => void choose(item.id, true)}
                  >
                    {item.delivered
                      ? "Recibido por el organizador"
                      : "Liberar mi elección"}
                  </button>
                ) : (
                  <button
                    className="gift-primary"
                    disabled={busy || item.reserved || !!mine}
                    onClick={() => void choose(item.id)}
                  >
                    {item.reserved
                      ? "No disponible"
                      : mine
                        ? "Ya elegiste tu regalo"
                        : "Quiero regalarlo"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
      <footer>
        Las reservas se actualizan automáticamente. Tu nombre solo lo ve quien
        organiza el evento.
      </footer>
    </main>
  );
}
