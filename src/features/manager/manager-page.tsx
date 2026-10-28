"use client";
import ProductHeading from "@/components/product-heading";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import WorkspaceSidebar from "@/features/studio/workspace-sidebar";
import OrganizationPreview from "./organization-preview";
import WishlistPanel from "@/features/gifts/wishlist-panel";
import ManagerTools from "./manager-tools";
import Alert from "@/components/alert";
import { useManager } from "./use-manager";
import ManagerEventPicker from "./manager-event-picker";
import GuestSummary from "./guest-summary";
export default function ManagerPage({ id }: { id: string }) {
  return <ManagerWorkspace key={id} id={id} />;
}
function ManagerWorkspace({ id }: { id: string }) {
  const manager = useManager(id);
  const params = useSearchParams();
  const requested = params.get("tab"),
    tab =
      requested === "tables" || requested === "door"
        ? "tables"
        : requested === "gifts"
          ? "gifts"
          : "guests";
  const section = {
    guests: {
      title: "Invitados y respuestas",
      description: "Gestiona tu lista y sigue cada confirmación de asistencia.",
    },
    tables: {
      title: "Mesas y distribución",
      description:
        "Organiza el salón, asigna los asientos y descarga tu lista de entrada.",
    },
    gifts: {
      title: "Lista de regalos",
      description:
        "Prepara los regalos de tu celebración y consulta las elecciones de tus invitados.",
    },
  }[tab];
  const { event, events, guests, user, error, dirty, stale } = manager;
  if (!event)
    return (
      <main className="editor-loading">
        <h1>Gestor de invitados</h1>
        <p role={error ? "alert" : "status"}>
          {error || "Abriendo tu evento…"}
        </p>
        <Link href="/">Volver al estudio e iniciar sesión</Link>
      </main>
    );
  if (!event.isDemo && event.paymentStatus !== "paid")
    return (
      <main className="editor-loading">
        <h1>Tu evento está pendiente de pago</h1>
        <Link href={`/?event=${encodeURIComponent(id)}`}>
          Continuar con mi invitación
        </Link>
      </main>
    );
  const allowed = event.paymentStatus === "paid" && !event.isDemo;
  const guard = () =>
    !dirty ||
    window.confirm("Hay cambios del plano sin guardar. ¿Salir y descartarlos?");
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
            <ProductHeading kind={event.kind} area="manager" />
            <h1>{section.title}</h1>
            <p>{section.description}</p>
          </div>
          <div className="action-row">
            <Link
              href="/"
              onClick={(e) => {
                if (
                  dirty &&
                  !window.confirm(
                    "Hay cambios del plano sin guardar. ¿Salir y descartarlos?",
                  )
                )
                  e.preventDefault();
              }}
            >
              Estudio
            </Link>
            <Link
              href={`/?event=${id}`}
              onClick={(e) => {
                if (!guard()) e.preventDefault();
              }}
            >
              Datos del evento
            </Link>
            <Link
              href={`/editor/${id}`}
              onClick={(e) => {
                if (
                  dirty &&
                  !window.confirm(
                    "Hay cambios del plano sin guardar. ¿Salir y descartarlos?",
                  )
                )
                  e.preventDefault();
              }}
            >
              Editar invitación ↗
            </Link>
          </div>
        </header>
        {!event.isDemo && (
          <ManagerEventPicker
            events={events}
            event={event}
            tab={tab}
            guard={guard}
          />
        )}
        <Alert>{error}</Alert>
        <Alert variant="success">{manager.notice}</Alert>
        {!allowed ? (
          <>
            {tab === "gifts" ? (
              <WishlistPanel key={event.id} event={event} />
            ) : (
              <OrganizationPreview
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
                Hay respuestas o cambios nuevos. Conservamos tu borrador;
                recarga el plano antes de guardarlo o exportar.
              </p>
            )}
            <ManagerTools manager={manager} tab={tab} />
          </>
        )}
      </main>
    </div>
  );
}
