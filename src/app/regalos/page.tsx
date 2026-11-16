import { getTranslator } from "@/lib/i18n/server";
import WishlistEntryPage from "@/features/gifts/wishlist-entry-page";
import { giftMetadata } from "@/lib/products/metadata";
export async function generateMetadata() {
  const i18n = await getTranslator();
  return giftMetadata(undefined, i18n);
}
export default WishlistEntryPage;
