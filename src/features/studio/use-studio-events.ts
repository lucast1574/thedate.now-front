"use client";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { blankEvent, eventPayload, normalizeEvent } from "@/lib/events/draft";
import type { Event, Guest, Kind, User } from "@/lib/events/types";

export function useStudioEvents(
  portal: Kind,
  user: User | null,
  onError: (message: string) => void,
) {
  const requested = useSearchParams().get("event");
  const creating = useSearchParams().get("new") === "1";
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [selected, setSelected] = useState<Event | null>(null);
  const [draft, setDraft] = useState<Event>(() => blankEvent(portal));
  const [guests, setGuests] = useState<Guest[]>([]);

  const refreshEvents = useCallback(async () => {
    const list = (await api<Event[]>("/api/backend/events")).filter(
      (event) => event.kind === portal,
    );
    setEvents(list);
    return list;
  }, [portal]);

  useEffect(() => {
    if (!user) return;
    let active = true;
    api<Event[]>("/api/backend/events")
      .then((all) => {
        if (!active) return;
        const list = all.filter((event) => event.kind === portal);
        const demo = list.find((event) => event.id === requested);
        setEvents(list);
        setSelected(demo ?? null);
        setDraft(
          demo
            ? normalizeEvent(demo)
            : { ...blankEvent(portal), organizer: user.name },
        );
        setGuests([]);
      })
      .catch((err) => {
        if (active) onError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, portal, requested, creating, onError]);

  async function refreshGuests(event: Event) {
    setGuests(await api<Guest[]>(`/api/backend/events/${event.id}/guests`));
  }
  async function select(event: Event) {
    setSelected(event);
    setDraft(normalizeEvent(event));
    if (
      event.isDemo ||
      event.paymentStatus !== "paid" ||
      (event.ownerId !== user?.id && user?.role !== "admin")
    )
      setGuests([]);
    else await refreshGuests(event);
  }
  function createDraft() {
    setSelected(null);
    setDraft({ ...blankEvent(portal), organizer: user?.name ?? "" });
    setGuests([]);
  }
  async function saveEvent() {
    if (selected) {
      await api(
        `/api/backend/events/${selected.id}`,
        "PATCH",
        eventPayload(draft),
      );
      const list = await refreshEvents();
      setSelected(list.find((event) => event.id === selected.id) ?? selected);
    } else {
      const created = await api<Event>(
        "/api/backend/events",
        "POST",
        eventPayload(draft),
      );
      await refreshEvents();
      await select(created);
    }
  }
  async function reloadSelected() {
    const list = await refreshEvents();
    const updated = list.find((event) => event.id === selected?.id);
    if (updated) {
      setSelected(updated);
    }
  }
  function reset() {
    setLoading(true);
    setEvents([]);
    createDraft();
  }
  return {
    events,
    loading,
    selected,
    draft,
    setDraft,
    guests,
    select,
    createDraft,
    saveEvent,
    refreshGuests,
    reloadSelected,
    reset,
  };
}
