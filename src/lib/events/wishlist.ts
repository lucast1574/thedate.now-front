export type Gift = {
  id: string;
  title: string;
  url: string;
  description?: string;
  imageUrl?: string;
  guestId?: string;
  reservedAt?: string;
  delivered: boolean;
};
export type Wishlist = { version: number; enabled: boolean; items: Gift[] };
export type WishlistOwner = { list: Wishlist; guests: Record<string, string> };
export type GuestGift = {
  id: string;
  title: string;
  url: string;
  description?: string;
  hasImage: boolean;
  reserved: boolean;
  mine: boolean;
  delivered: boolean;
};
export type GuestWishlist = {
  event: {
    id: string;
    kind: "wedding" | "general";
    slug: string;
    title: string;
  };
  guestName: string;
  items: GuestGift[];
  version: number;
};
export const emptyWishlist = (): Wishlist => ({
  version: 0,
  enabled: false,
  items: [],
});
