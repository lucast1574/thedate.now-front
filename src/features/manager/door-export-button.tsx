import Icon from "@/components/icon";
import { exportDoorWorkbook } from "@/lib/events/door-export";
import type { Event, Guest } from "@/lib/events/types";
import type { SeatingPlan } from "@/lib/events/seating";

export default function DoorExportButton({
  event,
  guests,
  plan,
  blocked,
  dirty,
  stale,
  onExport,
}: {
  event: Event;
  guests: Guest[];
  plan: SeatingPlan;
  blocked: boolean;
  dirty: boolean;
  stale: boolean;
  onExport: (task: () => Promise<void>) => void;
}) {
  const description = stale
    ? "Recarga el plano para incluir los cambios nuevos antes de exportar."
    : dirty
      ? "Guarda el plano antes de descargar el Excel."
      : "Personas confirmadas con su familia y mesa; incluye una hoja de respuestas para revisión.";
  return (
    <div className="seating-export-action">
      <button
        type="button"
        disabled={blocked}
        title={description}
        aria-describedby={dirty || stale ? "seating-export-hint" : undefined}
        onClick={() => onExport(() => exportDoorWorkbook(event, guests, plan))}
      >
        <Icon name="lucide:download" />
        Excel para entrada
      </button>
      {(dirty || stale) && (
        <small id="seating-export-hint">{description}</small>
      )}
    </div>
  );
}
