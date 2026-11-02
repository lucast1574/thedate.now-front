"use client";
import { useClock } from "@/components/use-clock";
import { eventReadOnly } from "@/lib/events/event-closure";
import type { Event } from "@/lib/events/types";

export function useEventReadOnly(event?: Event | null) {
  return eventReadOnly(event, useClock());
}
