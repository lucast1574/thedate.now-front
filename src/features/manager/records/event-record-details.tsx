import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

  return (
    <section
      className="event-record-details"
      aria-label={
        tab === "tables"
          ? i18n("Mesas")
          : tab === "gifts"
            ? i18n("Regalos")
            : i18n("Invitados")
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
  const i18n = useTranslator();

  const load = useCallback(async () => {
    const [guests, plan] = await Promise.all([
      api<Guest[]>(
        `/api/backend/events/${event.id}/guests`,
        undefined,
        undefined,
        i18n,
      ),
      api<SeatingPlan>(
        `/api/backend/events/${event.id}/seating`,
        undefined,
        undefined,
        i18n,
      ),
    ]);
    return { guests, plan };
  }, [event.id, i18n]);
  const { data, error, retry } = useRecordSnapshot(load);
  if (error)
    return (
      <div role="alert">
        <p>{error}</p>
        <button onClick={retry}>{i18n("Volver a intentar")}</button>
      </div>
    );
  if (!data) return <p role="status">{i18n("Cargando información…")}</p>;
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
