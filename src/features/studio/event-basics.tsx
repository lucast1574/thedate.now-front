import { useState, type Dispatch, type SetStateAction } from "react";
import type { Event } from "@/lib/events/types";
import DatePicker from "@/components/date-picker";
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
  const [customAddress, setCustomAddress] = useState(selected);
  const wedding = draft.kind === "wedding";
  const [date, time] = draft.startAt.split("T");
  return (
    <>
      <label>
        {wedding ? "¿Cómo se llaman los novios?" : "¿Cómo se llama tu evento?"}
        <input
          required
          maxLength={200}
          value={draft.title}
          onChange={(e) =>
            setDraft({
              ...draft,
              title: e.target.value,
              ...(!customAddress
                ? { slug: suggestedAddress(e.target.value) }
                : {}),
            })
          }
          placeholder={wedding ? "Sofía y Mateo" : "Cumpleaños de Lucas"}
        />
      </label>
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
          setCustomAddress(true);
          setDraft({ ...draft, slug });
        }}
      />
    </>
  );
}
