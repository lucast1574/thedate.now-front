"use client";
import { useTranslator } from "@/lib/i18n/react";

import { personalPath } from "@/lib/events/personal-links";
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
  const i18n = useTranslator();

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
        invitationHref={personalPath(token, details.guestName)}
        response={response}
        companions={rsvp.companions}
        onContinue={rsvp.resume}
      />
    );
  return (
    <main className="rsvp-page">
      <section className="rsvp-card">
        <p className="eyebrow">{i18n("CONFIRMA TU ASISTENCIA")}</p>
        <h1>
          {saved
            ? i18n("Respuesta recibida.")
            : details
              ? i18n("Hola, {v0}.", { v0: details.guestName })
              : i18n("Tu invitación")}
        </h1>
        {details && (
          <>
            <p>
              {i18n("Te invitaron a")} <strong>{details.eventTitle}</strong>
              {i18n(". Tu invitación")}{" "}
              {details.seats === 1
                ? i18n("es solo para ti.")
                : i18n("te permite llevar hasta {v0} {v1}.", {
                    v0: details.seats - 1,
                    v1:
                      details.seats === 2
                        ? i18n("acompañante")
                        : i18n("acompañantes"),
                  })}
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
                  ? i18n("Unirse al evento virtual")
                  : i18n("Cómo llegar con Google Maps")}{" "}
                ↗
              </a>
            )}
          </>
        )}
        {saved ? (
          <p>
            {i18n(
              "Tu confirmación ya está registrada. Para solicitar un cambio, comunícate con quienes organizan la celebración.",
            )}
          </p>
        ) : (
          details && (
            <form onSubmit={submit}>
              {details.response === "pending" ||
              details.response === "maybe" ||
              !details.response ? (
                <ResponseFields
                  maybeEnabled={details.maybeEnabled !== false}
                  response={response}
                  reason={reason}
                  onResponse={setResponse}
                  onReason={setReason}
                />
              ) : (
                <>
                  <p className="rsvp-current-choice">
                    {response === "going"
                      ? i18n("Asistirás a la celebración")
                      : response === "maybe"
                        ? i18n("Has respondido: Tal vez")
                        : i18n("Has respondido: No asistiré")}
                  </p>
                  {response === "maybe" && (
                    <label>
                      {i18n("Cuéntanos por qué estás en espera")}{" "}
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
                    ? i18n("Confirmarás")
                    : i18n("Reservarás temporalmente")}{" "}
                  {1 + rsvp.companions.length}{" "}
                  {rsvp.companions.length ? i18n("personas") : i18n("persona")}
                  {i18n(", contándote a ti.")}{" "}
                  {details.seats > 1 &&
                    (response === "maybe"
                      ? i18n(
                          " Tus acompañantes quedarán guardados. Puedes confirmar Sí o No después.",
                        )
                      : i18n(
                          " Revisa los nombres antes de guardar. Esta confirmación se registra una sola vez.",
                        ))}
                </p>
              )}
              <ActionButton className="office-button" disabled={busy}>
                {response === "maybe"
                  ? i18n("Guardar respuesta pendiente")
                  : i18n("Guardar confirmación")}
              </ActionButton>
            </form>
          )
        )}
        {error && <Alert>{error}</Alert>}
      </section>
    </main>
  );
}
