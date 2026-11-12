import { headers } from "next/headers";
import { ImageResponse } from "next/og";
import { shareEvent } from "@/features/invitations/share-metadata";
import { sharePhotos } from "@/features/invitations/share-photos";
import ShareCover from "@/features/invitations/share-cover";

export async function GET() {
  const host = ((await headers()).get("host") || "")
    .toLowerCase()
    .split(":")[0];
  const event = await shareEvent(host);
  if (!event) return new Response("Not found", { status: 404 });
  const photos = await sharePhotos(event);
  return new ImageResponse(<ShareCover event={event} photos={photos} />, {
    width: 1200,
    height: 630,
    headers: {
      "Cache-Control": "public, max-age=300",
      "X-Robots-Tag": "noindex",
    },
  });
}
