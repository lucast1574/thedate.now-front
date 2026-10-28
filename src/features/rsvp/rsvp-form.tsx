"use client";
import RSVPCompanions from "./rsvp-companions";
import Alert from "@/components/alert";
import ActionButton from "@/components/action-button";
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
  const virtual = details?.isVirtual;
  const placeLink = safeHTTPSLink(
    virtual ? details?.virtualUrl || "" : details?.mapUrl || "",
  );
  return (
    <main className="rsvp-page">
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
              invitación{" "}
              {details.seats === 1
                ? "es solo para ti."
                : `te permite llevar hasta ${details.seats - 1} ${details.seats === 2 ? "acompañante" : "acompañantes"}.`}
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
                <RSVPCompanions
                  people={rsvp.companions}
                  max={details.seats - 1}
                  onChange={rsvp.setCompanions}
                />
              )}
              {response !== "not_going" && (
                <p>
                  {response === "going"
                    ? "Confirmarás"
                    : "Reservarás temporalmente"}{" "}
                  {1 + rsvp.companions.length}{" "}
                  {rsvp.companions.length ? "personas" : "persona"}, contándote
                  a ti.
                  {details.seats > 1 &&
                    " Si vienes sin acompañantes, sus lugares quedarán disponibles. Añadirlos después dependerá del aforo."}
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
