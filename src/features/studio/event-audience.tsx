import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

  return (
    <CelebrationAudience
      value={
        draft.celebration || defaultCelebration(draft.kind === "wedding", i18n)
      }
      onChange={(patch) =>
        setDraft((current) => ({
          ...current,
          celebration: {
            ...(current.celebration ||
              defaultCelebration(current.kind === "wedding", i18n)),
            ...patch,
          },
        }))
      }
    />
  );
}
