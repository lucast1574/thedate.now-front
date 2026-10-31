import { templateSequence } from "./template-sequence";
import { invitationTemplates } from "@/lib/events/template-catalog";
import { adaptTemplateCanvas } from "./adapt-template-content";
import type { DesignEvent, DesignSection } from "@/lib/events/types";
import type { FlyerElement } from "@/lib/events/flyer";
const key = (item: FlyerElement) => item.id.replace(/^[a-f0-9]{8}-/i, "");
function sectionRole(section: DesignSection) {
  const elements = section.canvas?.elements || [];
  const bound = elements.find((e) =>
    [
      "couple_names",
      "event_title",
      "dress_code",
      "location",
      "rsvp_link",
      "gift_link",
      "calendar_link",
      "map",
    ].includes(e.binding || ""),
  );
  if (bound) return bound.binding;
  if (elements.some((e) => key(e) === "story")) return "story";
  return undefined;
}
function preserveSection(
  next: DesignSection,
  previous: DesignSection,
  defaults?: DesignSection,
) {
  if (!next.canvas || !previous.canvas)
    return { ...previous, ...next, body: previous.body };
  const used = new Set<string>();
  const elements = next.canvas.elements.map((target) => {
    const source =
      previous.canvas!.elements.find(
        (e) =>
          !used.has(e.id) &&
          e.type === target.type &&
          ((target.binding && e.binding === target.binding) ||
            key(e) === key(target)),
      ) ||
      (target.type === "image"
        ? previous.canvas!.elements.find(
            (e) => e.type === "image" && !used.has(e.id),
          )
        : undefined);
    if (!source) return target;
    used.add(source.id);
    const item = {
      ...target,
      text:
        source.text ===
          defaults?.canvas?.elements.find((e) => key(e) === key(source))
            ?.text ||
        [
          "El comienzo de una nueva aventura",
          "Los mejores momentos se comparten",
        ].includes(source.text || "")
          ? target.text
          : source.text,
      photoKey: source.photoKey,
      locked: source.locked,
      groupId: source.groupId,
      ...(source.binding
        ? { binding: source.binding, eventBound: source.eventBound }
        : {}),
      ...(source.binding === "dress_code"
        ? {
            dressStyle: source.dressStyle,
            dressPaletteStyle: source.dressPaletteStyle,
            dressPhotoKey: source.dressPhotoKey,
            dressIcon: source.dressIcon,
            dressExcludedColors: source.dressExcludedColors,
          }
        : {}),
      ...(source.binding === "location"
        ? {
            address: source.address,
            link: source.link,
            locationStyle: source.locationStyle,
            actionHint: source.actionHint,
            hintText: source.hintText,
            hintStyle: source.hintStyle,
            hintIcon: source.hintIcon,
          }
        : {}),
      ...(source.binding === "restrictions"
        ? {
            restrictionIcon: source.restrictionIcon,
            restrictionStyle: source.restrictionStyle,
          }
        : {}),
    };
    return item;
  });
  const extra = previous.canvas.elements.filter(
    (e) =>
      !used.has(e.id) &&
      !key(e).startsWith("motif-") &&
      !key(e).startsWith("initials"),
  );
  if (elements.length + extra.length > 60) return previous;
  return {
    ...next,
    id: previous.id,
    heading: previous.heading,
    body: previous.body,
    photoKey: previous.photoKey,
    guestText: previous.guestText,
    canvas: {
      ...next.canvas,
      height: Math.max(next.canvas.height, previous.canvas.height),
      elements: [
        ...extra.filter((e) => e.type === "image"),
        ...elements,
        ...extra.filter((e) => e.type !== "image"),
      ],
    },
  };
}
export function preserveTemplateContent(
  draft: DesignEvent,
  generated: DesignSection[],
) {
  const old = draft.sections || [],
    matched = new Set<string>();
  const priorTemplate = invitationTemplates.find(
    (t) => t.id === draft.templateId,
  );
  const baseline =
    old.length && priorTemplate ? templateSequence(priorTemplate, draft) : [];
  const next = generated.map((section) => {
    const role = sectionRole(section);
    const previous =
      old.find((s) => !matched.has(s.id) && s.heading === section.heading) ||
      (role
        ? old.find((s) => !matched.has(s.id) && sectionRole(s) === role)
        : undefined);
    if (!previous) return section;
    matched.add(previous.id);
    return preserveSection(
      section,
      previous,
      baseline.find((s) => s.heading === previous.heading),
    );
  });
  const remaining = old.filter((s) => !matched.has(s.id));
  // New optional pages never displace the customer's own sections at the limit.
  return [
    ...next.filter((s) => matched.has(s.id)),
    ...remaining,
    ...next.filter((s) => !matched.has(s.id)),
  ]
    .slice(0, 20)
    .map((s) => ({
      ...s,
      canvas: s.canvas ? adaptTemplateCanvas(s.canvas) : undefined,
    }))
    .sort((a, b) => {
      const ai = next.findIndex((s) => s.id === a.id),
        bi = next.findIndex((s) => s.id === b.id);
      return (ai < 0 ? 100 : ai) - (bi < 0 ? 100 : bi);
    });
}
