import Listbox from "@/components/listbox";
import type { SeatingTable } from "@/lib/events/seating";

export default function TableProperties({
  table,
  assigned,
  onPatch,
}: {
  table: SeatingTable;
  assigned: number;
  onPatch: (fields: Partial<SeatingTable>) => void;
}) {
  return (
    <div className="table-properties">
      <label>
        Nombre de la mesa
        <input
          maxLength={60}
          value={table.name}
          onChange={(e) => onPatch({ name: e.target.value })}
        />
      </label>
      <div className="table-properties-row">
        <label>
          Asientos
          <input
            type="number"
            min={Math.max(1, assigned)}
            max={50}
            value={table.capacity}
            onChange={(e) => {
              const capacity = Number(e.target.value);
              if (
                Number.isInteger(capacity) &&
                capacity >= Math.max(1, assigned) &&
                capacity <= 50
              )
                onPatch({ capacity });
            }}
          />
        </label>
        <label>
          Forma
          <Listbox
            value={table.shape}
            onValueChange={(value) =>
              onPatch({ shape: value as SeatingTable["shape"] })
            }
          >
            <option value="round">Circular</option>
            <option value="rectangle">Rectangular</option>
          </Listbox>
        </label>
      </div>
    </div>
  );
}
