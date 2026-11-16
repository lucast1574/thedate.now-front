import {
  type Translator,
  localized,
  spanishTranslator,
} from "@/lib/i18n/translator";
import { weddingExtendedTemplates } from "./wedding-extended-templates";
import { generalExtendedTemplates } from "./general-extended-templates";
import type { Kind } from "@/lib/events/types";
import type { DesignMode } from "@/lib/events/flyer";
export type InvitationTemplate = {
  id: string;
  name: string;
  kind: Kind;
  mode: DesignMode;
  accent: string;
  background: string;
  font: "serif" | "sans";
  style: "classic" | "modern";
  tagline: string;
  layout?:
    | "floral"
    | "editorial"
    | "nocturne"
    | "frame"
    | "monogram"
    | "botanical"
    | "minimal"
    | "ticket"
    | "poster"
    | "arch"
    | "celebration"
    | "sunburst"
    | "gallery"
    | "split"
    | "ribbon"
    | "typographic"
    | "polaroid"
    | "landscape"
    | "cinematic"
    | "mosaic"
    | "seal"
    | "waves"
    | "confetti"
    | "grid";
  category?: string;
};
import { weddingTemplates } from "./wedding-templates";
import { generalTemplates } from "./general-templates";
export const invitationTemplates = localized((i18n: Translator) => [
  ...weddingTemplates(i18n),
  ...generalTemplates(i18n),
  ...weddingExtendedTemplates(i18n),
  ...generalExtendedTemplates(i18n),
]);
export function resolveTemplateId(
  kind: Kind,
  style: string,
  mode: DesignMode = "sections",
  id?: string,
  i18n: Translator = spanishTranslator,
) {
  if (mode === "flyer" && style === "classic" && id === `${kind}-blank`)
    return id;
  return (
    invitationTemplates(i18n).find(
      (t) =>
        t.id === id && t.kind === kind && t.style === style && t.mode === mode,
    )?.id ||
    invitationTemplates(i18n).find(
      (t) => t.kind === kind && t.style === style && t.mode === mode,
    )!.id
  );
}
