import {
  attendees,
  fullName,
  partySeats,
  responseLabel,
} from "@/lib/events/attendees";
import type { Guest } from "@/lib/events/types";
import type { SeatingPlan } from "@/lib/events/seating";
import PersonGlyph from "@/components/person-glyph";
import GuestActions from "./guest-actions";
export default function GuestRosterRow({
  g,
  index,
  showPosition,
  plan,
  enabled,
  now,
  eventId,
  onUpdated,
  blocked,
}: {
  g: Guest;
  index: number;
  showPosition: boolean;
  plan: SeatingPlan;
  enabled?: boolean;
  now: number;
  eventId?: string;
  onUpdated?: () => Promise<void>;
  blocked?: boolean;
}) {
  return (
    <tr>
      <td>
        {showPosition && (
          <span className="guest-queue-position">{index + 1}</span>
        )}
        <strong>{fullName(g)}</strong>
        {g.family && <small>{g.family}</small>}
        <ul className="party-names">
          {attendees([g]).map((p) => (
            <li key={p.id}>
              <PersonGlyph gender={p.gender} />
              <span>
                {fullName(p)}
                {p.slot ? ` (+${p.slot})` : ""}
              </span>
            </li>
          ))}
        </ul>
      </td>
      <td>
        <span className={`response-pill response-${g.response}`}>
          {responseLabel(g, now)}
        </span>
        {g.maybeReason && <small>{g.maybeReason}</small>}
        {g.maybeExpiresAt && (
          <small>
            Reserva hasta {new Date(g.maybeExpiresAt).toLocaleString("es-PE")}
          </small>
        )}
      </td>
      <td>
        {partySeats(g)} {partySeats(g) === 1 ? "persona" : "personas"}
        <small>Máximo {g.seats}</small>
      </td>
      <td>
        {g.response !== "going" ? (
          <small>
            {g.response === "not_going"
              ? "No asistirá"
              : "Se asignará al confirmar"}
          </small>
        ) : (
          <small>
            {plan.tables.find((t) => t.id === plan.assignments[`${g.id}~0`])
              ?.name || "Sin mesa"}
          </small>
        )}
      </td>
      <td>
        {g.gift ? (
          <>
            <strong>{g.gift.title}</strong>
            <small>
              {g.gift.delivered ? "Recibido" : "Se comprometió a regalarlo"}
            </small>
          </>
        ) : (
          <small>Sin elección</small>
        )}
      </td>
      <td>
        {g.phone}
        <br />
        {g.sentAt && (
          <a target="_blank" rel="noopener noreferrer" href={g.invitationUrl}>
            Enlace personal ↗
          </a>
        )}
        <small>
          {g.sentAt
            ? "WhatsApp enviado"
            : g.sendState === "sending"
              ? "Enviando…"
              : g.sendState === "unknown"
                ? "Envío por verificar"
                : g.sendState === "failed"
                  ? "No se pudo enviar"
                  : enabled
                    ? "Esperando su turno"
                    : "Por enviar"}
        </small>
      </td>
      {eventId && (
        <td>
          <GuestActions
            guest={g}
            eventId={eventId}
            onUpdated={onUpdated}
            blocked={blocked}
          />
        </td>
      )}
    </tr>
  );
}
