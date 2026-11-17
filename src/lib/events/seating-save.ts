import type { SeatingPlan } from "./seating";

export function reconcileSeatingSave(
  current: SeatingPlan,
  submitted: SeatingPlan,
  saved: SeatingPlan,
) {
  const dirty = current !== submitted;
  return {
    plan: dirty ? { ...current, version: saved.version } : saved,
    dirty,
  };
}
