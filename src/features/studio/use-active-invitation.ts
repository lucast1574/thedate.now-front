"use client";
import { useTranslator } from "@/lib/i18n/react";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { api } from "@/lib/api/client";
import { galleryEvents } from "@/lib/events/studio-gallery";
import type { Event, Kind, User } from "@/lib/events/types";
import { useEventRecency } from "./use-event-recency";
import { eventReadOnly } from "@/lib/events/event-closure";

export function useActiveInvitation(user: User, kind: Kind, eventId?: string) {
  const i18n = useTranslator();

  const params = useParams();
  const query = useSearchParams();
  const explicit =
    eventId ||
    (typeof params.id === "string" ? params.id : "") ||
    query.get("event") ||
    "";
  const remembered = useEventRecency(user.id, kind);
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api<Event[]>("/api/backend/events", undefined, undefined, i18n)
      .then((list) => {
        if (active) setEvents(galleryEvents(list, user, kind));
      })
      .catch(() => {
        if (active) setError(i18n("No se pudieron cargar tus invitaciones."));
      });
    return () => {
      active = false;
    };
  }, [user, kind, i18n]);
  useEffect(() => {
    const timer = window.setInterval(
      () => setEvents((current) => [...current]),
      60000,
    );
    return () => window.clearInterval(timer);
  }, []);
  const available = events.filter((event) => !eventReadOnly(event));
  const real = available.filter((event) => !event.isDemo);
  const selected = explicit
    ? available.find((event) => event.id === explicit)
    : real.length === 1
      ? real[0]
      : available.find((event) => event.id === remembered);
  useEventRecency(user.id, kind, selected?.id);
  return { events: available, selected, error };
}
