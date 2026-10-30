import type { Gift } from "./wishlist";
export type GiftFilter = "all" | "available" | "reserved" | "received";
export function ownerGiftStatus(gift: Gift): Exclude<GiftFilter, "all"> {
  return gift.delivered ? "received" : gift.guestId ? "reserved" : "available";
}
export function filterOwnerGifts(
  items: Gift[],
  names: Record<string, string>,
  filter: GiftFilter,
  search: string,
) {
  const query = search
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
  return items
    .filter(
      (gift) =>
        (filter === "all" || ownerGiftStatus(gift) === filter) &&
        (!query ||
          `${gift.title} ${gift.description || ""} ${gift.url} ${names[gift.guestId || ""] || ""}`
            .toLocaleLowerCase("es")
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "")
            .includes(query)),
    )
    .sort(
      (a, b) =>
        Number(ownerGiftStatus(b) === "reserved") -
        Number(ownerGiftStatus(a) === "reserved"),
    );
}
