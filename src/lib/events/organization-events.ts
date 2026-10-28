import type { Event, Kind, User } from "./types";

export function organizationEvents(events: Event[], kind: Kind, user: User) {
  return events
    .filter(
      (event) =>
        event.kind === kind &&
        !event.isDemo &&
        event.paymentStatus === "paid" &&
        (event.ownerId === user.id || event.coupleUserIds?.includes(user.id)),
    )
    .sort(
      (a, b) =>
        (Date.parse(a.createdAt || "") || 0) -
        (Date.parse(b.createdAt || "") || 0),
    );
}

export function organizationEventDate(event: Event) {
  if (!Number.isFinite(Date.parse(event.startAt))) return "Fecha por confirmar";
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: event.timeZone || "America/Bogota",
  }).format(new Date(event.startAt));
}
