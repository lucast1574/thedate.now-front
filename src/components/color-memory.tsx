"use client";
import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { recentColors, rememberColor } from "@/lib/ui/color";
const UserColors = createContext<string | null>(null);
const empty: string[] = [];
const cache = new Map<string, { raw: string | null; colors: string[] }>();
const changeEvent = "thedate-colors-changed";
function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(changeEvent, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(changeEvent, listener);
  };
}
function snapshot(key: string | null) {
  if (!key) return empty;
  try {
    const raw = localStorage.getItem(key),
      previous = cache.get(key);
    if (previous?.raw === raw) return previous.colors;
    const colors = recentColors(raw ? JSON.parse(raw) : []);
    cache.set(key, { raw, colors });
    return colors;
  } catch {
    return cache.get(key)?.colors || empty;
  }
}
export function ColorMemoryProvider({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  return (
    <UserColors.Provider
      value={userId ? `thedate:recent-colors:${userId}` : null}
    >
      {children}
    </UserColors.Provider>
  );
}
export function useColorMemory() {
  const key = useContext(UserColors);
  const colors = useSyncExternalStore(
    subscribe,
    () => snapshot(key),
    () => empty,
  );
  function remember(value: string) {
    if (!key) return;
    const next = rememberColor(snapshot(key), value);
    const raw = JSON.stringify(next);
    let stored = cache.get(key)?.raw || null;
    try {
      localStorage.setItem(key, raw);
      stored = raw;
    } catch {
      /* Private mode still allows editing. */
    }
    cache.set(key, { raw: stored, colors: next });
    window.dispatchEvent(new Event(changeEvent));
  }
  return { colors, remember };
}
