import { updateInvitationTheme } from "./invitation-theme";
import type { DesignEvent, DesignSection } from "@/lib/events/types";
import { sectionCanvas } from "./flyer/canvas-model";
import { templateCanvas } from "./template-canvas";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
function starterSections(draft: DesignEvent): DesignSection[] {
  const wedding = draft.kind === "wedding";
  return [
    {
      id: crypto.randomUUID(),
      icon: wedding ? "flower" : "star",
      heading: draft.title,
      body: draft.description,
    },
    {
      id: crypto.randomUUID(),
      icon: wedding ? "heart" : "sparkle",
      heading: wedding ? "Nuestra historia" : "Sobre el evento",
      body: wedding
        ? "Comparte aquí cómo empezó vuestra historia."
        : "Cuéntales a tus invitados qué hace especial este encuentro.",
    },
    {
      id: crypto.randomUUID(),
      icon: "calendar",
      heading: "Un día para recordar",
      body: "Añade aquí el programa y los detalles que tus invitados necesitan.",
    },
  ];
}
export function applyTemplate(
  draft: DesignEvent,
  template: InvitationTemplate,
): DesignEvent {
  if (template.kind !== draft.kind) return draft;
  const themed = updateInvitationTheme(draft, {
    ink: template.accent,
    background: template.background,
    font: template.font,
  });
  const source = themed.sections?.length
    ? themed.sections
    : starterSections(draft);
  const updated = {
    ...draft,
    accentColor: template.accent,
    template: template.style,
    templateId: template.id,
    designMode: template.mode,
  };
  const sections = source.map((section) => {
    if (template.mode === "sections") return { ...section };
    const canvas = sectionCanvas(section, updated);
    if (!canvas.elements.length)
      return {
        ...section,
        canvas: templateCanvas(template, {
          title: draft.title,
          body: draft.description,
          photoKey: "template-photo",
        }),
      };
    // Keep existing content, photos and layers; only change the visual theme.
    return {
      ...section,
      canvas: {
        ...canvas,
        background: canvas.background,
        elements: canvas.elements,
      },
    };
  });
  return { ...updated, sections };
}
export function applyTemplateToSection(
  draft: DesignEvent,
  template: InvitationTemplate,
  sectionId: string,
): DesignEvent {
  const section = draft.sections?.find((item) => item.id === sectionId);
  if (!section || template.kind !== draft.kind) return draft;
  const themed = applyTemplate({ ...draft, sections: [section] }, template);
  return {
    ...themed,
    sections: draft.sections!.map((item) =>
      item.id === sectionId ? themed.sections![0] : item,
    ),
  };
}
