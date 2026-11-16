import { useTranslator } from "@/lib/i18n/react";
import type { Deployment } from "./use-deployment";
import ActionButton from "@/components/action-button";
import type { Event } from "@/lib/events/types";
import { invitationHost as host } from "@/lib/events/domains";
export default function PublicationPanel({
  selected,
  deployment,
  busy,
  publishing = false,
  paymentsEnabled,
  checkout,
  publish,
}: {
  selected: Event;
  deployment: Deployment | null;
  busy: boolean;
  publishing?: boolean;
  paymentsEnabled: boolean;
  checkout: () => void;
  publish: () => void;
}) {
  const i18n = useTranslator();

  const ready =
    selected.publishedAt &&
    deployment?.phase === "ready" &&
    deployment.host === host(selected.kind, selected.slug);
  const preparing =
    publishing ||
    Boolean(deployment && !["error", "ready"].includes(deployment.phase));
  return (
    <section id="publicacion" className="publication-panel">
      <div className="office-divider" />
      <div className="action-row">
        <div>
          <p className="office-kicker">{i18n("PUBLICACIÓN")}</p>
          <h2>{i18n("Comparte tu invitación")}</h2>
          <p>
            {i18n(
              "Publica tu diseño para que tus invitados puedan abrir su enlace personal.",
            )}
          </p>
          {preparing && selected.paymentStatus === "paid" && (
            <div
              className="publication-loading"
              role="status"
              aria-live="polite"
            >
              <span className="publication-spinner" aria-hidden="true" />
              <p>
                {i18n(
                  "Estamos preparando tu invitación. El enlace aparecerá aquí cuando esté disponible en internet.",
                )}
              </p>
            </div>
          )}
          {ready && <p className="publication-address">{deployment.host}</p>}
          {deployment?.error && (
            <p role="alert">
              {i18n(
                "No pudimos publicar tu invitación. Tus cambios están guardados; puedes volver a intentarlo.",
              )}
            </p>
          )}
        </div>
        <div>
          {selected.paymentStatus !== "paid" ? (
            <ActionButton
              className="office-button"
              disabled={busy || !paymentsEnabled}
              onClick={checkout}
            >
              {paymentsEnabled ? i18n("Pagar") : i18n("Pagos en preparación")} ·{" "}
              {selected.kind === "wedding" ? "USD 20" : "USD 10"}
            </ActionButton>
          ) : ready ? (
            <a
              className="office-button"
              href={`https://${host(selected.kind, selected.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {i18n("Ver invitación ↗")}
            </a>
          ) : (
            <ActionButton
              className="office-button"
              disabled={busy || preparing}
              onClick={publish}
            >
              {deployment?.phase === "error"
                ? i18n("Reintentar publicación")
                : preparing
                  ? i18n("Preparando invitación…")
                  : i18n("Publicar invitación ↗")}
            </ActionButton>
          )}
        </div>
      </div>
    </section>
  );
}
