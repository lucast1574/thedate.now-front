import { resolveTemplateId } from "@/lib/events/template-catalog";
import type { DesignEvent } from "@/lib/events/types";
export function designPayload(draft: DesignEvent) {
  return {
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
    sections: draft.sections || [],
  };
}
export function sameDesign(a: DesignEvent, b: DesignEvent) {
  return JSON.stringify(designPayload(a)) === JSON.stringify(designPayload(b));
}
