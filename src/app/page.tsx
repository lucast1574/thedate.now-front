import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Studio from "@/features/studio/studio";
import GeneralLanding from "@/features/marketing/general/landing";
import WeddingLanding from "@/features/marketing/wedding/landing";
import Invitation from "@/features/invitations/invitation";
import { findEvent } from "@/features/invitations/load-invitation";
import { invitationFromHost } from "@/lib/events/domains";
import { invitationTarget } from "@/lib/events/invitation-runtime";
export default async function Home() {
  const pinned = invitationTarget();
  if (pinned) {
    const event = await findEvent(pinned.kind, pinned.slug);
    if (!event || event.id !== pinned.eventId) notFound();
    return <Invitation event={event} />;
  }
  const host = ((await headers()).get("host") ?? "")
    .toLowerCase()
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");
  if (host === "backoffice.thedate.now") redirect("https://crea.thedate.now");
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
  );
  const paymentsEnabled = process.env.PAYMENTS_ENABLED === "true";
  if (host === "crea.thedate.now")
    return (
      <Studio
        portal="general"
        googleEnabled={googleEnabled}
        paymentsEnabled={paymentsEnabled}
      />
    );
  if (host === "studio.save.thedate.now")
    return (
      <Studio
        portal="wedding"
        googleEnabled={googleEnabled}
        paymentsEnabled={paymentsEnabled}
      />
    );
  const target = invitationFromHost(host);
  if (target) {
    const event = await findEvent(target.kind, target.slug);
    if (!event) notFound();
    return <Invitation event={event} />;
  }
  return host === "save.thedate.now" ? <WeddingLanding /> : <GeneralLanding />;
}
