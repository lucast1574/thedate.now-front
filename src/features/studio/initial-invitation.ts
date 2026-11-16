import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import { eventPayload } from "@/lib/events/draft";
import { invitationTemplates } from "@/lib/events/template-catalog";
import type { Event } from "@/lib/events/types";
import { applyCompleteTemplate } from "@/features/designer/apply-template-design";
import { designPayload } from "@/features/designer/design-state";
import { blankInvitation, isBlankInvitation } from "./blank-invitation";

export function initialInvitation(
  draft: Event,
  i18n: Translator = spanishTranslator,
) {
  if (isBlankInvitation(draft)) {
    const designed = blankInvitation(draft, i18n);
    return {
      ...eventPayload(designed, i18n),
      initialDesign: designPayload(designed, i18n),
    };
  }
  const template = invitationTemplates(i18n).find(
    (item) =>
      item.id === draft.templateId &&
      item.kind === draft.kind &&
      item.mode === "flyer",
  );
  if (!template || draft.designMode !== "flyer")
    return eventPayload(draft, i18n);
  const designed = {
    ...draft,
    ...applyCompleteTemplate(draft, template, undefined, i18n),
  };
  return {
    ...eventPayload(designed, i18n),
    initialDesign: designPayload(designed, i18n),
  };
}
