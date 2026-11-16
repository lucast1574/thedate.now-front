import { useTranslator } from "@/lib/i18n/react";
import type { Dispatch, SetStateAction } from "react";
import type { Event } from "@/lib/events/types";
import { defaultCelebration } from "@/lib/events/celebration";
import { capitalizedNames } from "@/lib/events/invitation-title";
export default function EventNames({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  const i18n = useTranslator();

  if (draft.kind !== "wedding") return null;
  return (
    <div className="form-grid">
      {(["partnerOne", "partnerTwo"] as const).map((key, n) => (
        <label key={key}>
          {n
            ? i18n("Nombre del otro novio o novia")
            : i18n("Nombre de uno de los novios")}
          <input
            maxLength={60}
            value={draft.celebration?.[key] || ""}
            placeholder={n ? i18n("Mateo") : i18n("Sofía")}
            onBlur={() =>
              setDraft((current) => ({
                ...current,
                celebration: {
                  ...(current.celebration || defaultCelebration(true, i18n)),
                  [key]: capitalizedNames(current.celebration?.[key] || ""),
                },
              }))
            }
            onChange={(e) =>
              setDraft((current) => ({
                ...current,
                celebration: {
                  ...(current.celebration || defaultCelebration(true, i18n)),
                  [key]: e.target.value,
                },
              }))
            }
          />
        </label>
      ))}
    </div>
  );
}
