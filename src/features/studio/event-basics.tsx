import type { Dispatch, SetStateAction } from "react";
import type { Event } from "@/lib/events/types";
import SubdomainField from "./subdomain-field";
import { browserTimeZone } from "@/lib/events/draft";
export default function EventBasics({
  draft,
  setDraft,
  selected,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
  selected: boolean;
}) {
  const kind = draft.kind;
  return (
    <div className="form-grid">
      <label>
        Nombre del evento
        <input
          required
          value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          placeholder={
            kind === "wedding" ? "Sofía y Mateo" : "Cumpleaños de Lucas"
          }
        />
      </label>
      <SubdomainField
        kind={kind}
        value={draft.slug}
        disabled={selected}
        onChange={(slug) => setDraft({ ...draft, slug })}
      />
      <label>
        Fecha y hora
        <input
          required
          type="datetime-local"
          value={draft.startAt.slice(0, 16)}
          onChange={(e) =>
            setDraft({
              ...draft,
              startAt: e.target.value,
              timeZone: browserTimeZone(),
            })
          }
        />
        <small>Hora local del organizador.</small>
      </label>
      <label>
        Organiza
        <input
          required
          value={draft.organizer}
          onChange={(e) => setDraft({ ...draft, organizer: e.target.value })}
          placeholder={
            kind === "wedding"
              ? "La pareja o wedding planner"
              : "Tu nombre u organización"
          }
        />
      </label>
    </div>
  );
}
