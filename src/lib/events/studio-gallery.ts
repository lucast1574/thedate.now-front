import type { Event, Kind, User } from "./types";
export function galleryEvents(events: Event[], user: User, kind: Kind) {
  return events
    .filter(
      (event) =>
        event.kind === kind &&
        (event.ownerId === user.id || event.coupleUserIds?.includes(user.id)),
    )
    .sort(
      (a, b) =>
        Number(Boolean(a.isDemo)) - Number(Boolean(b.isDemo)) ||
        (Date.parse(b.updatedAt || b.createdAt || "") || 0) -
          (Date.parse(a.updatedAt || a.createdAt || "") || 0) ||
        a.id.localeCompare(b.id),
    );
}
