import type { Metadata } from "next";
import { headers } from "next/headers";
import PersonalInvitation from "@/features/invitations/personal-invitation";
import { personalToken } from "@/lib/events/personal-links";
import {
  shareEvent,
  shareMetadata,
} from "@/features/invitations/share-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const host = ((await headers()).get("host") ?? "")
    .toLowerCase()
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");
  const event = await shareEvent(host);
  if (event) return shareMetadata(event);
  return { robots: { index: false, follow: false } };
}

export default async function Page({
  params,
}: {
  params: Promise<{ guest: string }>;
}) {
  const { guest } = await params;
  return <PersonalInvitation token={personalToken(guest)} />;
}
