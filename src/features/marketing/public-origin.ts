import { headers } from "next/headers";
import { invitationTarget } from "@/lib/events/invitation-runtime";
export async function publicOrigin() {
  const host = ((await headers()).get("host") ?? "")
    .toLowerCase()
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");
  return !invitationTarget() &&
    ["thedate.now", "save.thedate.now"].includes(host)
    ? `https://${host}`
    : null;
}
