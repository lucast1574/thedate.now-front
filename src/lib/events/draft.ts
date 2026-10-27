import { ensureInvitationLink } from "./invitation-message";
import { defaultInvitationMessage } from "./event-form";
import { defaultCelebration } from "./celebration";
import { resolveTemplateId } from "./template-catalog";
import type { Event, Kind } from "./types";
export function browserTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}
export function localDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value.slice(0, 16)
    : new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
}
export function blankEvent(kind: Kind): Event {
  return {
    id: "",
    celebration: defaultCelebration(kind === "wedding"),
    kind,
    slug: "",
    title: "",
    description: "",
    invitationMessage: defaultInvitationMessage,
    startAt: "",
    timeZone: browserTimeZone(),
    organizer: "",
    location: "",
    isVirtual: false,
    mapUrl: "",
    virtualUrl: "",
    capacity: 50,
    capacityUnlimited: false,
    maybeHoldHours: 48,
    template: "classic",
    templateId: resolveTemplateId(kind, "classic", "flyer"),
    designMode: "flyer",
    accentColor: kind === "wedding" ? "#9c6449" : "#7451ac",
    photoKeys: [],
    paymentStatus: "unpaid",
    publishedAt: null,
  };
}
export function normalizeEvent(event: Event): Event {
  return {
    ...event,
    startAt: localDateTime(event.startAt),
    timeZone: event.timeZone || browserTimeZone(),
    organizer: event.organizer ?? "",
    location: event.location ?? "",
    isVirtual: event.isVirtual ?? false,
    mapUrl: event.mapUrl ?? "",
    virtualUrl: event.virtualUrl ?? "",
  };
}
export function eventPayload(event: Event) {
  const virtual = event.isVirtual;
  return {
    kind: event.kind,
    celebration: event.celebration || undefined,
    slug: event.slug,
    title: event.title,
    description: event.description,
    invitationMessage: ensureInvitationLink(
      event.invitationMessage ?? defaultInvitationMessage,
    ).trim(),
    startAt: new Date(event.startAt).toISOString(),
    timeZone: event.timeZone || browserTimeZone(),
    organizer: event.organizer,
    location: virtual ? "En línea" : event.location,
    isVirtual: virtual,
    mapUrl: virtual ? "" : event.mapUrl,
    virtualUrl: virtual ? event.virtualUrl : "",
    capacity: event.capacityUnlimited ? 0 : event.capacity,
    capacityUnlimited: Boolean(event.capacityUnlimited),
    maybeHoldHours: event.maybeHoldHours,
    template: event.template,
    templateId: resolveTemplateId(
      event.kind,
      event.template,
      event.designMode || "sections",
      event.templateId,
    ),
    designMode: event.designMode || "sections",
    accentColor: event.accentColor,
  };
}
