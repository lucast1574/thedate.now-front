"use client";
import { useTranslator } from "@/lib/i18n/react";

import { useEffect, useEffectEvent, useState } from "react";
import { api } from "@/lib/api/client";
export type Deployment = {
  eventId: string;
  phase: string;
  host?: string;
  error?: string;
};
export function useDeployment(
  eventId: string | undefined,
  onReady: () => Promise<void>,
) {
  const i18n = useTranslator();

  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const ready = useEffectEvent(onReady);
  useEffect(() => {
    if (!eventId) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      const result = await api<Deployment>(
        `/api/backend/events/${eventId}/deployment`,
        undefined,
        undefined,
        i18n,
      ).catch(() => null);
      if (!active) return;
      if (result) setDeployment(result);
      if (result?.phase === "ready") {
        try {
          await ready();
        } catch {
          timer = setTimeout(() => void poll(), 3000);
        }
        return;
      }
      timer = setTimeout(() => void poll(), 3000);
    }
    void poll();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [eventId, i18n]);
  return {
    deployment: deployment?.eventId === eventId ? deployment : null,
    setDeployment,
  };
}
