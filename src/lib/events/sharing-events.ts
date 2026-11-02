import { eventReadOnly } from "./event-closure";
import type { Event, Kind, User } from "./types";
export function sharingEvents(events: Event[], kind: Kind, user: User) {
  return events.filter(
    (event) =>
      event.kind === kind &&
      !event.isDemo &&
      event.paymentStatus === "paid" &&
      event.ownerId === user.id &&
      Boolean(
        event.id && event.slug && Number.isFinite(Date.parse(event.startAt)),
      ) &&
      !eventReadOnly(event),
  );
}
