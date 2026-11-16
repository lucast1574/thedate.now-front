"use client";
import { useTranslator } from "@/lib/i18n/react";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import WorkspaceSidebar from "@/features/studio/workspace-sidebar";
import OrganizationPreview from "./organization-preview";
import WishlistPanel from "@/features/gifts/wishlist-panel";
import InvitationRecord from "@/features/designer/invitation-record";
import ManagerTools from "./manager-tools";
import Alert from "@/components/alert";
import { useManager } from "./use-manager";
import GuestSummary from "./guest-summary";
export default function ManagerPage({ id }: { id: string }) {
  return <ManagerWorkspace key={id} id={id} />;
}
function ManagerWorkspace({ id }: { id: string }) {
  const i18n = useTranslator();

  const manager = useManager(id);
  const params = useSearchParams();
  const requested = params.get("tab"),
    tab =
      requested === "tables" || requested === "door"
        ? "tables"
        : requested === "gifts"
          ? "gifts"
          : requested === "messages" || requested === "payments"
            ? requested
            : "guests";
  const section = {
    guests: {
      title: i18n("Invitados y respuestas"),
      description: i18n(
        "Gestiona tu lista y sigue cada confirmación de asistencia.",
      ),
    },
    tables: {
      title: i18n("Mesas y distribución"),
      description: i18n(
        "Organiza el salón, asigna los asientos y descarga tu lista de entrada.",
      ),
    },
    gifts: {
      title: i18n("Lista de regalos"),
      description: i18n(
        "Prepara los regalos de tu celebración y consulta las elecciones de tus invitados.",
      ),
    },
    messages: {
      title: i18n("Mensajes"),
      description: i18n(
        "Lee y responde lo que envían tus invitados por WhatsApp.",
      ),
    },
    payments: {
      title: i18n("Pagos de tus invitados"),
      description: i18n(
        "Registra los abonos y consulta cuánto falta por recibir.",
      ),
    },
  }[tab];
  const { event, guests, user, error, dirty, stale } = manager;
  if (!event)
    return (
      <main className="editor-loading">
        <h1>{i18n("Gestor de invitados")}</h1>
        <p role={error ? "alert" : "status"}>
          {error || i18n("Abriendo tu evento…")}
        </p>
        <Link href="/">{i18n("Volver al estudio e iniciar sesión")}</Link>
      </main>
    );
  if (!event.isDemo && event.paymentStatus !== "paid")
    return (
      <main className="editor-loading">
        <h1>{i18n("Tu evento está pendiente de pago")}</h1>
        <Link href={`/?event=${encodeURIComponent(id)}`}>
          {i18n("Continuar con mi invitación")}
        </Link>
      </main>
    );
  if (manager.readOnly && user && tab !== "messages" && tab !== "payments")
    return (
      <InvitationRecord
        key={`${event.id}-${tab}`}
        event={event}
        user={user}
        initialTab={tab}
      />
    );
  const allowed = event.paymentStatus === "paid" && !event.isDemo;
  const guard = () =>
    !dirty ||
    window.confirm(
      i18n("Hay cambios del plano sin guardar. ¿Salir y descartarlos?"),
    );
  return (
    <div
      className={`office workspace ${event.kind === "wedding" ? "office-wedding" : "office-general"}`}
    >
      {user && (
        <WorkspaceSidebar
          wedding={event.kind === "wedding"}
          user={user}
          active={tab}
          eventId={id}
          guard={guard}
        />
      )}
      <main
        className={`manager-page ${event.kind === "wedding" ? "manager-wedding" : "manager-general"}`}
      >
        <header className="manager-header">
          <div>
            <h1>{section.title}</h1>
            <p>{section.description}</p>
          </div>
        </header>
        {!event.isDemo && user && (
          <div className="manager-event-navigation">
            <p className="manager-event-context">{event.title}</p>
          </div>
        )}
        <Alert>{error}</Alert>
        <Alert variant="success">{manager.notice}</Alert>
        {!allowed ? (
          <>
            {tab === "messages" || tab === "payments" ? (
              <p>{i18n("Activa tu evento para usar estas herramientas.")}</p>
            ) : tab === "gifts" ? (
              <WishlistPanel key={event.id} event={event} />
            ) : (
              <OrganizationPreview
                wedding={event.kind === "wedding"}
                tool={tab}
                eventId={event.isDemo ? undefined : event.id}
              />
            )}
          </>
        ) : (
          <>
            {tab === "guests" && <GuestSummary event={event} guests={guests} />}
            {tab === "tables" && stale && (
              <p className="manager-warning" role="alert">
                {i18n(
                  "Hay respuestas o cambios nuevos. Conservamos tu borrador; recarga el plano antes de guardarlo o exportar.",
                )}
              </p>
            )}
            <ManagerTools manager={manager} tab={tab} />
          </>
        )}
      </main>
    </div>
  );
}
