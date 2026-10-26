import "server-only";
import { headers } from "next/headers";
import { invitationTarget } from "@/lib/events/invitation-runtime";
import { invitationFromHost } from "@/lib/events/domains";
import { backendFetch, validInviteToken } from "./server";
import type { GuestWishlist } from "@/lib/events/wishlist";
export async function scopedWishlist(token: string) {
  if (!validInviteToken(token)) return null;
  const response = await backendFetch(`public/wishlist/${token}`);
  if (!response?.ok) return null;
  const data = (await response.json()) as GuestWishlist;
  const pinned = invitationTarget(),
    host = ((await headers()).get("host") || "")
      .replace(/:\d+$/, "")
      .toLowerCase();
  const target = pinned || invitationFromHost(host);
  if (
    !data.event ||
    (target &&
      (target.kind !== data.event.kind ||
        target.slug !== data.event.slug ||
        (pinned && pinned.eventId !== data.event.id)))
  )
    return null;
  return data;
}
export function privateGiftJSON(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "Referrer-Policy": "no-referrer",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
