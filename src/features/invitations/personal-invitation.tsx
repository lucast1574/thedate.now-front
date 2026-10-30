import "server-only";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { backendFetch, validInviteToken } from "@/lib/api/server";
import { invitationTarget } from "@/lib/events/invitation-runtime";
import { invitationFromHost } from "@/lib/events/domains";
import type { PublicEvent } from "@/lib/events/types";
import Invitation from "./invitation";
import InvitationBrand from "./invitation-brand";
import LiveInvitation from "./live-invitation";
import RSVPTheme from "@/features/rsvp/rsvp-theme";
import RSVPForm from "@/features/rsvp/rsvp-form";
export default async function PersonalInvitation({ token }: { token: string }) {
  if (!validInviteToken(token)) notFound();
  const response = await backendFetch(`public/rsvp/${token}`);
  if (!response?.ok) notFound();
  const data = (await response.json()) as {
    event: PublicEvent;
    guestName: string;
    response?: string;
    finalized?: boolean;
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
  if (
    data.finalized ||
    ["going", "not_going", "maybe"].includes(data.response || "")
  )
    return (
      <RSVPTheme event={data.event}>
        <RSVPForm token={token} />
        <InvitationBrand event={data.event} />
      </RSVPTheme>
    );
  return (
    <>
      <LiveInvitation />
      <a className="personal-confirm-link" href="#confirmacion">
        Confirmar asistencia
      </a>
      <Invitation
        showBrand={false}
        event={data.event}
        guestName={data.guestName}
        giftURL={`/regalos/${token}`}
      />
      <div id="confirmacion">
        <RSVPTheme event={data.event}>
          <RSVPForm token={token} />
        </RSVPTheme>
      </div>
      <InvitationBrand event={data.event} />
    </>
  );
}
