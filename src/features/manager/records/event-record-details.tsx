import { useCallback } from "react";
import { api } from "@/lib/api/client";
import type { Event, Guest } from "@/lib/events/types";
import type { SeatingPlan } from "@/lib/events/seating";
import { useRecordSnapshot } from "./use-record-snapshot";
import RecordExport from "./record-export";
import RecordGuests from "./record-guests";
import RecordTables from "./record-tables";
import RecordGifts from "./record-gifts";

export type RecordTab = "invitation" | "guests" | "tables" | "gifts";
export function recordTab(value?: string | null): RecordTab {
  return value === "guests" || value === "tables" || value === "gifts"
    ? value
    : "invitation";
}
export default function EventRecordDetails({
  event,
  tab,
}: {
  event: Event;
  tab: RecordTab;
}) {
  return (
    <section
      className="event-record-details"
      aria-label={
        tab === "tables" ? "Mesas" : tab === "gifts" ? "Regalos" : "Invitados"
      }
    >
      {tab === "gifts" ? (
        <RecordGifts eventId={event.id} />
      ) : (
        <RecordPlanning event={event} tab={tab} />
      )}
    </section>
  );
}
function RecordPlanning({ event, tab }: { event: Event; tab: RecordTab }) {
  const load = useCallback(async () => {
    const [guests, plan] = await Promise.all([
      api<Guest[]>(`/api/backend/events/${event.id}/guests`),
      api<SeatingPlan>(`/api/backend/events/${event.id}/seating`),
    ]);
    return { guests, plan };
  }, [event.id]);
  const { data, error, retry } = useRecordSnapshot(load);
  if (error)
    return (
      <div role="alert">
        <p>{error}</p>
        <button onClick={retry}>Volver a intentar</button>
      </div>
    );
  if (!data) return <p role="status">Cargando información…</p>;
  return (
    <>
      <RecordExport event={event} {...data} />
      {tab === "tables" ? (
        <RecordTables {...data} />
      ) : (
        <RecordGuests {...data} />
      )}
    </>
  );
}
