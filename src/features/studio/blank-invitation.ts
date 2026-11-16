import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import { blankCanvas } from "@/features/designer/flyer/canvas-model";
import type { Event } from "@/lib/events/types";

export function isBlankInvitation(draft: Event) {
  return draft.templateId === `${draft.kind}-blank`;
}

export function blankInvitation(
  draft: Event,
  i18n: Translator = spanishTranslator,
): Event {
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
        heading: i18n("Sección 1"),
        body: "",
        canvas: blankCanvas(draft.accentColor, draft.kind),
      },
    ],
  };
}
