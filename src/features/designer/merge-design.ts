import type { DesignEvent } from "@/lib/events/types";
// Refresh persisted fields without replacing edits the user has not saved yet.
export function mergeDesign(
  current: DesignEvent,
  baseline: DesignEvent,
  incoming: DesignEvent,
): DesignEvent {
  const merged = { ...incoming };
  for (const field of [
    "music",
    "opening",
    "backgroundImage",
    "celebration",
    "title",
    "description",
    "template",
    "templateId",
    "accentColor",
    "sections",
    "designMode",
  ] as const) {
    if (JSON.stringify(current[field]) !== JSON.stringify(baseline[field]))
      Object.assign(merged, { [field]: current[field] });
  }
  merged.photoKeys = [
    ...new Set([...(incoming.photoKeys ?? []), ...(current.photoKeys ?? [])]),
  ];
  merged.audioKeys = [
    ...new Set([...(incoming.audioKeys || []), ...(current.audioKeys || [])]),
  ];
  return merged;
}
