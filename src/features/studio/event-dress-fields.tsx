import type { Dispatch, SetStateAction } from "react";
import type { Event } from "@/lib/events/types";
import { defaultCelebration } from "@/lib/events/celebration";
export default function EventDressFields({
  draft,
  setDraft,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
}) {
  return (
    <section className="event-form-card">
      <h2>Vestimenta e indicaciones</h2>
      {(
        [
          ["dressCode", "Dress code", 120],
          ["dressNote", "Detalle de la vestimenta", 500],
          ["restrictionText", "Restricciones o indicaciones (opcional)", 1000],
        ] as const
      ).map(([key, label, maxLength]) => (
        <label key={key}>
          {label}
          <textarea
            rows={2}
            maxLength={maxLength}
            value={draft.celebration?.[key] || ""}
            onChange={(e) =>
              setDraft((current) => ({
                ...current,
                celebration: {
                  ...(current.celebration ||
                    defaultCelebration(current.kind === "wedding")),
                  [key]: e.target.value,
                },
              }))
            }
          />
        </label>
      ))}
    </section>
  );
}
