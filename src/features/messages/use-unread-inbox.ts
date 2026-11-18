import { useEffect, useState } from "react";
import { inboxUpdated } from "./inbox-updates";

export function useUnreadInbox(eventId?: string) {
  const [unread, setUnread] = useState<{ eventId: string; value: boolean }>();

  useEffect(() => {
    if (!eventId) return;
    let pending: AbortController | undefined;
    async function refresh() {
      if (document.hidden || !eventId) return;
      pending?.abort();
      const request = new AbortController();
      pending = request;
      try {
        const result = await fetch(
          `/api/backend/events/${encodeURIComponent(eventId)}/conversations?summary=unread`,
          { signal: request.signal },
        );
        if (!result.ok) return;
        const { unread } = (await result.json()) as { unread: boolean };
        if (!request.signal.aborted) setUnread({ eventId, value: unread });
      } catch {
        // Keep the last confirmed status until the next refresh.
      }
    }
    void refresh();
    const interval = window.setInterval(refresh, 12000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener(inboxUpdated, refresh);
    return () => {
      pending?.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener(inboxUpdated, refresh);
    };
  }, [eventId]);

  return unread?.eventId === eventId && unread?.value === true;
}
