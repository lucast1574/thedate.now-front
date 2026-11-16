import { useEffect, useRef, useState } from "react";
import { useTranslator } from "@/lib/i18n/react";
import { api } from "@/lib/api/client";

export default function ConversationSync({
  eventId,
  guestId,
  sent,
  onSynced,
}: {
  eventId: string;
  guestId: string;
  sent: boolean;
  onSynced: () => void;
}) {
  const i18n = useTranslator();
  const [state, setState] = useState<"syncing" | "ready" | "retry">("syncing");
  const synced = useRef(onSynced);
  useEffect(() => {
    synced.current = onSynced;
  }, [onSynced]);
  useEffect(() => {
    if (!sent) return;
    let active = true,
      running = false,
      lastAttempt = 0;
    async function sync() {
      if (
        !active ||
        running ||
        document.hidden ||
        Date.now() - lastAttempt < 45000
      )
        return;
      running = true;
      lastAttempt = Date.now();
      setState("syncing");
      try {
        await api(
          `/api/backend/events/${eventId}/conversations/${guestId}/history`,
          "POST",
          {},
          i18n,
        );
        if (active) {
          setState("ready");
          synced.current();
        }
      } catch {
        if (active) setState("retry");
      } finally {
        running = false;
      }
    }
    void sync();
    const timer = window.setInterval(() => void sync(), 60000);
    const resume = () => {
      if (!document.hidden) void sync();
    };
    window.addEventListener("focus", resume);
    document.addEventListener("visibilitychange", resume);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", resume);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [eventId, guestId, sent, i18n]);
  if (!sent) return null;
  return (
    <span className="inbox-sync" role="status" aria-live="polite">
      {state === "syncing"
        ? i18n("Actualizando mensajes…")
        : state === "retry"
          ? i18n("La actualización se reintentará automáticamente.")
          : i18n("Los mensajes se actualizan automáticamente.")}
    </span>
  );
}
