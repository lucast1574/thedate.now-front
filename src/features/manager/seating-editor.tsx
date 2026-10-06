import { useState } from "react";
import type { Event, Guest } from "@/lib/events/types";
import type { SeatingPlan, SeatingTable } from "@/lib/events/seating";
import { attendees } from "@/lib/events/attendees";
import {
  newTable,
  proposeSeating,
  surnameOrder,
} from "@/lib/events/auto-seating";
import SeatingTools from "./seating-tools";
import SeatingCanvas from "./seating-canvas";
import TableInspector from "./table-inspector";
import AutoProposal from "./auto-proposal";
type Props = {
  event: Event;
  guests: Guest[];
  plan: SeatingPlan;
  busy: boolean;
  dirty: boolean;
  stale: boolean;
  onChange: (plan: SeatingPlan) => void;
  onSave: () => void;
  onReload: () => void;
};
export default function SeatingEditor({
  event,
  guests,
  plan,
  busy,
  dirty,
  stale,
  onChange,
  onSave,
  onReload,
}: Props) {
  const [selected, setSelected] = useState(""),
    [capacity, setCapacity] = useState(8),
    [shape, setShape] = useState<SeatingTable["shape"]>("round"),
    [includePending, setIncludePending] = useState(false);
  const [proposal, setProposal] = useState<ReturnType<
    typeof proposeSeating
  > | null>(null);
  const people = attendees(
    guests.filter((g) => g.response !== "not_going"),
  ).sort(surnameOrder);
  const table = plan.tables.find((t) => t.id === selected);
  const count = people.filter((p) => plan.assignments[p.id]).length;
  function add() {
    const next = newTable(
      plan.tables.length,
      capacity,
      shape,
      crypto.randomUUID(),
    );
    let n = plan.tables.length + 1;
    while (plan.tables.some((t) => t.name === `Mesa ${n}`)) n++;
    next.name = `Mesa ${n}`;
    onChange({ ...plan, tables: [...plan.tables, next] });
    setSelected(next.id);
  }
  function move(id: string, x: number, y: number) {
    onChange({
      ...plan,
      tables: plan.tables.map((t) => (t.id === id ? { ...t, x, y } : t)),
    });
  }
  return (
    <fieldset disabled={busy} className="seating-editor">
      <div className="seating-top">
        <div>
          <h2>Diseña el salón</h2>
          <p>
            {plan.tables.length} mesas · {count} personas asignadas ·{" "}
            {people.length - count} sin mesa
          </p>
        </div>
        <div className="action-row">
          <button
            disabled={busy || !dirty || stale}
            className="office-button"
            onClick={onSave}
          >
            {busy ? "Guardando…" : "Guardar plano"}
          </button>
          <button disabled={busy} onClick={onReload}>
            {dirty ? "Descartar borrador y recargar" : "Recargar plano"}
          </button>
        </div>
      </div>
      <SeatingTools
        capacity={capacity}
        shape={shape}
        includePending={includePending}
        busy={busy}
        full={plan.tables.length >= 100}
        onCapacity={setCapacity}
        onShape={setShape}
        onPending={setIncludePending}
        onAdd={add}
        onPropose={() =>
          setProposal(
            proposeSeating(guests, plan, event, capacity, includePending),
          )
        }
      />
      <p className="guest-hint">
        Arrastra las mesas en el lienzo. También puedes moverlas con las flechas
        del teclado o editar su posición. Elige una mesa para asignar personas.
        Iconos según el dato registrado; los nombres y parentescos no se
        adivinan.{" "}
        {dirty
          ? "Hay cambios sin guardar."
          : `Plano guardado · v${plan.version}`}
      </p>
      <div className={`seating-workspace ${table ? "with-inspector" : ""}`}>
        <SeatingCanvas
          plan={plan}
          people={people}
          selected={selected}
          onSelect={setSelected}
          onMove={move}
        />
        {table ? (
          <TableInspector
            key={table.id}
            table={table}
            plan={plan}
            people={people}
            limit={
              event.capacityUnlimited ? 5000 : Math.min(5000, event.capacity)
            }
            onChange={onChange}
            onDelete={() => {
              onChange({
                ...plan,
                tables: plan.tables.filter((t) => t.id !== table.id),
                assignments: Object.fromEntries(
                  Object.entries(plan.assignments).filter(
                    ([, id]) => id !== table.id,
                  ),
                ),
              });
              setSelected("");
            }}
          />
        ) : (
          <aside className="seating-instructions">
            <h3>Un lugar para cada persona</h3>
            <p>
              Selecciona una mesa para ver sus asientos y asignar titulares o
              acompañantes. Cada persona puede estar en una sola mesa.
            </p>
            <p>
              El plano es orientativo. Revisa pasillos y distancias con tu
              local.
            </p>
          </aside>
        )}
      </div>
      {proposal && (
        <AutoProposal
          proposal={proposal}
          onClose={() => setProposal(null)}
          onApply={() => {
            onChange(proposal.plan);
            setProposal(null);
            setSelected("");
          }}
        />
      )}
    </fieldset>
  );
}
