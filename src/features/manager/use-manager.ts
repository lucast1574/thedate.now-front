"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api/client";
import type { Event, Guest, GuestFields, User } from "@/lib/events/types";
import { emptyPlan, type SeatingPlan } from "@/lib/events/seating";
export function useManager(id: string) {
  const [event, setEvent] = useState<Event | null>(null),
    [user, setUser] = useState<User | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]),
    [plan, setPlan] = useState(emptyPlan);
  const [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false),
    [stale, setStale] = useState(false);
  const dirtyRef = useRef(false),
    versionRef = useRef(0);
  const refresh = useCallback(
    async (discard = false) => {
      const [list, remote, events] = await Promise.all([
        api<Guest[]>(`/api/backend/events/${id}/guests`),
        api<SeatingPlan>(`/api/backend/events/${id}/seating`),
        api<Event[]>("/api/backend/events"),
      ]);
      const latest = events.find((e) => e.id === id);
      if (latest) setEvent(latest);
      setGuests(list);
      if (!dirtyRef.current || discard) {
        setPlan(remote);
        versionRef.current = remote.version;
        setDirty(false);
        dirtyRef.current = false;
        setStale(false);
      } else if (remote.version !== versionRef.current) setStale(true);
    },
    [id],
  );
  useEffect(() => {
    let active = true;
    Promise.all([
      api<Event[]>("/api/backend/events"),
      api<User>("/api/session"),
    ])
      .then(async ([list, current]) => {
        if (!active) return;
        const found = list.find((e) => e.id === id);
        if (!found) throw new Error("No tienes acceso a este evento.");
        setEvent(found);
        setUser(current);
        if (!found.isDemo && found.paymentStatus === "paid") await refresh();
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [id, refresh]);
  useEffect(() => {
    if (!event || event.isDemo || event.paymentStatus !== "paid") return;
    const timer = setInterval(() => {
      void refresh().catch((e) => setError(e.message));
    }, 15000);
    return () => clearInterval(timer);
  }, [event, refresh]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function update(next: SeatingPlan) {
    setPlan(next);
    setDirty(true);
    dirtyRef.current = true;
  }
  async function run(task: () => Promise<unknown>, message: string) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await task();
      setNotice(message);
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  const save = () =>
    run(async () => {
      const saved = await api<SeatingPlan>(
        `/api/backend/events/${id}/seating`,
        "PATCH",
        plan,
      );
      setPlan(saved);
      versionRef.current = saved.version;
      setDirty(false);
      dirtyRef.current = false;
      setStale(false);
      await refresh();
    }, "Plano guardado.");
  const add = (fields: GuestFields) =>
    run(async () => {
      await api(`/api/backend/events/${id}/guests`, "POST", fields);
      await refresh();
    }, "Invitado añadido.");
  const send = () =>
    run(async () => {
      const result = await api<{
        sent: number;
        failed: number;
        uncertain: number;
        remaining: number;
      }>(`/api/backend/events/${id}/send-invitations`, "POST");
      await refresh();
      if (result.failed || result.uncertain || result.remaining)
        throw new Error(
          `${result.sent} enviadas; ${result.failed} fallidas; ${result.uncertain} entregas por revisar; ${result.remaining} pendientes.`,
        );
    }, "Invitaciones enviadas por WhatsApp.");
  return {
    event,
    user,
    guests,
    plan,
    error,
    notice,
    busy,
    dirty,
    stale,
    update,
    save,
    add,
    send,
    refresh,
    run,
  };
}
