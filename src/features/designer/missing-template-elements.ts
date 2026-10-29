import type { DesignEvent } from "@/lib/events/types";
import type { InvitationTemplate } from "@/lib/events/template-catalog";
import { templateSequence } from "./template-sequence";
export function addMissingTemplateElements(
  draft: DesignEvent,
  template: InvitationTemplate,
) {
  const sections = draft.sections || [];
  const existing = new Set(
    sections
      .flatMap((s) => [
        ...(s.canvas?.elements || []),
        ...(s.guestText ? [s.guestText] : []),
      ])
      .map((e) => e.binding)
      .filter(Boolean),
  );
  const required = new Set([
    draft.kind === "wedding" ? "couple_names" : "event_title",
    "guest_name",
    "event_date",
    "location",
    "dress_code",
    "gift_link",
    "restrictions",
  ]);
  const additions = templateSequence(template, draft).flatMap((page) => {
    const elements = page.canvas!.elements.filter(
      (item) =>
        item.binding &&
        required.has(item.binding) &&
        !existing.has(item.binding),
    );
    return elements.length
      ? [{ ...page, canvas: { ...page.canvas!, elements } }]
      : [];
  });
  return {
    ...draft,
    sections: [
      ...sections,
      ...additions.slice(0, Math.max(0, 20 - sections.length)),
    ],
  };
}
