import { notFound } from "next/navigation";
import { publicGiftCatalog, rememberedWishlist } from "@/lib/api/gift-catalog";
import PublicWishlist from "./public-wishlist";
import GuestWishlist from "./guest-wishlist";
export default async function WishlistEntryPage() {
  const personal = await rememberedWishlist();
  if (personal)
    return <GuestWishlist token={personal.token} initial={personal.data} />;
  const data = await publicGiftCatalog();
  if (!data) notFound();
  return <PublicWishlist initial={data} />;
}
