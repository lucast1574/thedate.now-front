import { useRef, useState } from "react";
import { api } from "@/lib/api/client";
import type { Gift } from "@/lib/events/wishlist";
type Metadata = { title: string; imageUrl: string; description: string };
export function useGiftDraft(eventId: string, gift?: Gift) {
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
  const imported = useRef<Metadata | null>(
    gift
      ? {
          title: gift.title,
          imageUrl: gift.imageUrl || "",
          description: gift.description || "",
        }
      : null,
  );
  function changeURL(url: string) {
    attempt.current++;
    setFetching(false);
    setHint("");
    setDraft((value) => ({
      ...value,
      url,
      title: value.title === imported.current?.title ? "" : value.title,
      imageUrl:
        value.imageUrl === imported.current?.imageUrl ? "" : value.imageUrl,
    }));
  }
  async function lookup() {
    const current = ++attempt.current;
    const before = draft;
    try {
      const url = new URL(draft.url.trim());
      if (url.protocol !== "https:" || url.username || url.password)
        throw new Error();
    } catch {
      setHint("Usa el enlace HTTPS completo del producto.");
      return;
    }
    setFetching(true);
    setHint("");
    try {
      const result = await api<Metadata>(
        `/api/backend/events/${eventId}/wishlist/metadata`,
        "POST",
        { url: draft.url.trim() },
      );
      if (current !== attempt.current) return;
      imported.current = result;
      setDraft((value) => ({
        ...value,
        title:
          value.title === before.title
            ? result.title || value.title
            : value.title,
        imageUrl:
          value.imageUrl === before.imageUrl
            ? result.imageUrl || value.imageUrl
            : value.imageUrl,
      }));
      setHint(
        result.title && result.imageUrl
          ? "Encontramos el producto. Revisa su ficha antes de guardarlo."
          : "La tienda compartió datos parciales. Completa el nombre o la imagen; puedes guardar el regalo igualmente.",
      );
    } catch {
      if (current === attempt.current)
        setHint(
          "Esta tienda no permite leer su ficha automáticamente. Puedes escribir el nombre y pegar una imagen aquí.",
        );
    } finally {
      if (current === attempt.current) setFetching(false);
    }
  }
  return { draft, setDraft, fetching, hint, changeURL, lookup };
}
