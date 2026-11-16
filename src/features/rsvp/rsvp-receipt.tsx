import { useTranslator } from "@/lib/i18n/react";
import Link from "next/link";
import Icon from "@/components/icon";
import type { Person } from "@/lib/events/seating";
import type { RSVPDetails } from "./types";
export default function RSVPReceipt({
  details,
  response,
  companions,
  onContinue,
  invitationHref = "/",
}: {
  details: RSVPDetails;
  response: string;
  companions: Person[];
  onContinue?: () => void;
  invitationHref?: string;
}) {
  const i18n = useTranslator();

  const attending = response !== "not_going";
  return (
    <main className="rsvp-page">
      <section className="rsvp-card rsvp-receipt">
        <Icon name={response === "maybe" ? "clock" : "check"} />
        <p className="eyebrow">
          {response === "maybe"
            ? i18n("RESPUESTA PENDIENTE")
            : i18n("CONFIRMACIÓN GUARDADA")}
        </p>
        <h1>
          {i18n("Gracias,")} {details.guestName}.
        </h1>
        <p>
          {i18n("Tu respuesta para")} <strong>{details.eventTitle}</strong>{" "}
          {i18n("ya está registrada.")}
        </p>
        <p className="rsvp-current-choice">
          {response === "going"
            ? i18n("Sí, asistiré")
            : response === "maybe"
              ? i18n("Tal vez")
              : i18n("No podré asistir")}
        </p>
        {attending && (
          <>
            <p>
              {1 + companions.length}{" "}
              {companions.length ? i18n("personas") : i18n("persona")}
              {i18n(", contándote a ti.")}
            </p>
            {companions.length > 0 && (
              <ul>
                {companions.map((p, n) => (
                  <li key={n}>
                    {p.name} {p.lastName}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
        {response === "maybe" ? (
          <>
            <p>
              {i18n(
                "Guardamos tu respuesta y tus acompañantes. Puedes confirmar Sí o No desde este enlace.",
              )}
            </p>
            {onContinue && (
              <button
                type="button"
                className="office-button"
                onClick={onContinue}
              >
                {i18n("Confirmar Sí o No")}
              </button>
            )}
          </>
        ) : (
          <p>
            {i18n(
              "Para solicitar un cambio, comunícate con quienes organizan la celebración.",
            )}
          </p>
        )}
        {attending && (
          <Link
            className={
              response === "maybe" ? "rsvp-secondary-link" : "office-button"
            }
            href={invitationHref}
          >
            {i18n("Ver invitación")}
          </Link>
        )}
      </section>
    </main>
  );
}
