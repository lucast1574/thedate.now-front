import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

  const stats = guestStats(guests, useClock());
  const awaiting = guests
    .filter((g) => g.invitationHeld)
    .reduce((sum, g) => sum + g.seats, 0);
  const used = stats.confirmed + stats.held + awaiting;
  return (
    <section
      className="guest-metrics"
      aria-label={i18n("Aforo y confirmaciones")}
    >
      <div>
        <small>{i18n("Personas que puedes recibir")}</small>
        <strong>
          {event.capacityUnlimited ? i18n("Sin límite") : event.capacity}{" "}
          <span>{event.capacityUnlimited ? "" : i18n("personas")}</span>
        </strong>
        <p>
          {event.capacityUnlimited
            ? i18n("Sin límite de aforo")
            : `${Math.max(0, event.capacity - used)} plazas disponibles`}
        </p>
        {!event.capacityUnlimited && (
          <progress max={Math.max(1, event.capacity)} value={used} />
        )}
      </div>
      <div>
        <small>{i18n("Confirmados")}</small>
        <strong>{stats.confirmed}</strong>
        <p>{i18n("Personas, incluidos acompañantes")}</p>
      </div>
      <div>
        <small>{i18n("Esperando respuesta")}</small>
        <strong>{awaiting + stats.held}</strong>
        <p>
          {awaiting} {i18n("cupos invitados ·")} {stats.held}{" "}
          {i18n("con reserva temporal")}
        </p>
      </div>
      <div>
        <small>{i18n("Por invitar")}</small>
        <strong>
          {
            guests.filter(
              (g) => !g.sentAt && !g.invitationHeld && g.response === "pending",
            ).length
          }
        </strong>
        <p>
          {stats.declined}{" "}
          {i18n("no asistirán · Se avisa al siguiente cuando hay cupo")}
        </p>
      </div>
    </section>
  );
}
