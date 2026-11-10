import { eventPayload } from "@/lib/events/draft";
import { invitationTemplates } from "@/lib/events/template-catalog";
import type { Event } from "@/lib/events/types";
import { applyCompleteTemplate } from "@/features/designer/apply-template-design";
import { designPayload } from "@/features/designer/design-state";
import { blankInvitation, isBlankInvitation } from "./blank-invitation";

export function initialInvitation(draft: Event) {
  if (isBlankInvitation(draft)) {
    const designed = blankInvitation(draft);
    return {
      ...eventPayload(designed),
      initialDesign: designPayload(designed),
    };
  }
  const template = invitationTemplates.find(
    (item) =>
      item.id === draft.templateId &&
      item.kind === draft.kind &&
      item.mode === "flyer",
  );
  if (!template || draft.designMode !== "flyer") return eventPayload(draft);
  const designed = { ...draft, ...applyCompleteTemplate(draft, template) };
  return { ...eventPayload(designed), initialDesign: designPayload(designed) };
}
