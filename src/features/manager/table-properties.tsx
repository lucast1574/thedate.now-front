import { useTranslator } from "@/lib/i18n/react";
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
  const i18n = useTranslator();

  return (
    <div className="table-properties">
      <label>
        {i18n("Nombre de la mesa")}{" "}
        <input
          maxLength={60}
          value={table.name}
          onChange={(e) => onPatch({ name: e.target.value })}
        />
      </label>
      <div className="table-properties-row">
        <label>
          {i18n("Asientos")}{" "}
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
          {i18n("Forma")}{" "}
          <Listbox
            value={table.shape}
            onValueChange={(value) =>
              onPatch({ shape: value as SeatingTable["shape"] })
            }
          >
            <option value="round">{i18n("Circular")}</option>
            <option value="rectangle">{i18n("Rectangular")}</option>
          </Listbox>
        </label>
      </div>
    </div>
  );
}
