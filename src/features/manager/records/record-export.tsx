import { useTranslator } from "@/lib/i18n/react";
import { useState } from "react";
import Icon from "@/components/icon";
import { exportDoorWorkbook } from "@/lib/events/door-export";
import type { Event, Guest } from "@/lib/events/types";
import type { SeatingPlan } from "@/lib/events/seating";

export default function RecordExport({
  event,
  guests,
  plan,
}: {
  event: Event;
  guests: Guest[];
  plan: SeatingPlan;
}) {
  const i18n = useTranslator();

  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return (
    <div className="record-export">
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            await exportDoorWorkbook(event, guests, plan, i18n);
          } catch (error) {
            setError((error as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <Icon name="down" />
        {busy ? i18n("Preparando…") : i18n("Descargar Excel")}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
