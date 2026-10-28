"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api/client";
import type { Event, Guest, GuestFields, User } from "@/lib/events/types";
import { emptyPlan, type SeatingPlan } from "@/lib/events/seating";
import { useLiveResponses } from "./use-live-responses";
export function useManager(id: string) {
  const [event, setEvent] = useState<Event | null>(null),
    [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
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
        setEvents(list);
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
  useLiveResponses(
    Boolean(event && !event.isDemo && event.paymentStatus === "paid"),
    refresh,
    setError,
  );
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

  return {
    event,
    events,
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
    refresh,
    run,
  };
}
