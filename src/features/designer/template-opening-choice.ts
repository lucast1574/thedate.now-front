import { invitationTemplates } from "@/lib/events/template-catalog";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import type { DesignEvent } from "@/lib/events/types";
import { defaultOpening, type Opening } from "@/lib/events/celebration";
import { templateOpening } from "./template-extras";
function same(a: Opening, b: Opening) {
  return (
    (
      [
        "enabled",
        "style",
        "message",
        "buttonLabel",
        "paletteMode",
        "title",
        "font",
        "sealIcon",
        "backgroundImage",
      ] as const
    ).every(
      (k) =>
        JSON.stringify(a[k] || undefined) === JSON.stringify(b[k] || undefined),
    ) &&
    (a.paletteMode !== "custom" || (a.color === b.color && a.ink === b.ink))
  );
}
export function templateOpeningChoice(
  draft: DesignEvent,
  next: InvitationTemplate,
) {
  const current = draft.opening;
  if (!current) return templateOpening(next);
  if (!current.enabled) return current;
  const old = invitationTemplates.find((t) => t.id === draft.templateId);
  const generic = defaultOpening(draft.kind === "wedding");
  const previous = old ? templateOpening(old) : generic;
  const legacy = {
    ...previous,
    message: generic.message,
    font: undefined,
    sealIcon: undefined,
  };
  return same(current, generic) ||
    same(current, previous) ||
    same(current, legacy)
    ? templateOpening(next)
    : current;
}
