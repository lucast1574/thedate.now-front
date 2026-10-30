import type { Kind } from "./types";
import { invitationFromHost } from "./domains";
export function invitationTarget() {
  const kind = process.env.INVITATION_KIND;
  const slug = process.env.INVITATION_SLUG;
  const eventId = process.env.INVITATION_EVENT_ID;
  if (!kind && !slug && !eventId) return null;
  const target = invitationFromHost(
    `${slug}.${kind === "wedding" ? "save." : ""}thedate.now`,
  );
  if (
    !target ||
    target.kind !== kind ||
    !eventId ||
    !/^[a-z0-9-]+$/.test(eventId)
  )
    throw new Error("Invalid invitation runtime configuration");
  return { kind: kind as Kind, slug: target.slug, eventId };
}
export function allowedInvitationPath(path: string) {
  return (
    path === "/" ||
    path === "/api/invitation-health" ||
    path === "/favicon.ico" ||
    path === "/vendor/maplibre/maplibre-gl-worker.mjs" ||
    path === "/template-photos/placeholder.svg" ||
    path === "/regalos" ||
    /^\/para\/[a-z0-9-]{1,60}-[A-Za-z0-9_-]{32}(?:\/(?:respuesta|regalos))?$/.test(
      path,
    ) ||
    /^\/flags\/[a-z]{2}\.svg$/.test(path) ||
    /^\/api\/gift-catalog(?:\/(?:access|images\/[a-zA-Z0-9-]{1,64}))?$/.test(
      path,
    ) ||
    /^\/regalos\/[a-f0-9]{48}$/.test(path) ||
    /^\/api\/gifts\/[a-f0-9]{48}(?:\/images\/[a-zA-Z0-9-]{1,64})?$/.test(
      path,
    ) ||
    path === "/symbols/lucide-1.61.svg" ||
    path.startsWith("/_next/static/") ||
    /^\/rsvp\/[a-f0-9]{48}(?:\/respuesta)?$/.test(path) ||
    /^\/api\/rsvp\/[a-f0-9]{48}$/.test(path) ||
    /^\/api\/public-(?:photos|audio)\/(wedding|general)\/[a-z0-9-]+\/[a-z0-9.-]+$/.test(
      path,
    )
  );
}
