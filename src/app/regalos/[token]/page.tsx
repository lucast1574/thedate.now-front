import { notFound } from "next/navigation";
import { scopedWishlist } from "@/lib/api/gift-scope";
import GuestWishlist from "@/features/gifts/guest-wishlist";
export const metadata = {
  title: "Tu lista de regalos • The Date",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
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
