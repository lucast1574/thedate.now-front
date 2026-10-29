import { useState, type ReactNode } from "react";
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
import VenueAreaTools from "./venue-area-tools";
import VenueAreaInspector from "./venue-area-inspector";
type Props = {
  event: Event;
  guests: Guest[];
  plan: SeatingPlan;
  busy: boolean;
  dirty: boolean;
  stale: boolean;
  exportAction: ReactNode;
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
  exportAction,
  onChange,
  onSave,
  onReload,
}: Props) {
  const [selected, setSelected] = useState(""),
    [capacity, setCapacity] = useState(10),
    [shape, setShape] = useState<SeatingTable["shape"]>("round");
  const [proposal, setProposal] = useState<ReturnType<
    typeof proposeSeating
  > | null>(null);
  const people = attendees(guests.filter((g) => g.response === "going"))
    .filter((person) => person.registered)
    .sort(surnameOrder);
  const table = plan.tables.find((t) => t.id === selected);
  const area = plan.areas?.find((item) => item.id === selected);
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
          {exportAction}
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
        busy={busy}
        onCapacity={setCapacity}
        onShape={setShape}
        onAdd={add}
        onPropose={() =>
          setProposal(proposeSeating(guests, plan, event, capacity))
        }
      />
      <VenueAreaTools plan={plan} onChange={onChange} onSelect={setSelected} />
      <p className="guest-hint">
        Arrastra las mesas en el lienzo. También puedes moverlas con las flechas
        del teclado o editar su posición. Elige una mesa para asignar personas.
        Solo aparecen confirmados. Cada titular se mueve junto a su acompañante.{" "}
        {dirty
          ? "Hay cambios sin guardar."
          : `Plano guardado · v${plan.version}`}
      </p>
      <div
        className={`seating-workspace ${table || area ? "with-inspector" : ""}`}
      >
        <SeatingCanvas
          plan={plan}
          people={people}
          selected={selected}
          onSelect={setSelected}
          onMove={move}
          areas={plan.areas}
          onMoveArea={(id, x, y) =>
            onChange({
              ...plan,
              areas: plan.areas?.map((item) =>
                item.id === id ? { ...item, x, y } : item,
              ),
            })
          }
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
        ) : area ? (
          <VenueAreaInspector
            area={area}
            plan={plan}
            onChange={onChange}
            onDelete={() => setSelected("")}
          />
        ) : (
          <aside className="seating-instructions">
            <h3>Un lugar para cada persona</h3>
            <p>
              Al confirmar, cada invitado recibe una mesa con su categoría.
              Puedes moverlo junto a su acompañante o crear otras mesas.
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
