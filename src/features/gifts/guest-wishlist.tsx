"use client";
import Link from "next/link";
import { personalPath } from "@/lib/events/personal-links";
import Icon from "@/components/icon";
import type { GuestWishlist as GuestWishlistData } from "@/lib/events/wishlist";
import { useGuestWishlist } from "./use-guest-wishlist";
import GuestWishlistView from "./guest-wishlist-view";
export default function GuestWishlist({
  token,
  initial,
  initialGiftId,
}: {
  token: string;
  initial: GuestWishlistData;
  initialGiftId?: string;
}) {
  const state = useGuestWishlist(token, initial);
  return (
    <main
      className={`gift-page ${initial.event.kind === "wedding" ? "gifts-wedding" : "gifts-general"}`}
    >
      <nav>
        <Link href={personalPath(token, initial.guestName)}>
          <Icon name="undo" /> Volver a la invitación
        </Link>
        <span>
          {initial.event.kind === "wedding" ? "Save the Date" : "The Date"}
        </span>
      </nav>
      <GuestWishlistView
        {...state}
        initialGiftId={initialGiftId}
        onChoose={state.choose}
        imageSource={(item) =>
          item.hasImage ? `/api/gifts/${token}/images/${item.id}` : undefined
        }
      />
    </main>
  );
}
