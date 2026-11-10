import type { Event } from "./types";

export function hasInvitationCourtesy(events: Event[], ownerId: string) {
  return events.some(
    (event) =>
      event.ownerId === ownerId &&
      event.isDemo &&
      event.paymentStatus === "paid" &&
      event.paymentSource === "courtesy",
  );
}
