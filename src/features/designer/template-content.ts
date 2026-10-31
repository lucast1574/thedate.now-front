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
  if (!next.canvas || !previous.canvas) return { ...next, body: previous.body };
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
  return {
    ...next,
    body: previous.body,
    photoKey: previous.photoKey,
    canvas: {
      ...next.canvas,
      elements,
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
  return next.map((section) => ({
    ...section,
    canvas: section.canvas ? adaptTemplateCanvas(section.canvas) : undefined,
  }));
}
