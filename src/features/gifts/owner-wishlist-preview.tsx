import type { Event } from "@/lib/events/types";
import type { Wishlist } from "@/lib/events/wishlist";
import GiftExperiencePreview from "./gift-experience-preview";
export default function OwnerWishlistPreview({
  event,
  list,
  example,
}: {
  event: Event;
  list: Wishlist;
  example: boolean;
}) {
  return (
    <GiftExperiencePreview
      wedding={event.kind === "wedding"}
      initial={
        example
          ? undefined
          : {
              event,
              guestName: "Lucía",
              version: list.version,
              items: list.items.map((item) => ({
                id: item.id,
                title: item.title,
                url: item.url,
                description: item.description,
                delivered: item.delivered,
                mine: false,
                reserved: !!item.guestId,
                hasImage: !!item.imageUrl,
              })),
            }
      }
      imageSource={(id) =>
        list.items.find((item) => item.id === id)?.imageUrl
          ? `/api/wishlist-images/${event.id}/${id}`
          : undefined
      }
    />
  );
}
