import PublicationPanel from "@/features/studio/publication-panel";
import { useEventActions } from "@/features/studio/use-event-actions";
import GuestWorkspace from "./guest-workspace";
import SeatingEditor from "./seating-editor";
import DoorExportButton from "./door-export-button";
import WishlistPanel from "@/features/gifts/wishlist-panel";
import type { useManager } from "./use-manager";
export default function ManagerTools({
  manager,
  tab,
}: {
  manager: ReturnType<typeof useManager>;
  tab: string;
}) {
  const { event, guests, plan, user, busy, dirty, stale } = manager;
  const actions = useEventActions(
    event,
    {
      refreshGuests: async () => {
        await manager.refresh();
      },
      reloadSelected: async () => {
        await manager.refresh();
      },
    },
    user?.role === "admin" || user?.id === event?.ownerId,
  );
  if (!event) return null;
  const canSend = user?.role === "admin" || user?.id === event.ownerId;
  return (
    <>
      {tab === "guests" && (
        <>
          <GuestWorkspace manager={manager} />
          <section
            className="manager-delivery"
            aria-label="Publicación y envío de invitaciones"
          >
            {canSend && (
              <PublicationPanel
                selected={event}
                deployment={actions.deployment}
                publishing={actions.publishing}
                busy={busy}
                paymentsEnabled={false}
                checkout={() => {}}
                publish={() => {
                  void manager.run(actions.publish, "Publicación solicitada.");
                }}
              />
            )}
            {canSend && (
              <div className="manager-send">
                <button
                  className="office-button"
                  disabled={
                    busy || !event.publishedAt || !guests.some((g) => !g.sentAt)
                  }
                  onClick={() => {
                    void manager.send();
                  }}
                >
                  Enviar invitaciones
                </button>
                <p>
                  {event.publishedAt
                    ? "El enlace personal permite registrar acompañantes y confirmar asistencia."
                    : "Publica tu invitación aquí para habilitar el envío por WhatsApp."}
                </p>
              </div>
            )}
          </section>
        </>
      )}
      {tab === "tables" && (
        <SeatingEditor
          event={event}
          guests={guests}
          plan={plan}
          dirty={dirty}
          stale={stale}
          busy={busy}
          exportAction={
            <DoorExportButton
              event={event}
              guests={guests}
              plan={plan}
              blocked={busy || dirty || stale}
              dirty={dirty}
              stale={stale}
              onExport={(task) => {
                void manager.run(task, "Excel generado.");
              }}
            />
          }
          onChange={manager.update}
          onSave={() => {
            void manager.save();
          }}
          onReload={() => {
            void manager.run(() => manager.refresh(true), "Plano recargado.");
          }}
        />
      )}
      {tab === "gifts" && <WishlistPanel key={event.id} event={event} />}
    </>
  );
}
