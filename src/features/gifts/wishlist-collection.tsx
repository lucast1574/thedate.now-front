import { useEffect, useRef, useState } from "react";
import Icon from "@/components/icon";
import {
  filterOwnerGifts,
  ownerGiftStatus,
  type GiftFilter,
} from "@/lib/events/wishlist-owner";
import type { Gift } from "@/lib/events/wishlist";
import OwnerGiftCard from "./owner-gift-card";
export default function WishlistCollection({
  items,
  names,
  eventId,
  busy,
  onEdit,
  onRemove,
  onReservation,
  onExample,
}: {
  items: Gift[];
  names: Record<string, string>;
  eventId: string;
  busy: boolean;
  onEdit: (gift: Gift) => void;
  onRemove: (gift: Gift) => void;
  onReservation: (
    gift: Gift,
    action: "release" | "delivered" | "pending",
  ) => void;
  onExample: () => void;
}) {
  const [filter, setFilter] = useState<GiftFilter>("all"),
    [search, setSearch] = useState("");
  const activeFilter = useRef<HTMLButtonElement>(null),
    actionPending = useRef(false);
  const filtered = filterOwnerGifts(items, names, filter, search);
  useEffect(() => {
    if (actionPending.current && !busy) {
      if (document.activeElement === document.body)
        activeFilter.current?.focus({ preventScroll: true });
      actionPending.current = false;
    }
  }, [busy, filtered.length]);
  const filters: [GiftFilter, string][] = [
    ["all", "Todos"],
    ["available", "Disponibles"],
    ["reserved", "Reservados"],
    ["received", "Recibidos"],
  ];
  return (
    <section className="wishlist-collection" aria-label="Tus regalos">
      <div className="wishlist-collection-heading">
        <div>
          <h3>Tus regalos</h3>
          <span>{items.length} de 100 ideas</span>
        </div>
        {items.length > 0 && (
          <label className="wishlist-search">
            <Icon name="search" />
            <input
              aria-label="Buscar regalo o invitado"
              placeholder="Buscar regalo o invitado"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        )}
      </div>
      <div
        className="wishlist-filters"
        role="group"
        aria-label="Filtrar regalos"
      >
        {filters.map(([value, label]) => (
          <button
            type="button"
            key={value}
            ref={filter === value ? activeFilter : undefined}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
            <span>
              {value === "all"
                ? items.length
                : items.filter((g) => ownerGiftStatus(g) === value).length}
            </span>
          </button>
        ))}
      </div>
      {!items.length ? (
        <div className="wishlist-start">
          <div className="wishlist-start-heading">
            <span className="wishlist-start-icon">
              <Icon name="lucide:gift" />
            </span>
            <span>UNA IDEA ES UN BUEN COMIENZO</span>
          </div>
          <h3>¿Qué les gustaría recibir?</h3>
          <p>
            Guarda productos de sus tiendas favoritas. Sus invitados podrán
            elegir uno y reservarlo, para que cada detalle llegue una sola vez.
          </p>
          <ol className="wishlist-start-steps">
            <li>
              <Icon name="lucide:link" />
              <strong>Pega un enlace</strong>
              <span>Del producto que les gusta.</span>
            </li>
            <li>
              <Icon name="lucide:list-checks" />
              <strong>Prepara tu lista</strong>
              <span>Revisa la imagen y los detalles.</span>
            </li>
            <li>
              <Icon name="lucide:gift" />
              <strong>Compártela</strong>
              <span>Cada invitado elige su regalo.</span>
            </li>
          </ol>
          <button type="button" onClick={onExample}>
            Ver una lista de ejemplo
            <Icon name="arrow" />
          </button>
        </div>
      ) : filtered.length ? (
        <div className="gift-grid owner-gift-grid">
          {filtered.map((gift) => (
            <OwnerGiftCard
              key={gift.id}
              gift={gift}
              eventId={eventId}
              name={names[gift.guestId || ""]}
              busy={busy}
              onEdit={() => onEdit(gift)}
              onRemove={() => {
                actionPending.current = true;
                onRemove(gift);
              }}
              onReservation={(action) => {
                actionPending.current = true;
                onReservation(gift, action);
              }}
            />
          ))}
        </div>
      ) : (
        <div className="wishlist-no-results">
          <Icon name="search" />
          <h3>No hay regalos con esta selección</h3>
          <p>Prueba otro nombre o vuelve a ver la lista completa.</p>
          <button
            type="button"
            onClick={() => {
              setFilter("all");
              setSearch("");
            }}
          >
            Ver todos los regalos
          </button>
        </div>
      )}
    </section>
  );
}
