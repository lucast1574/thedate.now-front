import PublicationPanel from "@/features/studio/publication-panel";
import { useEventActions } from "@/features/studio/use-event-actions";
import GuestForm from "@/features/studio/guest-form";
import GuestImport from "@/features/studio/guest-import";
import GuestRoster from "./guest-roster";
import SeatingEditor from "./seating-editor";
import DoorPanel from "./door-panel";
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
  const id = event.id,
    canSend = user?.role === "admin" || user?.id === event.ownerId;
  return (
    <>
      {tab === "guests" && (
        <>
          <div className="manager-additions">
            <GuestForm busy={busy} onAdd={manager.add} />
            <GuestImport eventId={id} onImported={() => manager.refresh()} />
          </div>
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
          <GuestRoster guests={guests} plan={plan} />
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
          onChange={manager.update}
          onSave={() => {
            void manager.save();
          }}
          onReload={() => {
            void manager.run(() => manager.refresh(true), "Plano recargado.");
          }}
        />
      )}
      {tab === "door" && (
        <DoorPanel
          event={event}
          guests={guests}
          plan={plan}
          blocked={busy || dirty || stale}
          dirty={dirty}
          onExport={(task) => {
            void manager.run(task, "Excel generado.");
          }}
        />
      )}
      {tab === "gifts" && <WishlistPanel key={event.id} event={event} />}
    </>
  );
}
