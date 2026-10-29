"use client";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { api } from "@/lib/api/client";

export type Delivery = {
  phase:
    | "draft"
    | "preparing"
    | "sending"
    | "waiting"
    | "complete"
    | "attention"
    | "error";
  total: number;
  sent: number;
  waiting: number;
  failed: number;
  uncertain: number;
};
export function useInvitationDelivery(
  eventId: string,
  onUpdate: () => Promise<void>,
) {
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const request = useRef(false);
  const update = useEffectEvent(onUpdate);
  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    let previous = "";
    async function poll() {
      try {
        const value = await api<Delivery>(
          `/api/backend/events/${eventId}/delivery`,
        );
        if (!active) return;
        setDelivery(value);
        setError("");
        const signature = JSON.stringify(value);
        if (previous && signature !== previous) await update();
        previous = signature;
      } catch {
        if (active)
          setError(
            "No pudimos consultar el envío. Estamos intentando reconectar.",
          );
      } finally {
        if (active) timer = setTimeout(() => void poll(), 3000);
      }
    }
    void poll();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [eventId]);
  async function start(retry = false) {
    if (request.current) return;
    request.current = true;
    setBusy(true);
    setError("");
    try {
      setDelivery(
        await api<Delivery>(
          `/api/backend/events/${eventId}/delivery${retry ? "/retry" : ""}`,
          "POST",
        ),
      );
      await onUpdate();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      request.current = false;
      setBusy(false);
    }
  }
  return { delivery, busy, error, start };
}
