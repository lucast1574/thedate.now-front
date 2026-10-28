import type { Event, Guest } from "@/lib/events/types";
import { guestStats } from "@/lib/events/attendees";
import { useClock } from "@/components/use-clock";
export default function GuestSummary({
  event,
  guests,
}: {
  event: Event;
  guests: Guest[];
}) {
  const stats = guestStats(guests, useClock());
  const awaiting = guests
    .filter((g) => g.invitationHeld)
    .reduce((sum, g) => sum + g.seats, 0);
  const used = stats.confirmed + stats.held + awaiting;
  return (
    <section className="guest-metrics" aria-label="Aforo y confirmaciones">
      <div>
        <small>Personas que puedes recibir</small>
        <strong>
          {event.capacityUnlimited ? "Sin límite" : event.capacity}{" "}
          <span>{event.capacityUnlimited ? "" : "personas"}</span>
        </strong>
        <p>
          {event.capacityUnlimited
            ? "Sin límite de aforo"
            : `${Math.max(0, event.capacity - used)} plazas disponibles`}
        </p>
        {!event.capacityUnlimited && (
          <progress max={Math.max(1, event.capacity)} value={used} />
        )}
      </div>
      <div>
        <small>Confirmados</small>
        <strong>{stats.confirmed}</strong>
        <p>Personas, incluidos acompañantes</p>
      </div>
      <div>
        <small>Esperando respuesta</small>
        <strong>{awaiting + stats.held}</strong>
        <p>
          {awaiting} cupos invitados · {stats.held} con reserva temporal
        </p>
      </div>
      <div>
        <small>Por invitar</small>
        <strong>
          {
            guests.filter(
              (g) => !g.sentAt && !g.invitationHeld && g.response === "pending",
            ).length
          }
        </strong>
        <p>
          {stats.declined} no asistirán · Se avisa al siguiente cuando hay cupo
        </p>
      </div>
    </section>
  );
}
