import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

  const description = stale
    ? i18n(
        "Recarga el plano para incluir los cambios nuevos antes de exportar.",
      )
    : dirty
      ? i18n(
          "Estamos guardando el plano. La descarga se habilitará al terminar.",
        )
      : i18n(
          "Una hoja lista para imprimir con todos los invitados agrupados por mesa.",
        );
  return (
    <div className="seating-export-action">
      <button
        type="button"
        disabled={blocked}
        title={description}
        aria-describedby={dirty || stale ? "seating-export-hint" : undefined}
        onClick={() =>
          onExport(() => exportDoorWorkbook(event, guests, plan, i18n))
        }
      >
        <Icon name="lucide:download" />
        {i18n("Excel para entrada")}
      </button>
      {(dirty || stale) && (
        <small id="seating-export-hint">{description}</small>
      )}
    </div>
  );
}
