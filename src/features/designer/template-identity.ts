import { identityVariants } from "./template-identity-variants";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { baseIdentities } from "./template-identities-base";
import { extendedIdentities } from "./template-identities-extended";
export type TemplateIdentity = {
  story: "letter" | "portrait" | "split" | "album" | "panorama" | "statement";
  lead: string;
  eventLead: string;
  flow: "story" | "date" | "place";
  align: "center" | "left";
  inset: number;
  seal: string;
  opening: string;
};
const plans = { ...baseIdentities, ...extendedIdentities };
export function templateIdentity(t: InvitationTemplate) {
  return {
    ...plans[t.layout || (t.kind === "wedding" ? "floral" : "poster")],
    ...identityVariants[t.id],
  };
}
