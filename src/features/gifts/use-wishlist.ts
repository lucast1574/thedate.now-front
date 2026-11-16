"use client";
import { useTranslator } from "@/lib/i18n/react";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api/client";
import {
  emptyWishlist,
  type Wishlist,
  type WishlistOwner,
} from "@/lib/events/wishlist";
export function useWishlist(id: string) {
  const i18n = useTranslator();

  const submitting = useRef(false);
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<WishlistOwner>({
      list: emptyWishlist(),
      guests: {},
    }),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const load = useCallback(async () => {
    const next = await api<WishlistOwner>(
      `/api/backend/events/${id}/wishlist`,
      undefined,
      undefined,
      i18n,
    );
    setData((current) =>
      next.list.version >= current.list.version ? next : current,
    );
    setReady(true);
    setError("");
  }, [id, i18n]);
  useEffect(() => {
    let active = true;
    void api<WishlistOwner>(
      `/api/backend/events/${id}/wishlist`,
      undefined,
      undefined,
      i18n,
    )
      .then((next) => {
        if (active) {
          setData(next);
          setReady(true);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    const timer = window.setInterval(() => {
      void load().catch(() => {});
    }, 15000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [id, load, i18n]);
  async function save(list: Wishlist) {
    if (submitting.current || !ready) return false;
    submitting.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const next = await api<Wishlist>(
        `/api/backend/events/${id}/wishlist`,
        "PATCH",
        list,
        i18n,
      );
      setData((current) =>
        next.version >= current.list.version
          ? { ...current, list: next }
          : current,
      );
      setNotice(i18n("Lista guardada."));
      return true;
    } catch (e) {
      await load().catch(() => {});
      setError((e as Error).message);
      return false;
    } finally {
      setBusy(false);
      submitting.current = false;
    }
  }
  async function reservation(
    gift: string,
    action: "release" | "delivered" | "pending",
  ) {
    if (submitting.current || !ready) return;
    submitting.current = true;
    setBusy(true);
    setError("");
    try {
      const list = await api<Wishlist>(
        `/api/backend/events/${id}/wishlist/reservations/${gift}`,
        "PATCH",
        { version: data.list.version, action },
        i18n,
      );
      setData((current) =>
        list.version >= current.list.version ? { ...current, list } : current,
      );
      setNotice(
        action === "release"
          ? i18n("Reserva liberada.")
          : i18n("Entrega actualizada."),
      );
    } catch (e) {
      await load().catch(() => {});
      setError((e as Error).message);
    } finally {
      setBusy(false);
      submitting.current = false;
    }
  }
  return { data, loading, ready, busy, error, notice, load, save, reservation };
}
