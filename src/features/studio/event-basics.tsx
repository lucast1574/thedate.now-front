import type { Dispatch, SetStateAction } from "react";
import type { Event } from "@/lib/events/types";
import { invitationHost as host } from "@/lib/events/domains";
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
            kind === "wedding" ? "Álvaro y Laura" : "Cumpleaños de Lucas"
          }
        />
      </label>
      <label>
        Dirección de la invitación
        <input
          required
          disabled={!!selected}
          pattern="[a-z0-9][a-z0-9-]*[a-z0-9]|[a-z0-9]"
          value={draft.slug}
          onChange={(e) =>
            setDraft({
              ...draft,
              slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
            })
          }
          placeholder={kind === "wedding" ? "alvaroylaura" : "cumpleanoslucas"}
        />
        <small>
          {draft.slug
            ? host(draft.kind, draft.slug)
            : kind === "wedding"
              ? "tunombre.save.thedate.now"
              : "tunombre.thedate.now"}
        </small>
      </label>
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
