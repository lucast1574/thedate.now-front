import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import { eventReadOnly } from "./event-closure";
import type { Event, Kind, User } from "./types";

import { orderEvents } from "./event-order";

export function organizationEvents(events: Event[], kind: Kind, user: User) {
  return orderEvents(
    events.filter(
      (event) =>
        event.kind === kind &&
        !event.isDemo &&
        event.paymentStatus === "paid" &&
        (event.ownerId === user.id || event.coupleUserIds?.includes(user.id)),
    ),
  );
}

export function organizationEventDate(
  event: Event,
  i18n: Translator = spanishTranslator,
) {
  if (!Number.isFinite(Date.parse(event.startAt)))
    return i18n("Fecha por confirmar");
  return new Intl.DateTimeFormat(i18n.locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: event.timeZone || "America/Bogota",
  }).format(new Date(event.startAt));
}

export function organizationEventHref(event: Event, tool: string) {
  if (tool === "payments")
    return `/manager/${encodeURIComponent(event.id)}?tab=messages&view=payments`;
  return `/${eventReadOnly(event) && tool !== "messages" && tool !== "payments" ? "editor" : "manager"}/${encodeURIComponent(event.id)}?tab=${tool}`;
}
