"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api/client";
import type { GuestWishlist } from "@/lib/events/wishlist";
export function useGuestWishlist(token: string, initial: GuestWishlist) {
  const submitting = useRef(false);
  const [data, setData] = useState(initial),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const refresh = useCallback(async () => {
    const next = await api<GuestWishlist>(`/api/gifts/${token}`);
    setData((current) => (next.version >= current.version ? next : current));
    return next;
  }, [token]);
  useEffect(() => {
    const update = () => {
      void refresh().catch(() => {});
    };
    window.addEventListener("focus", update);
    document.addEventListener("visibilitychange", update);
    const timer = window.setInterval(update, 20000);
    return () => {
      window.removeEventListener("focus", update);
      document.removeEventListener("visibilitychange", update);
      window.clearInterval(timer);
    };
  }, [refresh]);
  async function choose(giftId: string, release = false) {
    if (submitting.current) return false;
    submitting.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    const successNotice = release
      ? "Tu elección se liberó. Ya puedes escoger otro regalo."
      : "Este regalo quedó reservado para ti. ¡Gracias por ser parte!";
    try {
      const next = await api<GuestWishlist>(`/api/gifts/${token}`, "POST", {
        giftId,
        release,
      });
      setData((current) => (next.version >= current.version ? next : current));
      setNotice(successNotice);
      return true;
    } catch (e) {
      const latest = await refresh().catch(() => null);
      const item = latest?.items.find((item) => item.id === giftId);
      if (item && (release ? !item.mine : item.mine)) {
        setNotice(successNotice);
        return true;
      }
      setError((e as Error).message);
      return false;
    } finally {
      setBusy(false);
      submitting.current = false;
    }
  }
  return { data, busy, error, notice, choose, refresh };
}
