"use client";
import CompanionFields from "@/components/companion-fields";
import Alert from "@/components/alert";
import ActionButton from "@/components/action-button";
import Brand from "@/components/brand";
import EventDetails from "@/components/event-details";
import ResponseFields from "./response-fields";
import { useRSVP } from "./use-rsvp";
function safeHTTPSLink(raw: string) {
  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}
export default function RSVPForm({ token }: { token: string }) {
  const rsvp = useRSVP(token);
  const {
    details,
    response,
    setResponse,
    reason,
    setReason,
    error,
    saved,
    busy,
    submit,
  } = rsvp;
  const virtual = details?.kind === "general" && details.isVirtual;
  const placeLink = safeHTTPSLink(
    virtual ? details?.virtualUrl || "" : details?.mapUrl || "",
  );
  return (
    <main className="rsvp-page">
      <a
        className="office-brand"
        href={
          details?.kind === "wedding"
            ? "https://save.thedate.now"
            : "https://thedate.now"
        }
      >
        <Brand wedding={details?.kind === "wedding"} />
      </a>
      <section className="rsvp-card">
        <p className="eyebrow">CONFIRMA TU ASISTENCIA</p>
        <h1>
          {saved
            ? "Respuesta recibida."
            : details
              ? `Hola, ${details.guestName}.`
              : "Tu invitación"}
        </h1>
        {details && (
          <>
            <p>
              Te invitaron a <strong>{details.eventTitle}</strong>. Tu
              invitación incluye {details.seats}{" "}
              {details.seats === 1 ? "cupo" : "cupos"}.
            </p>
            <EventDetails event={details} variant="rsvp" />
            {placeLink && (
              <a
                className="rsvp-place-link"
                href={placeLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {virtual
                  ? "Unirse al evento virtual"
                  : "Cómo llegar con Google Maps"}{" "}
                ↗
              </a>
            )}
          </>
        )}
        {saved ? (
          <p>
            Gracias por responder. Puedes volver a este enlace si necesitas
            cambiar tu respuesta.
          </p>
        ) : (
          details && (
            <form onSubmit={submit}>
              <ResponseFields
                response={response}
                reason={reason}
                onResponse={setResponse}
                onReason={setReason}
              />
              {details.seats > 1 && response !== "not_going" && (
                <CompanionFields
                  people={rsvp.companions}
                  max={details.seats - 1}
                  onChange={rsvp.setCompanions}
                />
              )}
              {response !== "not_going" && (
                <p>
                  Confirmarás {1 + rsvp.companions.length} personas, contándote
                  a ti.
                </p>
              )}
              <ActionButton className="office-button" disabled={busy}>
                Enviar respuesta ↗
              </ActionButton>
            </form>
          )
        )}
        {error && <Alert>{error}</Alert>}
      </section>
    </main>
  );
}
