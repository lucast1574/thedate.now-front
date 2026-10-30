import type { PublicEvent } from "./types";
function escapeICS(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/[,;]/g, "\\$&");
}
export function calendarDownload(event?: Partial<PublicEvent>) {
  if (!event?.startAt || !Number.isFinite(Date.parse(event.startAt))) return "";
  const date = (value: number) =>
    new Date(value)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  const start = Date.parse(event.startAt);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//The Date//Invitations//ES",
    "BEGIN:VEVENT",
    `UID:${escapeICS(event.id || event.slug || "event")}@thedate.now`,
    `DTSTAMP:${date(start)}`,
    `DTSTART:${date(start)}`,
    `DTEND:${date(start + 4 * 3600000)}`,
    `SUMMARY:${escapeICS(event.title || "Celebraci\u00f3n")}`,
    `LOCATION:${escapeICS(event.location || "")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join("\r\n"))}`;
}
