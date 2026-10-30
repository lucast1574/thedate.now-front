import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api/client";
import type { Gift } from "@/lib/events/wishlist";
type Metadata = {
  title: string;
  imageUrl: string;
  description: string;
  url?: string;
};
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
  const autoAttempted = useRef(gift?.url.trim() || "");
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
  const lookup = useCallback(async () => {
    autoAttempted.current = draft.url.trim();
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
      autoAttempted.current = result.url || before.url.trim();
      const previous = imported.current;
      imported.current = result;
      setDraft((value) => ({
        ...value,
        url: value.url === before.url ? result.url || value.url : value.url,
        title:
          value.title === before.title &&
          (!before.title || before.title === previous?.title)
            ? result.title || value.title
            : value.title,
        imageUrl:
          value.imageUrl === before.imageUrl &&
          (!before.imageUrl || before.imageUrl === previous?.imageUrl)
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
          "La tienda no compartió la ficha del producto. Tu enlace se conserva; completa el nombre y añade una imagen.",
        );
    } finally {
      if (current === attempt.current) setFetching(false);
    }
  }, [draft, eventId]);
  useEffect(() => {
    const raw = draft.url.trim();
    if (!raw || raw === autoAttempted.current) return;
    try {
      const url = new URL(raw);
      if (url.protocol !== "https:" || url.username || url.password) return;
    } catch {
      return;
    }
    const timer = setTimeout(() => {
      if (autoAttempted.current !== raw) void lookup();
    }, 700);
    return () => clearTimeout(timer);
  }, [draft.url, lookup]);
  return { draft, setDraft, fetching, hint, changeURL, lookup };
}
