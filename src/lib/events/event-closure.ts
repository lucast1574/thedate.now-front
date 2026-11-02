import type { Event } from "./types";

type DatedEvent = Pick<Event, "startAt" | "timeZone" | "isDemo">;
export function eventReadOnly(
  event: DatedEvent | null | undefined,
  now = Date.now(),
) {
  if (!event || event.isDemo || !Number.isFinite(Date.parse(event.startAt)))
    return false;
  let format: Intl.DateTimeFormat;
  try {
    format = new Intl.DateTimeFormat("en-CA", {
      timeZone: event.timeZone || "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    format = new Intl.DateTimeFormat("en-CA", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }
  const day = (date: number) => {
    const parts = format.formatToParts(date);
    return ["year", "month", "day"]
      .map((type) => parts.find((part) => part.type === type)?.value)
      .join("");
  };
  return day(now) > day(Date.parse(event.startAt));
}
