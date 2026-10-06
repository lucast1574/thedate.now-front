import "server-only";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { backendFetch, validInviteToken } from "@/lib/api/server";
import { invitationTarget } from "@/lib/events/invitation-runtime";
import { invitationFromHost } from "@/lib/events/domains";
import type { PublicEvent } from "@/lib/events/types";
import Invitation from "./invitation";
import LiveInvitation from "./live-invitation";
import RSVPForm from "@/features/rsvp/rsvp-form";
export default async function PersonalInvitation({ token }: { token: string }) {
  if (!validInviteToken(token)) notFound();
  const response = await backendFetch(`public/rsvp/${token}`);
  if (!response?.ok) notFound();
  const data = (await response.json()) as {
    event: PublicEvent;
    guestName: string;
  };
  if (!data.event) notFound();
  const pinned = invitationTarget();
  const host = ((await headers()).get("host") || "")
    .replace(/:\d+$/, "")
    .toLowerCase();
  const target = pinned || invitationFromHost(host);
  if (
    target &&
    (data.event.kind !== target.kind ||
      data.event.slug !== target.slug ||
      (pinned && data.event.id !== pinned.eventId))
  )
    notFound();
  return (
    <>
      <LiveInvitation />
      <a className="personal-confirm-link" href="#confirmacion">
        Confirmar asistencia
      </a>
      <Invitation event={data.event} guestName={data.guestName} />
      <div id="confirmacion">
        <RSVPForm token={token} />
      </div>
    </>
  );
}
