"use client";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { api } from "@/lib/api/client";
import type { Event } from "@/lib/events/types";

export function useMapAddress(
  draft: Event,
  setDraft: Dispatch<SetStateAction<Event>>,
  savedMapURL?: string,
) {
  const [resolvingMap, setResolvingMap] = useState(false);
  const [mapStatus, setMapStatus] = useState("");
  useEffect(() => {
    const url = draft.mapUrl.trim();
    if (draft.isVirtual || !url || url === savedMapURL) return;
    let active = true;
    const timer = window.setTimeout(async () => {
      setResolvingMap(true);
      setMapStatus("Buscando la dirección del enlace…");
      try {
        const result = await api<{ address: string }>(
          "/api/backend/maps/resolve",
          "POST",
          { url },
        );
        if (active) {
          setDraft((current) =>
            current.mapUrl.trim() === url &&
            !current.isVirtual &&
            !current.location.trim()
              ? { ...current, location: result.address }
              : current,
          );
          setMapStatus(
            "Dirección encontrada. Revísala antes de guardar. © OpenStreetMap contributors",
          );
        }
      } catch (err) {
        if (active) setMapStatus((err as Error).message);
      } finally {
        if (active) setResolvingMap(false);
      }
    }, 650);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [draft.mapUrl, draft.isVirtual, savedMapURL, setDraft]);
  return { resolvingMap, mapStatus, setMapStatus };
}
