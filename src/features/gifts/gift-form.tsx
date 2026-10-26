import { useRef, useState, type FormEvent } from "react";
import Icon from "@/components/icon";
import { api } from "@/lib/api/client";
import type { Gift } from "@/lib/events/wishlist";
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
  const [draft, setDraft] = useState<Gift>(
    gift || {
      id: crypto.randomUUID(),
      title: "",
      url: "",
      imageUrl: "",
      description: "",
      delivered: false,
    },
  );
  const [fetching, setFetching] = useState(false),
    [hint, setHint] = useState("");
  const attempt = useRef(0);
  async function lookup() {
    const current = ++attempt.current;
    setFetching(true);
    setHint("");
    try {
      const result = await api<{
        title: string;
        imageUrl: string;
        description: string;
      }>(`/api/backend/events/${eventId}/wishlist/metadata`, "POST", {
        url: draft.url,
      });
      if (current === attempt.current) {
        setDraft((value) => ({
          ...value,
          title: result.title || value.title,
          imageUrl: result.imageUrl || value.imageUrl,
        }));
        setHint(
          result.title
            ? "Datos encontrados. Revisa el nombre y la imagen antes de añadirlo."
            : "La tienda no compartió todos los datos. Puedes completarlos aquí.",
        );
      }
    } catch (e) {
      if (current === attempt.current) setHint((e as Error).message);
    } finally {
      if (current === attempt.current) setFetching(false);
    }
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    await onSave(draft);
  }
  return (
    <form className="gift-form" onSubmit={(e) => void submit(e)}>
      <header>
        <h3>{gift ? "Editar regalo" : "Añadir un regalo"}</h3>
        <button
          type="button"
          aria-label="Cerrar formulario de regalo"
          onClick={onCancel}
        >
          <Icon name="close" />
        </button>
      </header>
      <label>
        Enlace del artículo
        <input
          required
          type="url"
          maxLength={2048}
          value={draft.url}
          onChange={(e) => {
            attempt.current++;
            setFetching(false);
            setDraft({ ...draft, url: e.target.value });
          }}
          placeholder="Mercado Libre, Falabella, tu tienda favorita…"
        />
      </label>
      <button
        type="button"
        className="gift-secondary"
        disabled={fetching || !draft.url || busy}
        onClick={() => void lookup()}
      >
        <Icon name="lucide:link" />
        {fetching ? "Leyendo el artículo…" : "Buscar nombre e imagen"}
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
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder="¿Qué te gustaría recibir?"
        />
      </label>
      <details>
        <summary>Imagen y descripción</summary>
        <label>
          Enlace de la imagen (opcional)
          <input
            type="url"
            maxLength={2048}
            value={draft.imageUrl || ""}
            onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
          />
        </label>
        <label>
          Una nota para tus invitados
          <textarea
            maxLength={1000}
            rows={2}
            value={draft.description || ""}
            onChange={(e) =>
              setDraft({ ...draft, description: e.target.value })
            }
          />
        </label>
      </details>
      <div className="gift-form-actions">
        <button type="button" className="gift-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button className="gift-primary" disabled={busy || fetching}>
          {busy ? "Guardando…" : gift ? "Guardar cambios" : "Añadir a la lista"}
        </button>
      </div>
    </form>
  );
}
