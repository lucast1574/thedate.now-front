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
    try {
      const next = await api<GuestWishlist>(`/api/gifts/${token}`, "POST", {
        giftId,
        release,
      });
      setData((current) => (next.version >= current.version ? next : current));
      setNotice(
        release
          ? "Tu elección se liberó. Ya puedes escoger otro regalo."
          : "Este regalo quedó reservado para ti. ¡Gracias por ser parte!",
      );
      return true;
    } catch (e) {
      setError((e as Error).message);
      await refresh().catch(() => {});
      return false;
    } finally {
      setBusy(false);
      submitting.current = false;
    }
  }
  return { data, busy, error, notice, choose, refresh };
}
