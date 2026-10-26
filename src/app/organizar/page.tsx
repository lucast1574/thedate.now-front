import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { googleEnabled } from "@/lib/auth/google";
import { invitationTarget } from "@/lib/events/invitation-runtime";
import OrganizationPage from "@/features/manager/organization-page";
export default async function Page() {
  const host = ((await headers()).get("host") || "").split(":")[0];
  if (
    invitationTarget() ||
    (process.env.NODE_ENV === "production" &&
      ![
        "crea.thedate.now",
        "studio.save.thedate.now",
        "backoffice.thedate.now",
      ].includes(host))
  )
    notFound();
  return (
    <OrganizationPage
      wedding={host === "studio.save.thedate.now"}
      googleEnabled={googleEnabled(host)}
    />
  );
}
