import { useEffect, useRef, useState, type FormEvent } from "react";
import Icon from "@/components/icon";
import type { Gift } from "@/lib/events/wishlist";
import GiftFormPreview from "./gift-form-preview";
import GiftFormActions from "./gift-form-actions";
import { useGiftDraft } from "./use-gift-draft";
export default function GiftForm({
  eventId,
  gift,
  busy,
  onSave,
  onCancel,
  onDirtyChange,
}: {
  eventId: string;
  gift?: Gift;
  busy: boolean;
  onSave: (gift: Gift) => Promise<boolean>;
  onCancel: () => void;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const { draft, setDraft, fetching, hint, changeURL, lookup } = useGiftDraft(
    eventId,
    gift,
  );
  const urlInput = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (gift && window.matchMedia("(max-width: 1150px)").matches) {
      urlInput.current?.closest("aside")?.scrollIntoView({ block: "start" });
    }
    urlInput.current?.focus({ preventScroll: true });
  }, [gift]);
  const [imageEditing, setImageEditing] = useState(false);
  const dirty = ["url", "title", "imageUrl", "description"].some(
    (field) =>
      (draft[field as keyof Gift] || "") !==
      (gift?.[field as keyof Gift] || ""),
  );
  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);
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
    <form
      className="gift-form gift-composer-form"
      onSubmit={(e) => void submit(e)}
    >
      <header>
        <span className="gift-composer-icon">
          <Icon name={gift ? "lucide:pencil" : "plus"} />
        </span>
        <div>
          <h3>{gift ? "Editar regalo" : "Añade una nueva idea"}</h3>
          <p>
            {gift
              ? "Actualiza sus detalles antes de guardar."
              : "Pega el enlace. Buscamos los datos por ti."}
          </p>
        </div>
      </header>
      <div className="gift-form-fields">
        <div className="gift-import-row">
          <label>
            Enlace del producto
            <input
              ref={urlInput}
              required
              type="url"
              pattern="https://.*"
              maxLength={2048}
              value={draft.url}
              disabled={busy}
              onChange={(e) => changeURL(e.target.value)}
              placeholder="https://tienda.com/producto"
            />
          </label>
          <button
            type="button"
            className="gift-secondary"
            disabled={fetching || !draft.url || busy}
            onClick={() => void lookup()}
          >
            <Icon name="lucide:link" />
            {fetching ? "Buscando…" : "Buscar datos"}
          </button>
        </div>
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
            placeholder="Por ejemplo, una cafetera"
          />
        </label>
        {(draft.title || draft.imageUrl) && <GiftFormPreview gift={draft} />}
        <button
          type="button"
          className="gift-image-toggle"
          aria-expanded={imageEditing}
          disabled={busy}
          onClick={() => setImageEditing(!imageEditing)}
        >
          <Icon name="image" />
          {imageEditing
            ? "Cerrar imagen"
            : draft.imageUrl
              ? "Cambiar imagen"
              : "Añadir imagen (opcional)"}
        </button>
        {imageEditing && (
          <label>
            Enlace de la imagen
            <input
              type="url"
              pattern="https://.*"
              maxLength={2048}
              value={draft.imageUrl || ""}
              disabled={busy}
              onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
              placeholder="https://… imagen del producto"
            />
            <small>Úsalo si la tienda no comparte una imagen.</small>
          </label>
        )}
        <label>
          Nota para tus invitados <small>Opcional</small>
          <textarea
            maxLength={1000}
            rows={2}
            value={draft.description || ""}
            disabled={busy}
            onChange={(e) =>
              setDraft({ ...draft, description: e.target.value })
            }
            placeholder="Color, modelo o algún detalle especial…"
          />
        </label>
      </div>
      <GiftFormActions
        busy={busy}
        fetching={fetching}
        editing={!!gift}
        dirty={dirty}
        onCancel={onCancel}
      />
      <p className="gift-composer-footnote">
        <Icon name="lucide:shopping-bag" />
        El invitado reserva en tu lista y compra en la tienda.
      </p>
    </form>
  );
}
