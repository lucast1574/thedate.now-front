import { exportDoorWorkbook, doorRows } from "@/lib/events/door-export";
import type { Event, Guest } from "@/lib/events/types";
import type { SeatingPlan } from "@/lib/events/seating";
export default function DoorPanel({
  event,
  guests,
  plan,
  blocked,
  dirty,
  onExport,
}: {
  event: Event;
  guests: Guest[];
  plan: SeatingPlan;
  blocked: boolean;
  dirty: boolean;
  onExport: (task: () => Promise<void>) => void;
}) {
  return (
    <section className="door-panel">
      <h2>Lista para el personal de entrada</h2>
      <p>
        Excel con una fila por persona confirmada: apellido, nombre, titular de
        la invitación, familia y mesa. Incluye una segunda hoja de respuestas
        pendientes o rechazadas para revisión. Los acompañantes sin nombre se
        señalan para completar. La hoja de entrada permite marcar quién ingresó.
      </p>
      <p>
        No incluye teléfonos ni enlaces personales. Guarda el plano y actualiza
        las respuestas antes de entregarlo.
      </p>
      <button
        className="office-button"
        disabled={blocked}
        onClick={() => onExport(() => exportDoorWorkbook(event, guests, plan))}
      >
        Descargar Excel para entrada ↓
      </button>
      {dirty && (
        <p role="status">
          Guarda los cambios del plano para habilitar la exportación.
        </p>
      )}
      <p>
        {doorRows(guests, plan, true).length} personas confirmadas ·{" "}
        {guests.filter((g) => g.response === "going").length} invitaciones ·
        Plano v{plan.version}
      </p>
    </section>
  );
}
