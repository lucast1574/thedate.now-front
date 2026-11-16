import { useTranslator } from "@/lib/i18n/react";
import { fullName, partySeats, responseLabel } from "@/lib/events/attendees";
import { useClock } from "@/components/use-clock";
import type { Guest } from "@/lib/events/types";
export default function GuestList({ guests }: { guests: Guest[] }) {
  const i18n = useTranslator();

  const now = useClock();
  return (
    <div className="guest-list">
      {guests.length === 0 ? (
        <p>{i18n("Aún no hay invitados.")}</p>
      ) : (
        guests.map((g) => (
          <div key={g.id}>
            <strong>{fullName(g)}</strong>
            <span>{g.phone}</span>
            <span>
              {partySeats(g)}{" "}
              {partySeats(g) === 1 ? i18n("persona") : i18n("personas")}
            </span>
            <a href={g.invitationUrl} target="_blank" rel="noopener noreferrer">
              {i18n("Enlace ↗")}
            </a>
            <small>{responseLabel(g, now, i18n)}</small>
          </div>
        ))
      )}
    </div>
  );
}
