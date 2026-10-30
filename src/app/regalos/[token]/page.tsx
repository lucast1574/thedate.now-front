import { personalPath } from "@/lib/events/personal-links";
import { notFound, redirect } from "next/navigation";
import { scopedWishlist } from "@/lib/api/gift-scope";
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
  redirect(`${personalPath(token, data.guestName)}/regalos`);
}
