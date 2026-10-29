"use client";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { api } from "@/lib/api/client";
import type { Event } from "@/lib/events/types";

export function useMapAddress(
  draft: Event,
  setDraft: Dispatch<SetStateAction<Event>>,
  manual = false,
) {
  const [attempt, setAttempt] = useState(0);
  const [resolvingMap, setResolvingMap] = useState(false);
  const [mapStatus, setMapStatus] = useState("");
  useEffect(() => {
    const url = draft.mapUrl.trim();
    if (manual || draft.isVirtual || !url || draft.location.trim()) return;
    let active = true;
    const timer = window.setTimeout(async () => {
      setResolvingMap(true);
      setMapStatus("Buscando la dirección del enlace…");
      try {
        const result = await api<{
          address: string;
          latitude?: number;
          longitude?: number;
        }>("/api/backend/maps/resolve", "POST", { url });
        if (active) {
          setDraft((current) =>
            current.mapUrl.trim() === url &&
            !current.isVirtual &&
            !current.location.trim()
              ? {
                  ...current,
                  location: result.address,
                  celebration: current.celebration
                    ? {
                        ...current.celebration,
                        mapLatitude: result.latitude,
                        mapLongitude: result.longitude,
                      }
                    : current.celebration,
                }
              : current,
          );
          setMapStatus(
            "Ubicación encontrada automáticamente. © OpenStreetMap contributors",
          );
        }
      } catch (err) {
        if (active)
          setMapStatus(
            "No pudimos obtener la ubicación. Reintenta o pega otro enlace de Google Maps. " +
              (err as Error).message.replace(/Escríbela manualmente.*$/, ""),
          );
      } finally {
        if (active) setResolvingMap(false);
      }
    }, 650);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [
    draft.mapUrl,
    draft.isVirtual,
    draft.location,
    attempt,
    setDraft,
    manual,
  ]);
  return {
    resolvingMap: resolvingMap && !draft.location && !manual,
    mapStatus: manual ? "" : mapStatus,
    setMapStatus,
    retry: () => setAttempt((n) => n + 1),
  };
}
