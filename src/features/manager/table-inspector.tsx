import { useState } from "react";
import PersonGlyph from "@/components/person-glyph";
import type { Attendee, SeatingPlan, SeatingTable } from "@/lib/events/seating";
import { fullName } from "@/lib/events/attendees";
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
  const [search, setSearch] = useState("");
  const assigned = people.filter((p) => plan.assignments[p.id] === table.id);
  const used = Object.keys(plan.assignments).length;
  const candidates = people.filter(
    (p) =>
      plan.assignments[p.id] === table.id ||
      `${fullName(p)} ${p.family}`
        .toLocaleLowerCase("es")
        .includes(search.toLocaleLowerCase("es")),
  );
  function patch(fields: Partial<SeatingTable>) {
    onChange({
      ...plan,
      tables: plan.tables.map((t) =>
        t.id === table.id ? { ...t, ...fields } : t,
      ),
    });
  }
  function assign(person: Attendee, checked: boolean) {
    const assignments = { ...plan.assignments };
    if (checked) assignments[person.id] = table.id;
    else delete assignments[person.id];
    onChange({ ...plan, assignments });
  }
  return (
    <aside className="table-inspector">
      <h3>
        {table.name} · {assigned.length}/{table.capacity}
      </h3>
      <div className="manager-fields">
        <label>
          Nombre de mesa
          <input
            maxLength={60}
            value={table.name}
            onChange={(e) => patch({ name: e.target.value })}
          />
        </label>
        <label>
          Forma
          <select
            value={table.shape}
            onChange={(e) =>
              patch({ shape: e.target.value as SeatingTable["shape"] })
            }
          >
            <option value="round">Circular</option>
            <option value="rectangle">Rectangular</option>
          </select>
        </label>
        <label>
          Capacidad
          <input
            type="number"
            min={Math.max(1, assigned.length)}
            max={50}
            value={table.capacity}
            onChange={(e) => {
              const capacity = Number(e.target.value);
              if (
                Number.isInteger(capacity) &&
                capacity >= Math.max(1, assigned.length) &&
                capacity <= 50
              )
                patch({ capacity });
            }}
          />
        </label>
        <label>
          Rotación: {table.rotation}°
          <input
            type="range"
            min={-180}
            max={180}
            step={5}
            value={table.rotation}
            onChange={(e) => patch({ rotation: Number(e.target.value) })}
          />
        </label>
        <label>
          Posición X
          <input
            type="number"
            min={0}
            max={1360}
            value={table.x}
            onChange={(e) => {
              const x = Number(e.target.value);
              if (x >= 0 && x <= 1360) patch({ x });
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
              if (y >= 0 && y <= 800) patch({ y });
            }}
          />
        </label>
      </div>
      <label>
        Buscar personas
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Apellido, nombre o familia"
        />
      </label>
      <p>
        Marca personas para sentarlas aquí. Desmarca para liberar el asiento.
        Las respuestas pendientes se muestran como provisionales.
      </p>
      <div className="seat-candidates">
        {candidates.map((person) => {
          const current = plan.assignments[person.id],
            checked = current === table.id;
          const elsewhere =
            current && !checked
              ? plan.tables.find((t) => t.id === current)?.name
              : "";
          const disabled =
            !checked &&
            (assigned.length >= table.capacity || (!current && used >= limit));
          return (
            <label key={person.id} className={checked ? "assigned" : ""}>
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={(e) => assign(person, e.target.checked)}
              />
              <PersonGlyph gender={person.gender} />
              <span>
                {fullName(person)}
                <small>
                  {person.family || (person.slot ? "Acompañante" : "Titular")} ·{" "}
                  {person.response === "going" ? "Confirmado" : "Provisional"}
                  {elsewhere ? ` · ${elsewhere} (se moverá aquí)` : ""}
                </small>
              </span>
            </label>
          );
        })}
      </div>
      <button type="button" className="table-delete" onClick={onDelete}>
        Eliminar mesa y liberar asientos
      </button>
    </aside>
  );
}
