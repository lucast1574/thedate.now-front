import { api } from "@/lib/api/client";
import type { Translator } from "@/lib/i18n/translator";
import type { Person } from "@/lib/events/seating";

export function updateGuestResponse(
  eventId: string,
  guestId: string,
  response: string,
  reason: string,
  i18n: Translator,
  companions?: Person[],
) {
  return api(
    `/api/backend/events/${eventId}/guests/${guestId}`,
    "PATCH",
    { response, reason, companions },
    i18n,
  );
}
