"use client";
import { useEffect, useSyncExternalStore } from "react";
import type { Kind } from "@/lib/events/types";

const changed = "thedate:event-opened";
function subscribe(update: () => void) {
  window.addEventListener(changed, update);
  return () => {
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
        return key
          ? (window.sessionStorage.getItem(key) ??
              window.localStorage.getItem(key) ??
              "")
          : "";
      } catch {
        return "";
      }
    },
    () => "",
  );
  useEffect(() => {
    if (!key || !openedId) return;
    try {
      if (window.sessionStorage.getItem(key) === openedId) return;
      window.sessionStorage.setItem(key, openedId);
      window.localStorage.setItem(key, openedId);
      window.dispatchEvent(new Event(changed));
    } catch {
      /* Sorting by creation still works when storage is unavailable. */
    }
  }, [key, openedId]);
  return lastOpened;
}
