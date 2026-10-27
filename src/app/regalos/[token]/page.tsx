import { notFound } from "next/navigation";
import { scopedWishlist } from "@/lib/api/gift-scope";
import GuestWishlist from "@/features/gifts/guest-wishlist";
import { giftMetadata } from "@/lib/products/metadata";
export const generateMetadata = () => giftMetadata(true);
export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await scopedWishlist(token);
  if (!data) notFound();
  return <GuestWishlist token={token} initial={data} />;
}
