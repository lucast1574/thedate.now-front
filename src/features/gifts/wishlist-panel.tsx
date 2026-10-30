"use client";
import Icon from "@/components/icon";
import { useState } from "react";
import type { Event } from "@/lib/events/types";
import type { Gift } from "@/lib/events/wishlist";
import { useWishlist } from "./use-wishlist";
import GiftEditorSwitch from "./gift-editor-switch";
import GiftForm from "./gift-form";
import WishlistOwnerHeader from "./wishlist-owner-header";
import WishlistCollection from "./wishlist-collection";
import OwnerWishlistPreview from "./owner-wishlist-preview";
export default function WishlistPanel({ event }: { event: Event }) {
  const state = useWishlist(event.id),
    { list, guests } = state.data;
  const [editor, setEditor] = useState<Gift | "new">("new"),
    [formKey, setFormKey] = useState(0);
  const [view, setView] = useState("manage");
  const [dirty, setDirty] = useState(false),
    [pending, setPending] = useState<Gift | null>(null);
  function resetEditor() {
    setEditor("new");
    setFormKey((value) => value + 1);
  }
  async function saveGift(gift: Gift) {
    const items = list.items.some((item) => item.id === gift.id)
      ? list.items.map((item) => (item.id === gift.id ? gift : item))
      : [...list.items, gift];
    const saved = await state.save({ ...list, items });
    if (saved) resetEditor();
    return saved;
  }
  async function removeGift(gift: Gift) {
    const saved = await state.save({
      ...list,
      items: list.items.filter((item) => item.id !== gift.id),
    });
    if (saved && editor !== "new" && editor.id === gift.id) resetEditor();
  }
  if (state.loading) return <p role="status">Cargando tu lista de regalos…</p>;
  if (!state.ready)
    return (
      <section className="wishlist-panel wishlist-owner">
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
    <section className="wishlist-panel wishlist-owner">
      <WishlistOwnerHeader
        event={event}
        list={list}
        view={view}
        onView={setView}
      />
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
        <p role="status" className="wishlist-owner-notice">
          {state.notice}
        </p>
      )}
      {view === "manage" && (
        <a className="wishlist-mobile-add" href="#wishlist-gift-composer">
          <Icon name="plus" />
          {editor === "new" ? "Añadir regalo" : "Continuar edición"}
        </a>
      )}
      <div className="wishlist-owner-layout" data-preview={view !== "manage"}>
        {view !== "manage" ? (
          <OwnerWishlistPreview
            key={`${view}-${event.id}-${list.version}`}
            event={event}
            list={list}
            example={view === "example"}
          />
        ) : (
          <WishlistCollection
            items={list.items}
            names={guests}
            eventId={event.id}
            busy={state.busy}
            onEdit={(gift) => {
              if (dirty) setPending(gift);
              else setEditor(gift);
            }}
            onRemove={(gift) => void removeGift(gift)}
            onReservation={(gift, action) =>
              void state.reservation(gift.id, action)
            }
            onExample={() => setView("example")}
          />
        )}
        <aside
          id="wishlist-gift-composer"
          hidden={view !== "manage"}
          className="wishlist-composer"
          aria-label={editor === "new" ? "Añadir regalo" : "Editar regalo"}
        >
          {pending && (
            <GiftEditorSwitch
              name={pending.title}
              busy={state.busy}
              onCancel={() => setPending(null)}
              onConfirm={() => {
                setEditor(pending);
                setPending(null);
              }}
            />
          )}
          {list.items.length >= 100 && editor === "new" && (
            <div className="wishlist-limit">
              <h3>Tu lista tiene 100 regalos</h3>
              <p>
                Puedes editar tus ideas o quitar alguna antes de añadir otra.
              </p>
            </div>
          )}
          <GiftForm
            key={editor === "new" ? `new-${formKey}` : editor.id}
            eventId={event.id}
            gift={editor === "new" ? undefined : editor}
            busy={state.busy || (list.items.length >= 100 && editor === "new")}
            onSave={saveGift}
            onDirtyChange={setDirty}
            onCancel={resetEditor}
          />
        </aside>
      </div>
    </section>
  );
}
