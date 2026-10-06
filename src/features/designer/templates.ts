import type { DesignEvent, DesignSection } from "@/lib/events/types";
import { sectionCanvas } from "./flyer/canvas-model";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
function starterSections(draft: DesignEvent): DesignSection[] {
  const wedding = draft.kind === "wedding";
  return [
    {
      id: crypto.randomUUID(),
      icon: wedding ? "flower" : "star",
      heading: draft.title,
      body: draft.description,
      photoKey: draft.photoKeys[0],
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
  const source = draft.sections?.length
    ? draft.sections
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
    // Keep existing content, photos and layers; only change the visual theme.
    return {
      ...section,
      canvas: {
        ...canvas,
        background: template.background,
        elements: canvas.elements.map((item) =>
          item.type === "image"
            ? item
            : { ...item, color: template.accent, font: template.font },
        ),
      },
    };
  });
  return { ...updated, sections };
}
