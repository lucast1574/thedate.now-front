import type { DesignEvent } from "@/lib/events/types";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { defaultCelebration } from "@/lib/events/celebration";
import { templateSequence } from "./template-sequence";
import {
  templateOpening,
  type TemplateSource as Source,
} from "./template-extras";
import { preserveTemplateContent } from "./template-content";
import { templatePhotoVariant } from "./template-photo-variant";
export function applyCompleteTemplate(
  draft: Source,
  template: InvitationTemplate,
  photos = true,
): DesignEvent {
  if (draft.kind !== template.kind || template.mode !== "flyer") return draft;
  return {
    ...draft,
    template: template.style,
    templateId: template.id,
    designMode: "flyer",
    accentColor: template.accent,
    backgroundImage: draft.backgroundImage,
    opening: draft.opening || templateOpening(template),
    celebration:
      draft.celebration || defaultCelebration(draft.kind === "wedding"),
    sections: preserveTemplateContent(
      draft,
      templatePhotoVariant(
        templateSequence(template, draft),
        photos,
        template.accent,
      ),
    ),
  };
}
