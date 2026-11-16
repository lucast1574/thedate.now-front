import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import { useTranslator } from "@/lib/i18n/react";
import type { GuestPayment } from "@/lib/events/admission";
export function useGuestPayments(eventId: string, enabled: boolean) {
  const i18n = useTranslator();
  const [payments, setPayments] = useState<GuestPayment[]>([]),
    [error, setError] = useState("");
  const [loading, setLoading] = useState(enabled);
  const refresh = useCallback(async () => {
    const list = await api<GuestPayment[]>(
      `/api/backend/events/${eventId}/guest-payments`,
      undefined,
      undefined,
      i18n,
    );
    setPayments(list);
    setLoading(false);
  }, [eventId, i18n]);
  useEffect(() => {
    if (!enabled) return;
    let active = true;
    api<GuestPayment[]>(
      `/api/backend/events/${eventId}/guest-payments`,
      undefined,
      undefined,
      i18n,
    )
      .then((list) => {
        if (active) setPayments(list);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [enabled, eventId, i18n]);
  return { payments, refresh, loading, error };
}
