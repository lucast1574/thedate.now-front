import { notFound } from "next/navigation";
import { personalToken } from "@/lib/events/personal-links";
import { scopedWishlist } from "@/lib/api/gift-scope";
import GuestWishlist from "@/features/gifts/guest-wishlist";
export const metadata = { robots: { index: false, follow: false } };
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ guest: string }>;
  searchParams: Promise<{ elegir?: string }>;
}) {
  const { guest } = await params;
  const token = personalToken(guest);
  const data = await scopedWishlist(token);
  if (!data) notFound();
  const { elegir } = await searchParams;
  return <GuestWishlist token={token} initial={data} initialGiftId={elegir} />;
}
