import type { Event } from "./types";

export function orderEvents(events: Event[], lastOpened = "") {
  return events
    .slice()
    .sort(
      (a, b) =>
        Number(Boolean(a.isDemo)) - Number(Boolean(b.isDemo)) ||
        Number(b.id === lastOpened) - Number(a.id === lastOpened) ||
        (Date.parse(b.createdAt || "") || 0) -
          (Date.parse(a.createdAt || "") || 0) ||
        a.id.localeCompare(b.id),
    );
}
