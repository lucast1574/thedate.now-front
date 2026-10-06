import { fullName, partySeats, responseLabel } from "@/lib/events/attendees";
import { useClock } from "@/components/use-clock";
import type { Guest } from "@/lib/events/types";
export default function GuestList({ guests }: { guests: Guest[] }) {
  const now = useClock();
  return (
    <div className="guest-list">
      {guests.length === 0 ? (
        <p>Aún no hay invitados.</p>
      ) : (
        guests.map((g) => (
          <div key={g.id}>
            <strong>{fullName(g)}</strong>
            <span>{g.phone}</span>
            <span>
              {partySeats(g)} {partySeats(g) === 1 ? "persona" : "personas"}
            </span>
            <a href={g.invitationUrl} target="_blank" rel="noopener noreferrer">
              Enlace ↗
            </a>
            <small>{responseLabel(g, now)}</small>
          </div>
        ))
      )}
    </div>
  );
}
