import type { FormEvent } from "react";
import Icon from "@/components/icon";
import type { Gift } from "@/lib/events/wishlist";
import GiftFormPreview from "./gift-form-preview";
import { useGiftDraft } from "./use-gift-draft";
export default function GiftForm({
  eventId,
  gift,
  busy,
  onSave,
  onCancel,
}: {
  eventId: string;
  gift?: Gift;
  busy: boolean;
  onSave: (gift: Gift) => Promise<boolean>;
  onCancel: () => void;
}) {
  const { draft, setDraft, fetching, hint, changeURL, lookup } = useGiftDraft(
    eventId,
    gift,
  );
  async function submit(e: FormEvent) {
    e.preventDefault();
    await onSave({
      ...draft,
      url: draft.url.trim(),
      title: draft.title.trim(),
      imageUrl: draft.imageUrl?.trim(),
    });
  }
  return (
    <form className="gift-form" onSubmit={(e) => void submit(e)}>
      <header>
        <h3>{gift ? "Editar regalo" : "Añadir un regalo"}</h3>
        <button
          type="button"
          aria-label="Cerrar formulario de regalo"
          disabled={busy}
          onClick={onCancel}
        >
          <Icon name="close" />
        </button>
      </header>
      <div className="gift-form-layout">
        <div className="gift-form-fields">
          <label>
            Enlace del producto
            <input
              required
              type="url"
              pattern="https://.*"
              maxLength={2048}
              value={draft.url}
              disabled={busy}
              onChange={(e) => changeURL(e.target.value)}
              placeholder="https://… enlace de Saga, Mercado Libre o Coolbox"
            />
          </label>
          <button
            type="button"
            className="gift-secondary"
            disabled={fetching || !draft.url || busy}
            onClick={() => void lookup()}
          >
            <Icon name="lucide:link" />
            {fetching ? "Leyendo el producto…" : "Obtener nombre e imagen"}
          </button>
          {hint && (
            <p role="status" className="gift-form-hint">
              {hint}
            </p>
          )}
          <label>
            Nombre del regalo
            <input
              required
              minLength={2}
              maxLength={240}
              value={draft.title}
              disabled={busy}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="Nombre y modelo del producto"
            />
          </label>
          <label>
            Enlace de la imagen{" "}
            <small>Opcional, si la tienda no la comparte</small>
            <input
              type="url"
              pattern="https://.*"
              maxLength={2048}
              value={draft.imageUrl || ""}
              disabled={busy}
              onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
              placeholder="https://… imagen del producto"
            />
          </label>
          <label>
            Una nota para tus invitados
            <textarea
              maxLength={1000}
              rows={3}
              value={draft.description || ""}
              disabled={busy}
              onChange={(e) =>
                setDraft({ ...draft, description: e.target.value })
              }
              placeholder="Color, tamaño o por qué te gustaría…"
            />
          </label>
        </div>
        <GiftFormPreview gift={draft} />
      </div>
      <div className="gift-form-actions">
        <button
          type="button"
          className="gift-secondary"
          disabled={busy}
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button className="gift-primary" disabled={busy || fetching}>
          {busy ? "Guardando…" : gift ? "Guardar cambios" : "Añadir a la lista"}
        </button>
      </div>
    </form>
  );
}
