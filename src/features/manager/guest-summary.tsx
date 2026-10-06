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
  const used = stats.confirmed + stats.held;
  return (
    <section className="guest-metrics" aria-label="Aforo y confirmaciones">
      <div>
        <small>Aforo reservado</small>
        <strong>
          {used}{" "}
          <span>
            / {event.capacityUnlimited ? "ilimitado" : event.capacity}
          </span>
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
        <small>Pidieron tiempo</small>
        <strong>{stats.held}</strong>
        <p>Personas con reserva temporal</p>
      </div>
      <div>
        <small>No asistirán / sin respuesta</small>
        <strong>
          {stats.declined} / {stats.pending}
        </strong>
        <p>Invitaciones · {stats.invited} cupos máximos invitados</p>
      </div>
    </section>
  );
}
