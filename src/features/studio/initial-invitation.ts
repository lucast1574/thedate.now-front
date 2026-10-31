import { eventPayload } from "@/lib/events/draft";
import { invitationTemplates } from "@/lib/events/template-catalog";
import type { Event } from "@/lib/events/types";
import { applyCompleteTemplate } from "@/features/designer/apply-template-design";
import { designPayload } from "@/features/designer/design-state";

export function initialInvitation(draft: Event) {
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
