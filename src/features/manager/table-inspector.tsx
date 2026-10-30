import type { Attendee, SeatingPlan, SeatingTable } from "@/lib/events/seating";
import TableProperties from "./table-properties";
import RemoveSeatingItem from "./remove-seating-item";

export default function TableInspector({
  table,
  plan,
  people,
  onChange,
  onDelete,
}: {
  table: SeatingTable;
  plan: SeatingPlan;
  people: Attendee[];
  onChange: (plan: SeatingPlan) => void;
  onDelete: () => void;
}) {
  const assigned = people.filter(
    (p) => plan.assignments[p.id] === table.id,
  ).length;
  return (
    <aside
      className="table-inspector table-organizer"
      aria-label={`Organizar ${table.name}`}
    >
      <section className="table-config">
        <header className="table-organizer-heading">
          <small>Mesa seleccionada</small>
          <h3>{table.name}</h3>
          <p>
            {assigned} personas sentadas ·{" "}
            {Math.max(0, table.capacity - assigned)} asientos libres
          </p>
        </header>
        <div
          className="table-occupancy"
          role="progressbar"
          aria-label={`Ocupación de ${table.name}`}
          aria-valuemin={0}
          aria-valuemax={table.capacity}
          aria-valuenow={assigned}
        >
          <span
            style={{
              width: `${Math.min(100, (assigned / table.capacity) * 100)}%`,
            }}
          />
        </div>
        <section className="table-edit-settings">
          <TableProperties
            table={table}
            assigned={assigned}
            onPatch={(fields) =>
              onChange({
                ...plan,
                tables: plan.tables.map((t) =>
                  t.id === table.id ? { ...t, ...fields } : t,
                ),
              })
            }
          />
        </section>
        <RemoveSeatingItem
          name={table.name}
          description="Las personas de esta mesa quedarán sin asignar. El cambio se guardará automáticamente."
          onRemove={onDelete}
        />
      </section>
    </aside>
  );
}
