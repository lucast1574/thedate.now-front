import { useEffect, useRef } from "react";
import { recoveryKey } from "./silent-recovery";
import { api } from "@/lib/api/client";
import type { DesignEvent } from "@/lib/events/types";
import { designPayload, sameDesign } from "./design-state";
import { validDesignDressColors } from "@/lib/events/dress-code";
import { validMapLink } from "@/lib/events/location-element";

export function useSilentDesign(
  draft: DesignEvent,
  event: DesignEvent,
  onError: (message: string) => void,
) {
  const latest = useRef(draft);
  const saved = useRef(event);
  const version = useRef(event.designVersion || 0);
  const running = useRef<Promise<boolean> | null>(null);
  useEffect(() => {
    latest.current = draft;
    try {
      localStorage.setItem(
        recoveryKey(draft.id),
        JSON.stringify({ version: version.current, draft }),
      );
    } catch {
      /* Remote saving remains available without local storage. */
    }
  }, [draft]);
  async function persist() {
    try {
      while (!sameDesign(latest.current, saved.current)) {
        const snapshot = latest.current;
        const sections = snapshot.sections || [];
        if (!validDesignDressColors(sections))
          throw new Error(
            "Revisa los nombres y colores del dress code para guardar tus cambios.",
          );
        if (
          sections.some((s) =>
            s.canvas?.elements.some(
              (item) =>
                item.binding === "location" &&
                !item.eventBound &&
                item.link &&
                !validMapLink(item.link),
            ),
          )
        )
          throw new Error(
            "Revisa el enlace de Google Maps para guardar tus cambios.",
          );
        const result = await api<{ designVersion: number }>(
          `/api/backend/events/${snapshot.id}/design`,
          "PATCH",
          { ...designPayload(snapshot), expectedVersion: version.current },
        );
        version.current = result.designVersion;
        saved.current = snapshot;
        try {
          localStorage.setItem(
            recoveryKey(snapshot.id),
            JSON.stringify({ version: version.current, draft: latest.current }),
          );
        } catch {
          /* The server has already saved this design. */
        }
      }
      onError("");
      return true;
    } catch (error) {
      onError(`No pudimos guardar tus cambios. ${(error as Error).message}`);
      return false;
    }
  }
  function save(): Promise<boolean> {
    if (running.current) return running.current;
    const pending = persist().finally(() => {
      running.current = null;
    });
    running.current = pending;
    return pending;
  }
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void save();
    }, 800);
    const resume = () => {
      void save();
    };
    const leave = () => {
      if (document.visibilityState === "hidden") void save();
    };
    window.addEventListener("online", resume);
    document.addEventListener("visibilitychange", leave);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("online", resume);
      document.removeEventListener("visibilitychange", leave);
    };
  });
  async function publish() {
    if (!event.publishedAt) return false;
    if (!(await save())) return false;
    try {
      await api(`/api/backend/events/${event.id}/design/publish`, "POST", {
        expectedVersion: version.current,
      });
      return true;
    } catch (error) {
      onError((error as Error).message);
      return false;
    }
  }
  return { save, publish };
}
