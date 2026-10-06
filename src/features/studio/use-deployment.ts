"use client";
import { useEffect, useEffectEvent, useState } from "react";
import { api } from "@/lib/api/client";
export type Deployment = {
  eventId: string;
  phase: string;
  host: string;
  error?: string;
};
export function useDeployment(
  eventId: string | undefined,
  onReady: () => Promise<void>,
) {
  const [deployment, setDeployment] = useState<Deployment | null>(null);
  const ready = useEffectEvent(onReady);
  useEffect(() => {
    if (!eventId) return;
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      const result = await api<Deployment>(
        `/api/backend/events/${eventId}/deployment`,
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
  }, [eventId]);
  return {
    deployment: deployment?.eventId === eventId ? deployment : null,
    setDeployment,
  };
}
