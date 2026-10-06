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
  const ready =
    selected.publishedAt &&
    deployment?.phase === "ready" &&
    deployment.host === host(selected.kind, selected.slug);
  const preparing =
    publishing ||
    Boolean(deployment && !["error", "ready"].includes(deployment.phase));
  return (
    <>
      <div className="office-divider" />
      <div className="action-row">
        <div>
          <p className="office-kicker">PUBLICACIÓN</p>
          <h2>Comparte tu invitación</h2>
          <p>
            Diseña, guarda y previsualiza gratis. El pago habilita publicación,
            invitados y WhatsApp.
          </p>
          {preparing && selected.paymentStatus === "paid" && (
            <div
              className="publication-loading"
              role="status"
              aria-live="polite"
            >
              <span className="publication-spinner" aria-hidden="true" />
              <p>
                Estamos preparando tu invitación. El enlace aparecerá aquí
                cuando esté disponible en internet.
              </p>
            </div>
          )}
          {ready && <p className="publication-address">{deployment.host}</p>}
          {deployment?.error && (
            <p role="alert">
              No pudimos publicar tu invitación. Tus cambios están guardados;
              puedes volver a intentarlo.
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
              {paymentsEnabled ? "Pagar" : "Pagos en preparación"} ·{" "}
              {selected.kind === "wedding" ? "USD 25" : "USD 5"}
            </ActionButton>
          ) : ready ? (
            <a
              className="office-button"
              href={`https://${host(selected.kind, selected.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver invitación ↗
            </a>
          ) : (
            <ActionButton
              className="office-button"
              disabled={busy || preparing}
              onClick={publish}
            >
              {deployment?.phase === "error"
                ? "Reintentar publicación"
                : preparing
                  ? "Preparando invitación…"
                  : "Publicar invitación ↗"}
            </ActionButton>
          )}
        </div>
      </div>
    </>
  );
}
