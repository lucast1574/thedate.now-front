"use client";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useEventRecency } from "@/features/studio/use-event-recency";
import { api } from "@/lib/api/client";
import { blankEvent, eventPayload, normalizeEvent } from "@/lib/events/draft";
import type { Event, Guest, Kind, User } from "@/lib/events/types";
import { suggestedAddress } from "@/lib/events/event-form";
import { initialInvitation } from "./initial-invitation";

export function useStudioEvents(
  portal: Kind,
  user: User | null,
  onError: (message: string) => void,
) {
  const requested = useSearchParams().get("event");
  const demoId = useSearchParams().get("demo");
  const creating = useSearchParams().get("new") === "1";
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [selected, setSelected] = useState<Event | null>(null);
  const [draft, setDraft] = useState<Event>(() => blankEvent(portal));
  const [guests, setGuests] = useState<Guest[]>([]);

  useEventRecency(user?.id, portal, selected?.id);

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
        const sourceDemo = list.find(
          (event) =>
            event.id === demoId && event.isDemo && event.ownerId === user.id,
        );
        const demo = list.find((event) => event.id === requested);
        setEvents(list);
        setSelected(demo ?? null);
        setDraft(
          sourceDemo
            ? {
                ...normalizeEvent(sourceDemo),
                slug: suggestedAddress(sourceDemo.title),
                isDemo: true,
              }
            : demo
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
  }, [user, portal, requested, creating, demoId, onError]);

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
        draft.isDemo
          ? `/api/backend/events/${draft.id}/activate`
          : "/api/backend/events",
        "POST",
        draft.isDemo ? eventPayload(draft) : initialInvitation(draft),
      );
      await refreshEvents();
      await select(created);
      return created;
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
