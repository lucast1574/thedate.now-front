import { type Dispatch, type SetStateAction } from "react";
import { useEffect, useRef } from "react";
import type { Event } from "@/lib/events/types";
import DatePicker from "@/components/date-picker";
import EventNames from "./event-names";
import { weddingContent } from "@/lib/events/product-content";
import TimePicker from "@/components/time-picker";
import SubdomainField from "./subdomain-field";
import { browserTimeZone } from "@/lib/events/draft";
import { suggestedAddress } from "@/lib/events/event-form";
export default function EventBasics({
  draft,
  setDraft,
  selected,
}: {
  draft: Event;
  setDraft: Dispatch<SetStateAction<Event>>;
  selected: boolean;
}) {
  const wedding = draft.kind === "wedding";
  const titleInput = useRef<HTMLTextAreaElement>(null);
  const wrongProduct = !wedding && weddingContent(draft.title);
  useEffect(() => {
    titleInput.current?.setCustomValidity(
      wrongProduct ? "Para crear una boda utiliza Save the Date." : "",
    );
  }, [wrongProduct]);
  const [date, time] = draft.startAt.split("T");
  return (
    <>
      <EventNames draft={draft} setDraft={setDraft} />
      <label>
        {wedding ? "Nombre de la boda" : "¿Cómo se llama tu evento?"}
        <textarea
          ref={titleInput}
          rows={wedding ? 2 : 1}
          required
          maxLength={160}
          value={draft.title}
          onChange={(e) =>
            setDraft({
              ...draft,
              title: e.target.value,
              ...(!selected ? { slug: suggestedAddress(e.target.value) } : {}),
            })
          }
          placeholder={wedding ? "Sofía y Mateo" : "Cumpleaños de Lucas"}
        />
      </label>
      {!wedding && weddingContent(draft.title) && (
        <p role="alert">
          Para una boda, crea tu invitación en{" "}
          <a href="https://studio.save.thedate.now">Save the Date</a>.
        </p>
      )}
      <div className="form-grid event-date-row">
        <DatePicker
          label="¿Qué día?"
          required
          value={date || ""}
          onChange={(value) =>
            setDraft({
              ...draft,
              startAt: `${value}T${time?.slice(0, 5) || "18:00"}`,
              timeZone: browserTimeZone(),
            })
          }
        />
        <TimePicker
          label="¿A qué hora?"
          required
          value={time?.slice(0, 5) || "18:00"}
          onChange={(value) =>
            setDraft({
              ...draft,
              startAt: `${date || ""}T${value}`,
              timeZone: browserTimeZone(),
            })
          }
        />
      </div>
      <SubdomainField
        kind={draft.kind}
        value={draft.slug}
        disabled={selected}
        onChange={(slug) => {
          setDraft({ ...draft, slug });
        }}
      />
      {selected && (
        <small>
          Tu enlace ya está publicado y se conserva para tus invitados.
        </small>
      )}
    </>
  );
}
