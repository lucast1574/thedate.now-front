"use client";
import RSVPReceipt from "./rsvp-receipt";
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
  if (saved && details)
    return (
      <RSVPReceipt
        details={details}
        response={response}
        companions={rsvp.companions}
        onContinue={rsvp.resume}
      />
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
            {details.response === "pending" && (
              <EventDetails event={details} variant="rsvp" />
            )}
            {placeLink && details.response === "pending" && (
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
            Tu confirmación ya está registrada. Para solicitar un cambio,
            comunícate con quienes organizan la celebración.
          </p>
        ) : (
          details && (
            <form onSubmit={submit}>
              {details.response === "pending" ||
              details.response === "maybe" ||
              !details.response ? (
                <ResponseFields
                  response={response}
                  reason={reason}
                  onResponse={setResponse}
                  onReason={setReason}
                />
              ) : (
                <>
                  <p className="rsvp-current-choice">
                    {response === "going"
                      ? "Asistirás a la celebración"
                      : response === "maybe"
                        ? "Has respondido: Tal vez"
                        : "Has respondido: No asistiré"}
                  </p>
                  {response === "maybe" && (
                    <label>
                      Cuéntanos por qué estás en espera
                      <textarea
                        required
                        minLength={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </label>
                  )}
                </>
              )}
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
                    (response === "maybe"
                      ? " Tus acompa\u00f1antes quedar\u00e1n guardados. Puedes confirmar S\u00ed o No despu\u00e9s."
                      : " Revisa los nombres antes de guardar. Esta confirmaci\u00f3n se registra una sola vez.")}
                </p>
              )}
              <ActionButton className="office-button" disabled={busy}>
                {response === "maybe"
                  ? "Guardar respuesta pendiente"
                  : "Guardar confirmaci\u00f3n"}
              </ActionButton>
            </form>
          )
        )}
        {error && <Alert>{error}</Alert>}
      </section>
    </main>
  );
}
