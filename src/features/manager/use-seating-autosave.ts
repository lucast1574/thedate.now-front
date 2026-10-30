import { useEffect, useRef, useState } from "react";
import type { SeatingPlan } from "@/lib/events/seating";
export function useSeatingAutosave(
  plan: SeatingPlan,
  dirty: boolean,
  busy: boolean,
  stale: boolean,
  save: () => Promise<boolean>,
) {
  const latestSave = useRef(save);
  const inFlight = useRef(false);
  const [saving, setSaving] = useState(false);
  const [failedPlan, setFailedPlan] = useState<SeatingPlan | null>(null);
  useEffect(() => {
    latestSave.current = save;
  }, [save]);
  const failed = dirty && failedPlan === plan;
  useEffect(() => {
    if (!dirty || busy || stale || failed || inFlight.current) return;
    const timer = setTimeout(() => {
      inFlight.current = true;
      setSaving(true);
      Promise.resolve()
        .then(() => latestSave.current())
        .then((ok) => {
          if (ok === false) setFailedPlan(plan);
        })
        .catch(() => setFailedPlan(plan))
        .finally(() => {
          inFlight.current = false;
          setSaving(false);
        });
    }, 800);
    return () => clearTimeout(timer);
  }, [plan, dirty, busy, stale, failed]);
  return { saving, failed, retry: () => setFailedPlan(null) };
}
