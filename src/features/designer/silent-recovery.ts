import type { DesignEvent } from "@/lib/events/types";
export const recoveryKey = (id: string) => `invitation-work:${id}`;
export function restoreDesign(event: DesignEvent, fallback: DesignEvent) {
  try {
    const stored = JSON.parse(
      localStorage.getItem(recoveryKey(event.id)) || "null",
    );
    if (
      stored?.version === (event.designVersion || 0) &&
      stored.draft?.id === event.id
    )
      return stored.draft as DesignEvent;
  } catch {
    /* Server rendering and unavailable storage use the saved design. */
  }
  return fallback;
}
