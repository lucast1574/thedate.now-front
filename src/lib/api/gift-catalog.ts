import "server-only";
import { headers, cookies } from "next/headers";
import { invitationTarget } from "@/lib/events/invitation-runtime";
import { invitationFromHost } from "@/lib/events/domains";
import { backendFetch } from "./server";
import { scopedWishlist } from "./gift-scope";
import type { GuestWishlist } from "@/lib/events/wishlist";
export async function giftCatalogTarget() {
  return (
    invitationTarget() ||
    invitationFromHost(
      ((await headers()).get("host") || "").replace(/:\d+$/, ""),
    )
  );
}
export async function publicGiftCatalog() {
  const target = await giftCatalogTarget();
  if (!target) return null;
  const result = await backendFetch(
    `public/events/${target.kind}/${target.slug}/wishlist`,
  );
  if (!result?.ok) return null;
  const data = (await result.json()) as GuestWishlist;
  const pinned = invitationTarget();
  if (pinned && data.event.id !== pinned.eventId) return null;
  return data;
}
export async function rememberedWishlist() {
  const token = (await cookies()).get("thedate_guest")?.value || "";
  const data = token ? await scopedWishlist(token) : null;
  return data ? { token, data } : null;
}
