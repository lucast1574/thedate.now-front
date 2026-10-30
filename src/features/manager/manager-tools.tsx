import InvitationDelivery from "./invitation-delivery";
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
  if (!event) return null;
  const canSend = user?.role === "admin" || user?.id === event.ownerId;
  return (
    <>
      {tab === "guests" && (
        <>
          <GuestWorkspace manager={manager} />
          {canSend && (
            <InvitationDelivery
              eventId={event.id}
              guestCount={guests.length}
              onUpdate={manager.refresh}
            />
          )}
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
          autosave={manager.autosave}
          onReload={() => {
            void manager.run(() => manager.refresh(true), "Plano recargado.");
          }}
        />
      )}
      {tab === "gifts" && <WishlistPanel key={event.id} event={event} />}
    </>
  );
}
