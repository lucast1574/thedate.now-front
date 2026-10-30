import type { Attendee, SeatingPlan, SeatingTable } from "@/lib/events/seating";
import TableProperties from "./table-properties";
import TableHouseholds from "./table-households";
import RemoveSeatingItem from "./remove-seating-item";

export default function TableInspector({
  table,
  plan,
  people,
  limit,
  onChange,
  onDelete,
}: {
  table: SeatingTable;
  plan: SeatingPlan;
  people: Attendee[];
  limit: number;
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
      <TableHouseholds
        table={table}
        plan={plan}
        people={people}
        limit={limit}
        onChange={onChange}
      />
      <RemoveSeatingItem
        name={table.name}
        description="Las personas de esta mesa quedarán sin asignar. El cambio se guardará cuando guardes el plano."
        onRemove={onDelete}
      />
    </aside>
  );
}
