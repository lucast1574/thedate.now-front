import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { applicationProduct } from "@/lib/products/application";
import { invitationTarget } from "@/lib/events/invitation-runtime";
import { googleEnabled } from "@/lib/auth/google";
import SharedCelebrations from "@/features/studio/shared-celebrations";
export default async function Page() {
  if (invitationTarget()) notFound();
  const host = ((await headers()).get("host") || "").split(":")[0];
  return (
    <SharedCelebrations
      wedding={applicationProduct(host) === "wedding"}
      googleEnabled={googleEnabled(host)}
    />
  );
}
