import type { Event, Kind, User } from "./types";
import { orderEvents } from "./event-order";
export function galleryEvents(
  events: Event[],
  user: User,
  kind: Kind,
  lastOpened = "",
) {
  return orderEvents(
    events.filter(
      (event) =>
        event.kind === kind &&
        (event.ownerId === user.id || event.coupleUserIds?.includes(user.id)),
    ),
    lastOpened,
  );
}
