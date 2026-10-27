import CelebrationAudience from "@/components/celebration-audience";
import { defaultCelebration } from "@/lib/events/celebration";
import type { Event } from "@/lib/events/types";
import type { Dispatch, SetStateAction } from "react";
export default function EventAudience({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  return (
    <CelebrationAudience
      value={draft.celebration || defaultCelebration(draft.kind === "wedding")}
      onChange={(patch) =>
        setDraft((current) => ({
          ...current,
          celebration: {
            ...(current.celebration ||
              defaultCelebration(current.kind === "wedding")),
            ...patch,
          },
        }))
      }
    />
  );
}
