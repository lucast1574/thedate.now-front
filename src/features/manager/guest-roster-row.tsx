import { useTranslator } from "@/lib/i18n/react";
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
import Link from "next/link";
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
  const i18n = useTranslator();

  return (
    <tr>
      <td>
        {showPosition && (
          <span className="guest-queue-position">{index + 1}</span>
        )}
        <strong>{fullName(g)}</strong>
        {eventId && (
          <Link
            className="guest-message-link"
            href={`/manager/${eventId}?tab=messages&guest=${g.id}`}
          >
            {i18n("Ver mensajes")}
          </Link>
        )}
        {g.family && <small>{g.family}</small>}
        <ul className="party-names">
          {attendees([g], i18n).map((p) => (
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
          {responseLabel(g, now, i18n)}
        </span>
        {g.maybeReason && <small>{g.maybeReason}</small>}
        {g.maybeExpiresAt && (
          <small>
            {i18n("Reserva hasta")}{" "}
            {new Date(g.maybeExpiresAt).toLocaleString(i18n.locale)}
          </small>
        )}
      </td>
      <td>
        {partySeats(g)}{" "}
        {partySeats(g) === 1 ? i18n("persona") : i18n("personas")}
        <small>
          {i18n("Máximo")} {g.seats}
        </small>
      </td>
      <td>
        {g.response !== "going" ? (
          <small>
            {g.response === "not_going"
              ? i18n("No asistirá")
              : i18n("Se asignará al confirmar")}
          </small>
        ) : (
          <small>
            {plan.tables.find((t) => t.id === plan.assignments[`${g.id}~0`])
              ?.name || i18n("Sin mesa")}
          </small>
        )}
      </td>
      <td>
        {g.gift ? (
          <>
            <strong>{g.gift.title}</strong>
            <small>
              {g.gift.delivered
                ? i18n("Recibido")
                : i18n("Se comprometió a regalarlo")}
            </small>
          </>
        ) : (
          <small>{i18n("Sin elección")}</small>
        )}
      </td>
      <td>
        {g.phone}
        <br />
        {g.sentAt && (
          <a target="_blank" rel="noopener noreferrer" href={g.invitationUrl}>
            {i18n("Enlace personal ↗")}
          </a>
        )}
        <small>
          {g.sentAt
            ? i18n("WhatsApp enviado")
            : g.sendState === "sending"
              ? i18n("Enviando…")
              : g.sendState === "unknown"
                ? i18n("Envío por verificar")
                : g.sendState === "failed"
                  ? i18n("No se pudo enviar")
                  : enabled
                    ? i18n("Esperando su turno")
                    : i18n("Por enviar")}
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
