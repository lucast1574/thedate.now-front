"use client";
import { useState } from "react";
import Icon from "@/components/icon";
import type { Event } from "@/lib/events/types";
import type { Gift } from "@/lib/events/wishlist";
import { invitationHost } from "@/lib/events/domains";
import { useWishlist } from "./use-wishlist";
import GiftForm from "./gift-form";
import OwnerGiftCard from "./owner-gift-card";
import OwnerWishlistPreview from "./owner-wishlist-preview";
export default function WishlistPanel({ event }: { event: Event }) {
  const state = useWishlist(event.id),
    { list, guests } = state.data;
  const [editor, setEditor] = useState<Gift | "new" | null>(null);
  const [view, setView] = useState("manage");
  const ordered = [...list.items].sort(
    (a, b) => Number(!!b.guestId) - Number(!!a.guestId),
  );
  const committed = list.items.filter((item) => item.guestId).length,
    received = list.items.filter((item) => item.delivered).length;
  async function saveGift(gift: Gift) {
    const items = list.items.some((item) => item.id === gift.id)
      ? list.items.map((item) => (item.id === gift.id ? gift : item))
      : [...list.items, gift];
    const saved = await state.save({ ...list, items });
    if (saved) setEditor(null);
    return saved;
  }
  if (state.loading) return <p role="status">Cargando tu lista de regalos…</p>;
  if (!state.ready)
    return (
      <section className="wishlist-panel gift-empty">
        <h2>No pudimos abrir tu lista</h2>
        <p role="alert">{state.error}</p>
        <button
          className="gift-secondary"
          onClick={() => void state.load().catch(() => {})}
        >
          Volver a intentar
        </button>
      </section>
    );
  return (
    <section className="wishlist-panel">
      <header className="wishlist-heading">
        <div>
          <h2>Lista de regalos</h2>
          <p>Ideas de tus tiendas favoritas, sin regalos repetidos.</p>
        </div>
        <label className="wishlist-switch">
          <input
            type="checkbox"
            checked={list.enabled}
            disabled={state.busy}
            onChange={(e) =>
              void state.save({ ...list, enabled: e.target.checked })
            }
          />
          <span aria-hidden="true" />
          <strong>{list.enabled ? "Activada" : "Opcional"}</strong>
        </label>
      </header>
      <div
        className="gift-panel-tabs"
        aria-label="Vista de la lista de regalos"
      >
        <button
          aria-pressed={view === "manage"}
          onClick={() => setView("manage")}
        >
          Preparar mi lista
        </button>
        <button
          aria-pressed={view === "guest"}
          onClick={() => setView("guest")}
        >
          <Icon name="lucide:eye" /> Ver como invitado
        </button>
        <button
          aria-pressed={view === "example"}
          onClick={() => setView("example")}
        >
          Explorar un ejemplo
        </button>
      </div>
      {view !== "manage" ? (
        <OwnerWishlistPreview
          key={`${view}-${event.id}-${list.version}`}
          event={event}
          list={list}
          example={view === "example"}
        />
      ) : (
        <>
          {event.paymentStatus !== "paid" || event.isDemo ? (
            <p className="gift-draft-notice">
              Puedes preparar tu lista ahora. Tus invitados podrán elegir al
              activar y publicar este evento.
            </p>
          ) : event.publishedAt && list.enabled ? (
            <a
              className="gift-list-link"
              href={`https://${invitationHost(event.kind, event.slug)}/regalos`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon name="external" /> Página de regalos de este evento
            </a>
          ) : (
            <p className="gift-draft-notice">
              {!list.enabled
                ? "Activa esta opción para mostrarla en tu invitación."
                : "Publica tu invitación para compartir la lista."}
            </p>
          )}
          {state.error && (
            <div role="alert" className="gift-error">
              {state.error}
              <button
                className="gift-secondary"
                onClick={() => void state.load().catch(() => {})}
              >
                Recargar lista
              </button>
            </div>
          )}
          {state.notice && (
            <p role="status" className="gift-success">
              {state.notice}
            </p>
          )}
          <div className="wishlist-summary">
            <span>
              <strong>{list.items.length}</strong> ideas de regalo
            </span>
            <span>
              <strong>{committed}</strong> con compromiso
            </span>
            <span>
              <strong>{received}</strong> recibidos
            </span>
          </div>
          {editor !== null ? (
            <GiftForm
              key={editor === "new" ? "new" : editor.id}
              eventId={event.id}
              gift={editor === "new" ? undefined : editor}
              busy={state.busy}
              onSave={saveGift}
              onCancel={() => setEditor(null)}
            />
          ) : (
            <button
              className="gift-primary"
              disabled={state.busy || list.items.length >= 100}
              onClick={() => setEditor("new")}
            >
              <Icon name="plus" />
              Añadir un regalo
            </button>
          )}
          {!list.items.length && editor === null && (
            <div className="gift-empty">
              <Icon name="lucide:gift" />
              <h3>Empieza con una idea</h3>
              <p>
                Pega el enlace del producto. Intentaremos traer su nombre e
                imagen; si la tienda no los comparte, podrás completarlos.
              </p>
            </div>
          )}
          <div className="gift-grid owner-gift-grid">
            {ordered.map((gift) => (
              <OwnerGiftCard
                key={gift.id}
                gift={gift}
                eventId={event.id}
                name={guests[gift.guestId || ""]}
                busy={state.busy}
                onEdit={() => setEditor(gift)}
                onRemove={() =>
                  void state.save({
                    ...list,
                    items: list.items.filter((item) => item.id !== gift.id),
                  })
                }
                onReservation={(action) =>
                  void state.reservation(gift.id, action)
                }
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
