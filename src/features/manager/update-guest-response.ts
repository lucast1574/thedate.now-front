import { api } from "@/lib/api/client";
import type { Translator } from "@/lib/i18n/translator";

export function updateGuestResponse(
  eventId: string,
  guestId: string,
  response: string,
  reason: string,
  i18n: Translator,
) {
  return api(
    `/api/backend/events/${eventId}/guests/${guestId}`,
    "PATCH",
    { response, reason },
    i18n,
  );
}
