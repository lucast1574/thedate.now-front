import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import type { Opening } from "@/lib/events/celebration";
import { defaultOpening } from "@/lib/events/celebration";
import { templateIdentity } from "./template-identity";
export function templateOpening(
  template: InvitationTemplate,
  i18n: Translator = spanishTranslator,
): Opening {
  const styles: Record<string, Opening["style"]> = {
    floral: "bloom",
    botanical: "arch",
    arch: "arch",
    nocturne: "orbit",
    ticket: "ticket",
    poster: "curtain",
    celebration: "curtain",
    sunburst: "orbit",
    gallery: "classic",
    split: "curtain",
    ribbon: "classic",
    typographic: "ticket",
    polaroid: "classic",
    landscape: "arch",
    cinematic: "orbit",
    mosaic: "bloom",
    seal: "classic",
    waves: "arch",
    confetti: "bloom",
    grid: "ticket",
  };
  const identity = templateIdentity(template, i18n);
  return {
    ...defaultOpening(
      template.kind === "wedding",
      template.background,
      template.accent,
      i18n,
    ),
    message: identity.opening,
    font: template.font,
    sealIcon: identity.seal,
    style:
      styles[template.layout || ""] ||
      (template.kind === "wedding" ? "classic" : "ticket"),
  };
}
