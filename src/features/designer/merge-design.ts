import type { DesignEvent } from "@/lib/events/types";
// Refresh persisted fields without replacing edits the user has not saved yet.
export function mergeDesign(
  current: DesignEvent,
  baseline: DesignEvent,
  incoming: DesignEvent,
): DesignEvent {
  const merged = { ...current };
  for (const field of [
    "title",
    "description",
    "template",
    "templateId",
    "accentColor",
    "sections",
    "designMode",
  ] as const) {
    if (JSON.stringify(current[field]) === JSON.stringify(baseline[field]))
      Object.assign(merged, { [field]: incoming[field] });
  }
  merged.photoKeys = [
    ...new Set([...(incoming.photoKeys ?? []), ...(current.photoKeys ?? [])]),
  ];
  return merged;
}
