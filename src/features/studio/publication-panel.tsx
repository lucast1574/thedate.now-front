import type { Deployment } from "./use-deployment";
import ActionButton from "@/components/action-button";
import Link from "next/link";
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
    <section id="publicacion" className="publication-panel">
      <div className="office-divider" />
      <div className="action-row">
        <div>
          <p className="office-kicker">PUBLICACIÓN</p>
          <h2>Comparte tu invitación</h2>
          <p>
            Publica tu diseño para que tus invitados puedan abrir su enlace
            personal.
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
          {selected.publishedAt &&
            (selected.designVersion || 0) !==
              (selected.publishedDesignVersion || 0) && (
              <p role="status">
                Tienes un borrador sin publicar. Tus invitados siguen viendo la
                versión anterior.{" "}
                <Link href={`/editor/${encodeURIComponent(selected.id)}`}>
                  Revisar borrador
                </Link>
              </p>
            )}
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
              {selected.kind === "wedding" ? "USD 20" : "USD 10"}
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
    </section>
  );
}
