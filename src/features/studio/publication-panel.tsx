import type { Deployment } from "./use-deployment";
import ActionButton from "@/components/action-button";
import type { Event } from "@/lib/events/types";
import { invitationHost as host } from "@/lib/events/domains";
export default function PublicationPanel({
  selected,
  deployment,
  busy,
  paymentsEnabled,
  checkout,
  publish,
}: {
  selected: Event;
  deployment: Deployment | null;
  busy: boolean;
  paymentsEnabled: boolean;
  checkout: () => void;
  publish: () => void;
}) {
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
          <p>{host(selected.kind, selected.slug)}</p>
          {deployment?.error && (
            <p role="alert">
              No se pudo desplegar. Vuelve a intentar la publicación.
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
          ) : selected.publishedAt ? (
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
              disabled={
                busy ||
                Boolean(
                  deployment && !["error", "ready"].includes(deployment.phase),
                )
              }
              onClick={publish}
            >
              {deployment?.phase === "error"
                ? "Reintentar publicación"
                : deployment && deployment.phase !== "ready"
                  ? "Preparando invitación…"
                  : "Publicar invitación ↗"}
            </ActionButton>
          )}
        </div>
      </div>
    </>
  );
}
