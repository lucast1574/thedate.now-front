import "server-only";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { backendFetch, validInviteToken } from "@/lib/api/server";
import { invitationTarget } from "@/lib/events/invitation-runtime";
import { invitationFromHost } from "@/lib/events/domains";
import type { PublicEvent } from "@/lib/events/types";
import { personalPath } from "@/lib/events/personal-links";
import Invitation from "./invitation";
import InvitationBrand from "./invitation-brand";
import LiveInvitation from "./live-invitation";
import RSVPTheme from "@/features/rsvp/rsvp-theme";
import RSVPForm from "@/features/rsvp/rsvp-form";
export default async function PersonalInvitation({
  token,
  answer = false,
  legacy = false,
}: {
  token: string;
  answer?: boolean;
  legacy?: boolean;
}) {
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
  const path = personalPath(token, data.guestName);
  if (legacy) redirect(`${path}${answer ? "/respuesta" : ""}`);
  if (answer)
    return (
      <RSVPTheme event={data.event}>
        <nav className="guest-page-navigation">
          <a href={path}>Ver invitación</a>
          <a href={`${path}/regalos`}>Lista de regalos</a>
        </nav>
        {data.finalized ||
        ["going", "not_going", "maybe"].includes(data.response || "") ? (
          <RSVPForm token={token} />
        ) : (
          <main className="rsvp-page">
            <section className="rsvp-card">
              <p className="eyebrow">TU RESPUESTA</p>
              <h1>Primero, responde en WhatsApp.</h1>
              <p>
                Elige Sí, No o Tal vez en la encuesta que te enviamos. Después
                podrás completar tus datos desde este enlace.
              </p>
              <a className="office-button" href={path}>
                Ver invitación
              </a>
            </section>
          </main>
        )}
        <LiveInvitation />
        <InvitationBrand event={data.event} />
      </RSVPTheme>
    );
  return (
    <>
      <LiveInvitation />
      <Invitation
        showBrand={false}
        event={data.event}
        guestName={data.guestName}
        giftURL={`${path}/regalos`}
      />
      <InvitationBrand event={data.event} />
    </>
  );
}
