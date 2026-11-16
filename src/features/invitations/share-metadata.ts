import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import "server-only";
import { createHash } from "node:crypto";
import type { Metadata } from "next";
import type { PublicEvent } from "@/lib/events/types";
import { invitationFromHost, invitationHost } from "@/lib/events/domains";
import { invitationTarget } from "@/lib/events/invitation-runtime";
import { formatEventDate } from "@/lib/events/date";
import { findEvent } from "./load-invitation";

export async function shareEvent(host: string) {
  const target = invitationFromHost(host);
  if (!target) return null;
  const pinned = invitationTarget();
  if (pinned && (pinned.kind !== target.kind || pinned.slug !== target.slug))
    return null;
  const event = await findEvent(target.kind, target.slug);
  return event && (!pinned || event.id === pinned.eventId) ? event : null;
}

export function shareMetadata(
  event: PublicEvent,
  i18n: Translator = spanishTranslator,
): Metadata {
  const brand = event.kind === "wedding" ? "Save the Date" : "The Date";
  const url = `https://${invitationHost(event.kind, event.slug)}`;
  const title = `${event.title} | ${brand}`;
  const description = [
    i18n("Abre tu invitación y conoce todos los detalles de la celebración."),
    formatEventDate(event.startAt, event.timeZone, i18n),
  ].join(" ");
  const version = createHash("sha256")
    .update(JSON.stringify(event))
    .digest("hex")
    .slice(0, 16);
  const images = [
    {
      url: `${url}/api/invitation-preview?v=${version}`,
      width: 1200,
      height: 630,
      alt: i18n("Invitación a {v0}", { v0: event.title }),
      type: "image/png",
    },
  ];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale:
        i18n.locale === "pt"
          ? "pt_BR"
          : i18n.locale === "en"
            ? "en_US"
            : "es_ES",
      siteName: brand,
      title,
      description,
      url,
      images,
    },
    twitter: { card: "summary_large_image", title, description, images },
    robots: { index: false, follow: false },
  };
}
