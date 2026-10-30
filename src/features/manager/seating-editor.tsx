import { useState, type ReactNode } from "react";
import type { Event, Guest } from "@/lib/events/types";
import type { SeatingPlan, SeatingTable } from "@/lib/events/seating";
import { attendees } from "@/lib/events/attendees";
import {
  newTable,
  proposeSeating,
  surnameOrder,
} from "@/lib/events/auto-seating";
import Icon from "@/components/icon";
import SeatingSaveBar from "./seating-save-bar";
import SeatingEmptyInspector from "./seating-empty-inspector";
import SeatingOverview from "./seating-overview";
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
      <SeatingOverview
        tables={plan.tables.length}
        count={count}
        pending={people.length - count}
      />
      <div className="seating-setup">
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
        <VenueAreaTools
          plan={plan}
          onChange={onChange}
          onSelect={setSelected}
        />
      </div>
      <div className="seating-canvas-heading">
        <div>
          <h3>Plano del salón</h3>
          <p>
            Selecciona una mesa para asignar personas. Arrastra para colocar
            mesas y espacios.
          </p>
        </div>
        <span>Solo invitados confirmados</span>
      </div>
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
            key={area.id}
            area={area}
            plan={plan}
            onChange={onChange}
            onDelete={() => setSelected("")}
          />
        ) : (
          <SeatingEmptyInspector />
        )}
      </div>
      <SeatingSaveBar
        busy={busy}
        dirty={dirty}
        stale={stale}
        version={plan.version}
        onSave={onSave}
        onReload={onReload}
      />
      <section className="seating-export-panel">
        <div>
          <Icon name="lucide:file-spreadsheet" />
          <div>
            <h3>Lista para la entrada</h3>
            <p>
              Cuando la distribución esté lista, descarga el Excel con las
              personas confirmadas, sus familias y sus mesas.
            </p>
          </div>
        </div>
        {exportAction}
      </section>
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
