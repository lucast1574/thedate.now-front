import type { Event, Kind } from "./types";
import { formatEventDate } from "./date";

export function organizationEvents(events: Event[], kind: Kind) {
  return events
    .filter((event) => event.kind === kind && !event.isDemo)
    .sort(
      (a, b) =>
        (Date.parse(a.createdAt || "") || 0) -
        (Date.parse(b.createdAt || "") || 0),
    );
}

export function organizationEventLabel(event: Event) {
  return `${event.title} · ${formatEventDate(event.startAt, event.timeZone)} · ${event.paymentStatus === "paid" ? "Activo" : "Pendiente de pago"} · /${event.slug}`;
}
