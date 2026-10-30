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
      <section className="table-position-details">
        <h4>Ubicación y giro</h4>
        <p>
          También puedes arrastrar la mesa en el plano o moverla con las
          flechas.
        </p>
        <label>
          Giro <output>{table.rotation}°</output>
          <input
            type="range"
            min={-180}
            max={180}
            step={5}
            value={table.rotation}
            onChange={(e) => onPatch({ rotation: Number(e.target.value) })}
          />
        </label>
        <div className="table-properties-row">
          <label>
            Posición X
            <input
              type="number"
              min={0}
              max={1360}
              value={table.x}
              onChange={(e) => {
                const x = Number(e.target.value);
                if (x >= 0 && x <= 1360) onPatch({ x });
              }}
            />
          </label>
          <label>
            Posición Y
            <input
              type="number"
              min={0}
              max={800}
              value={table.y}
              onChange={(e) => {
                const y = Number(e.target.value);
                if (y >= 0 && y <= 800) onPatch({ y });
              }}
            />
          </label>
        </div>
      </section>
    </div>
  );
}
