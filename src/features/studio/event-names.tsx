import type { Dispatch, SetStateAction } from "react";
import type { Event } from "@/lib/events/types";
import { defaultCelebration } from "@/lib/events/celebration";
export default function EventNames({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  if (draft.kind !== "wedding") return null;
  return (
    <div className="form-grid">
      {(["partnerOne", "partnerTwo"] as const).map((key, n) => (
        <label key={key}>
          {n ? "Nombre del otro novio o novia" : "Nombre de uno de los novios"}
          <input
            maxLength={60}
            value={draft.celebration?.[key] || ""}
            placeholder={n ? "Mateo" : "Sofía"}
            onChange={(e) =>
              setDraft((current) => ({
                ...current,
                celebration: {
                  ...(current.celebration || defaultCelebration(true)),
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
