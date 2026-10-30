"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/icon";
import { api } from "@/lib/api/client";
import type { GuestWishlist, GuestGift } from "@/lib/events/wishlist";
import GuestWishlistView from "./guest-wishlist-view";
import GiftAccessDialog from "./gift-access-dialog";
export default function PublicWishlist({
  initial,
}: {
  initial: GuestWishlist;
}) {
  const [data, setData] = useState(initial),
    [selection, setSelection] = useState<GuestGift | null>(null);
  useEffect(() => {
    const update = () =>
      void api<GuestWishlist>("/api/gift-catalog")
        .then((next) =>
          setData((current) =>
            next.version >= current.version ? next : current,
          ),
        )
        .catch(() => {});
    const timer = window.setInterval(update, 20000);
    window.addEventListener("focus", update);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", update);
    };
  }, []);
  return (
    <main
      className={`gift-page ${initial.event.kind === "wedding" ? "gifts-wedding" : "gifts-general"}`}
    >
      <nav>
        <Link href="/">
          <Icon name="undo" />
          Ver invitación
        </Link>
        <span>
          {initial.event.kind === "wedding" ? "Save the Date" : "The Date"}
        </span>
      </nav>
      <GuestWishlistView
        data={data}
        onChoose={async () => false}
        onIdentify={(item) => setSelection(item)}
        imageSource={(item) =>
          item.hasImage ? `/api/gift-catalog/images/${item.id}` : undefined
        }
      />
      {selection && (
        <GiftAccessDialog
          title={selection.title}
          giftId={selection.id}
          onClose={() => setSelection(null)}
        />
      )}
    </main>
  );
}
