import { personalPath } from "@/lib/events/personal-links";
import { notFound, redirect } from "next/navigation";
import { scopedWishlist } from "@/lib/api/gift-scope";
import { giftMetadata } from "@/lib/products/metadata";
export const generateMetadata = () => giftMetadata(true);
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ elegir?: string }>;
}) {
  const { token } = await params;
  const data = await scopedWishlist(token);
  if (!data) notFound();
  const { elegir } = await searchParams;
  const query = elegir ? `?${new URLSearchParams({ elegir })}` : "";
  redirect(`${personalPath(token, data.guestName)}/regalos${query}`);
}
