import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import { updateInvitationTheme } from "./invitation-theme";
import type { DesignEvent, DesignSection } from "@/lib/events/types";
import { sectionCanvas } from "./flyer/canvas-model";
import { templateCanvas } from "./template-canvas";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
function starterSections(
  draft: DesignEvent,
  i18n: Translator = spanishTranslator,
): DesignSection[] {
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
      heading: wedding ? i18n("Nuestra historia") : i18n("Sobre el evento"),
      body: wedding
        ? i18n("Comparte aquí cómo empezó vuestra historia.")
        : i18n("Cuéntales a tus invitados qué hace especial este encuentro."),
    },
    {
      id: crypto.randomUUID(),
      icon: "calendar",
      heading: i18n("Un día para recordar"),
      body: i18n(
        "Añade aquí el programa y los detalles que tus invitados necesitan.",
      ),
    },
  ];
}
export function applyTemplate(
  draft: DesignEvent,
  template: InvitationTemplate,
  i18n: Translator = spanishTranslator,
): DesignEvent {
  if (template.kind !== draft.kind) return draft;
  const themed = updateInvitationTheme(
    draft,
    {
      ink: template.accent,
      background: template.background,
      font: template.font,
    },
    i18n,
  );
  const source = themed.sections?.length
    ? themed.sections
    : starterSections(draft, i18n);
  const updated = {
    ...draft,
    accentColor: template.accent,
    template: template.style,
    templateId: template.id,
    designMode: template.mode,
  };
  const sections = source.map((section) => {
    if (template.mode === "sections") return { ...section };
    const canvas = sectionCanvas(section, updated, i18n);
    if (!canvas.elements.length)
      return {
        ...section,
        canvas: templateCanvas(
          template,
          {
            title: draft.title,
            body: draft.description,
            photoKey: "template-photo",
          },
          i18n,
        ),
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
  i18n: Translator = spanishTranslator,
): DesignEvent {
  const section = draft.sections?.find((item) => item.id === sectionId);
  if (!section || template.kind !== draft.kind) return draft;
  const themed = applyTemplate(
    { ...draft, sections: [section] },
    template,
    i18n,
  );
  return {
    ...themed,
    sections: draft.sections!.map((item) =>
      item.id === sectionId ? themed.sections![0] : item,
    ),
  };
}
