import { useEffect, useState } from "react";
import type { DesignEvent } from "@/lib/events/types";
import { sameDesign } from "./design-state";
import { recoverDesign, recoveryKey, recoveryRecord } from "./design-recovery";

export function useDesignRecovery(
  event: DesignEvent,
  draft: DesignEvent,
  setDraft: (draft: DesignEvent) => void,
  dirty: boolean,
) {
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState<DesignEvent | null>(null);
  const [status, setStatus] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(recoveryKey(event));
        const recovered = raw ? recoverDesign(raw, event) : null;
        if (recovered && !sameDesign(recovered, event)) setPending(recovered);
      } catch {
        setStatus(
          "No se pudo leer la copia local. Guarda el diseño antes de salir.",
        );
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
    // Each editor is mounted for one event; refreshes must not reopen recovery.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!ready || pending) return;
    function persist() {
      try {
        if (dirty) {
          localStorage.setItem(
            recoveryKey(event),
            recoveryRecord(draft, event),
          );
          setStatus(
            "Copia guardada en este navegador · Pendiente de guardar diseño",
          );
        } else {
          localStorage.removeItem(recoveryKey(event));
          setStatus("");
        }
      } catch {
        setStatus(
          "No se pudo guardar la copia local. Guarda el diseño antes de salir.",
        );
      }
    }
    const timer = window.setTimeout(persist, 500);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") persist();
    };
    window.addEventListener("pagehide", persist);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pagehide", persist);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ready, pending, dirty, draft, event]);
  function resolve(restore: boolean) {
    if (restore && pending) setDraft(pending);
    setPending(null);
  }
  return { ready, pending, status, resolve };
}
