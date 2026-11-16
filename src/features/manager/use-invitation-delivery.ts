"use client";
import { useTranslator } from "@/lib/i18n/react";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { api } from "@/lib/api/client";

export type Delivery = {
  deploymentPhase?: string;
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
  const i18n = useTranslator();

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
          undefined,
          undefined,
          i18n,
        );
        if (!active) return;
        if (value.phase === "preparing") {
          const deployment = await api<{ phase: string }>(
            `/api/backend/events/${eventId}/deployment`,
            undefined,
            undefined,
            i18n,
          ).catch(() => null);
          if (!active) return;
          value.deploymentPhase = deployment?.phase;
        }
        setDelivery(value);
        setError("");
        const signature = JSON.stringify(value);
        if (previous && signature !== previous) await update();
        previous = signature;
      } catch {
        if (active)
          setError(
            i18n(
              "No pudimos consultar el envío. Estamos intentando reconectar.",
            ),
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
  }, [eventId, i18n]);
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
          undefined,
          i18n,
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
