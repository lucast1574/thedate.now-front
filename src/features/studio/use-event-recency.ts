"use client";
import { useEffect, useSyncExternalStore } from "react";
import type { Kind } from "@/lib/events/types";

const changed = "thedate:event-opened";
function subscribe(update: () => void) {
  window.addEventListener("storage", update);
  window.addEventListener(changed, update);
  return () => {
    window.removeEventListener("storage", update);
    window.removeEventListener(changed, update);
  };
}
export function useEventRecency(
  userId?: string,
  kind?: Kind,
  openedId?: string,
) {
  const key = userId && kind ? `thedate:last-opened:${kind}:${userId}` : "";
  const lastOpened = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return key ? window.localStorage.getItem(key) || "" : "";
      } catch {
        return "";
      }
    },
    () => "",
  );
  useEffect(() => {
    if (!key || !openedId) return;
    try {
      if (window.localStorage.getItem(key) === openedId) return;
      window.localStorage.setItem(key, openedId);
      window.dispatchEvent(new Event(changed));
    } catch {
      /* Sorting by creation still works when storage is unavailable. */
    }
  }, [key, openedId]);
  return lastOpened;
}
