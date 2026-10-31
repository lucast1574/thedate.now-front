import type { DesignEvent } from "@/lib/events/types";
import { designPayload } from "./design-state";
import { mergeDesign } from "./merge-design";

export function recoveryKey(event: DesignEvent) {
  return `invitation-draft:v1:${event.kind}:${event.id}`;
}

export function recoveryRecord(draft: DesignEvent, baseline: DesignEvent) {
  return JSON.stringify({
    version: 1,
    id: draft.id,
    kind: draft.kind,
    savedAt: Date.now(),
    baseline: designPayload(baseline),
    draft: designPayload(draft),
  });
}

export function recoverDesign(raw: string, event: DesignEvent) {
  const record = JSON.parse(raw);
  if (
    record.version !== 1 ||
    record.id !== event.id ||
    record.kind !== event.kind ||
    !Number.isFinite(record.savedAt) ||
    Date.now() - record.savedAt > 30 * 86400000 ||
    typeof record.draft?.title !== "string" ||
    !Array.isArray(record.draft?.sections) ||
    !record.baseline
  )
    return null;
  return mergeDesign(
    { ...event, ...record.draft },
    { ...event, ...record.baseline },
    event,
  );
}
