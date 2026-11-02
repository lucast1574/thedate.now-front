import type { useManager } from "./use-manager";
import GuestRoster from "./guest-roster";
import SeatingCanvas from "./seating-canvas";
import DoorExportButton from "./door-export-button";
import WishlistPanel from "@/features/gifts/wishlist-panel";
import { attendees } from "@/lib/events/attendees";

export default function ManagerRecords({
  manager,
  tab,
}: {
  manager: ReturnType<typeof useManager>;
  tab: string;
}) {
  const { event, guests, plan } = manager;
  if (!event) return null;
  if (tab === "gifts") return <WishlistPanel event={event} />;
  return (
    <>
      {tab === "tables" && (
        <>
          <SeatingCanvas
            plan={plan}
            people={attendees(guests.filter((g) => g.response === "going"))}
            selected=""
            onSelect={() => {}}
            onMove={() => {}}
            areas={plan.areas}
            onMoveArea={() => {}}
          />
          <DoorExportButton
            event={event}
            guests={guests}
            plan={plan}
            blocked={false}
            dirty={false}
            stale={false}
            onExport={(task) => {
              void manager.run(task, "Excel generado.");
            }}
          />
        </>
      )}
      <GuestRoster guests={guests} plan={plan} />
    </>
  );
}
