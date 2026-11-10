import { blankCanvas } from "@/features/designer/flyer/canvas-model";
import type { Event } from "@/lib/events/types";

export function isBlankInvitation(draft: Event) {
  return draft.templateId === `${draft.kind}-blank`;
}

export function blankInvitation(draft: Event): Event {
  return {
    ...draft,
    template: "classic",
    templateId: `${draft.kind}-blank`,
    designMode: "flyer",
    opening: null,
    sections: [
      {
        id: "blank-canvas",
        icon: "none",
        heading: "Sección 1",
        body: "",
        canvas: blankCanvas(draft.accentColor, draft.kind),
      },
    ],
  };
}
