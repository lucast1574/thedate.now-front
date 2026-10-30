import Link from "next/link";
import Icon from "@/components/icon";
import type { Person } from "@/lib/events/seating";
import type { RSVPDetails } from "./types";
export default function RSVPReceipt({
  details,
  response,
  companions,
}: {
  details: RSVPDetails;
  response: string;
  companions: Person[];
}) {
  const attending = response !== "not_going";
  return (
    <main className="rsvp-page">
      <section className="rsvp-card rsvp-receipt">
        <Icon name="check" />
        <p className="eyebrow">CONFIRMACIÓN GUARDADA</p>
        <h1>Gracias, {details.guestName}.</h1>
        <p>
          Tu respuesta para <strong>{details.eventTitle}</strong> ya está
          registrada.
        </p>
        <p className="rsvp-current-choice">
          {response === "going"
            ? "Sí, asistiré"
            : response === "maybe"
              ? "Tal vez"
              : "No podré asistir"}
        </p>
        {attending && (
          <>
            <p>
              {1 + companions.length}{" "}
              {companions.length ? "personas" : "persona"}, contándote a ti.
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
        <p>
          Para solicitar un cambio, comunícate con quienes organizan la
          celebración.
        </p>
        <Link className="office-button" href="/">
          Ver invitación
        </Link>
      </section>
    </main>
  );
}
