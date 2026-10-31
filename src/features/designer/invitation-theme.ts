import type { DesignEvent } from "@/lib/events/types";
import type { FlyerElement } from "@/lib/events/flyer";
import { invitationTemplates } from "@/lib/events/template-catalog";
function common<T extends string>(values: T[], fallback: T): T {
  const counts = new Map<T, number>();
  values.forEach((v) => counts.set(v, (counts.get(v) || 0) + 1));
  return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0] || fallback;
}
export function invitationTheme(draft: DesignEvent) {
  const template = invitationTemplates.find((t) => t.id === draft.templateId);
  const elements =
    draft.sections?.flatMap((s) => s.canvas?.elements || []) || [];
  return {
    ink: draft.accentColor,
    background: common(
      (draft.sections || [])
        .map((s) => s.canvas?.background)
        .filter((s): s is string => !!s),
      template?.background || "#ffffff",
    ),
    font:
      draft.sections?.find((s) => s.canvas?.font)?.canvas?.font ||
      common(
        elements.filter((e) => e.type === "text").map((e) => e.font),
        template?.font || (draft.kind === "wedding" ? "serif" : "sans"),
      ),
  };
}
export function updateInvitationTheme(
  draft: DesignEvent,
  next: Partial<ReturnType<typeof invitationTheme>>,
) {
  const before = invitationTheme(draft),
    after = { ...before, ...next };
  const update = (item: FlyerElement) => ({
    ...item,
    color:
      item.color.toLowerCase() === before.ink.toLowerCase()
        ? after.ink
        : item.color,
    font: item.font === before.font ? after.font : item.font,
  });
  return {
    ...draft,
    accentColor: after.ink,
    sections: draft.sections?.map((s) => ({
      ...s,
      guestText: s.guestText ? update(s.guestText) : undefined,
      canvas: s.canvas
        ? {
            ...s.canvas,
            font: after.font,
            background:
              s.canvas.background.toLowerCase() ===
              before.background.toLowerCase()
                ? after.background
                : s.canvas.background,
            elements: s.canvas.elements.map(update),
          }
        : undefined,
    })),
  };
}
