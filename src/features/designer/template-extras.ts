import type { Event, DesignEvent } from "@/lib/events/types";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import type { Opening } from "@/lib/events/celebration";
import { defaultOpening } from "@/lib/events/celebration";
import { templatePage, templateText } from "./template-pages";

export type TemplateSource = DesignEvent &
  Partial<
    Pick<
      Event,
      | "startAt"
      | "timeZone"
      | "location"
      | "mapUrl"
      | "virtualUrl"
      | "isVirtual"
      | "creation"
    >
  >;

export function templateOpening(template: InvitationTemplate): Opening {
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
  return {
    ...defaultOpening(
      template.kind === "wedding",
      template.background,
      template.accent,
    ),
    style:
      styles[template.layout || ""] ||
      (template.kind === "wedding" ? "classic" : "ticket"),
  };
}

export function templateDress(
  template: InvitationTemplate,
  source: TemplateSource | undefined,
  text: string,
) {
  const previous = source?.sections
    ?.flatMap((s) => s.canvas?.elements || [])
    .find((e) => e.binding === "dress_code");
  return templateText(template, "dress", text, 270, 340, 32, {
    binding: "dress_code",
    dressStyle: "icon-text",
    dressIcon: previous?.dressIcon || "lucide:shirt",
    dressExcludedColors:
      source?.creation?.dressExcludedColors || previous?.dressExcludedColors,
  });
}

export function templateExtraPages(
  template: InvitationTemplate,
  source?: TemplateSource,
) {
  const pages = [];
  const previous =
    source?.sections
      ?.flatMap((s) => s.canvas?.elements || [])
      .filter((e) => e.binding === "restrictions") || [];
  const rules = source?.creation?.restrictionText?.trim()
    ? [
        {
          text: source.creation.restrictionText,
          restrictionIcon: source.creation.restrictionIcon,
        },
      ]
    : previous;
  for (const [index, rule] of rules.entries()) {
    pages.push(
      templatePage(template, "Para disfrutar juntos", 600, [
        templateText(template, "rules-title", "Ten en cuenta", 70, 100, 44),
        templateText(
          template,
          `rules-${index}`,
          rule.text || "",
          220,
          290,
          28,
          {
            binding: "restrictions",
            restrictionStyle: "icon-text",
            restrictionIcon: rule.restrictionIcon || "lucide:shield-alert",
          },
        ),
      ]),
    );
  }
  if (source?.wishlistEnabled)
    pages.push(
      templatePage(template, "Lista de regalos", 560, [
        templateText(
          template,
          "gifts-title",
          "Un detalle con cariño",
          80,
          100,
          44,
        ),
        templateText(
          template,
          "gifts-note",
          "Tu compañía es nuestro mejor regalo. Si quieres tener un detalle, aquí encontrarás algunas ideas.",
          220,
          130,
          28,
        ),
        templateText(
          template,
          "gifts-link",
          "Ver lista de regalos",
          410,
          80,
          30,
          { binding: "gift_link" },
        ),
      ]),
    );
  return pages;
}
