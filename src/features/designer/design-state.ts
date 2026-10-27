import { protectedGuestText } from "@/lib/events/guest-name";
import { resolveTemplateId } from "@/lib/events/template-catalog";
import type { DesignEvent } from "@/lib/events/types";
export function designPayload(draft: DesignEvent) {
  return {
    backgroundImage: draft.backgroundImage ?? null,
    clearBackgroundImage: !draft.backgroundImage,
    opening: draft.opening ?? null,
    celebration: draft.celebration ?? null,
    music: draft.music ?? null,
    title: draft.title,
    description: draft.description,
    template: draft.template,
    templateId: resolveTemplateId(
      draft.kind,
      draft.template,
      draft.designMode || "sections",
      draft.templateId,
    ),
    accentColor: draft.accentColor,
    designMode: draft.designMode || "sections",
    sections: (draft.sections || []).map((section) => ({
      ...section,
      ...(section.guestText
        ? {
            guestText: {
              ...section.guestText,
              text: protectedGuestText(section.guestText.text || ""),
            },
          }
        : {}),
      ...(section.canvas
        ? {
            canvas: {
              ...section.canvas,
              elements: section.canvas.elements.map((item) =>
                item.binding === "guest_name"
                  ? { ...item, text: protectedGuestText(item.text || "") }
                  : item.binding === "dress_code"
                    ? {
                        ...item,
                        dressExcludedColors: item.dressExcludedColors?.length
                          ? item.dressExcludedColors
                          : undefined,
                      }
                    : item,
              ),
            },
          }
        : {}),
    })),
  };
}
export function sameDesign(a: DesignEvent, b: DesignEvent) {
  return JSON.stringify(designPayload(a)) === JSON.stringify(designPayload(b));
}
