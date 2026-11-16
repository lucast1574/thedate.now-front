import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import { templateOpeningChoice } from "./template-opening-choice";
import type { DesignEvent } from "@/lib/events/types";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { defaultCelebration } from "@/lib/events/celebration";
import { templateSequence } from "./template-sequence";
import { type TemplateSource as Source } from "./template-extras";
import { preserveTemplateContent } from "./template-content";
import { templatePhotoVariant } from "./template-photo-variant";
export function applyCompleteTemplate(
  draft: Source,
  template: InvitationTemplate,
  photos = true,
  i18n: Translator = spanishTranslator,
): DesignEvent {
  if (draft.kind !== template.kind || template.mode !== "flyer") return draft;
  return {
    ...draft,
    template: template.style,
    templateId: template.id,
    designMode: "flyer",
    accentColor: template.accent,
    backgroundImage: draft.backgroundImage,
    opening: templateOpeningChoice(draft, template, i18n),
    celebration:
      draft.celebration || defaultCelebration(draft.kind === "wedding", i18n),
    sections: preserveTemplateContent(
      draft,
      templatePhotoVariant(
        templateSequence(template, draft, i18n),
        photos,
        template.accent,
        template,
        i18n,
      ),
      i18n,
    ),
  };
}
