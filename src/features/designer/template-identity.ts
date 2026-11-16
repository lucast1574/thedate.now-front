import {
  type Translator,
  localized,
  spanishTranslator,
} from "@/lib/i18n/translator";
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
const plans = localized((i18n: Translator) => ({
  ...baseIdentities(i18n),
  ...extendedIdentities(i18n),
}));
export function templateIdentity(
  t: InvitationTemplate,
  i18n: Translator = spanishTranslator,
) {
  return {
    ...plans(i18n)[t.layout || (t.kind === "wedding" ? "floral" : "poster")],
    ...identityVariants(i18n)[t.id],
  };
}
