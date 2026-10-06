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
    path.startsWith("/_next/static/") ||
    /^\/(?:rsvp|api\/rsvp)\/[a-f0-9]{48}$/.test(path) ||
    /^\/api\/public-photos\/(wedding|general)\/[a-z0-9-]+\/[a-z0-9.-]+$/.test(
      path,
    )
  );
}
