import { getTranslator } from "@/lib/i18n/server";
import { personalPath } from "@/lib/events/personal-links";
import { notFound, redirect } from "next/navigation";
import { scopedWishlist } from "@/lib/api/gift-scope";
import { giftMetadata } from "@/lib/products/metadata";
export async function generateMetadata() {
  const i18n = await getTranslator();
  return giftMetadata(true, i18n);
}
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
