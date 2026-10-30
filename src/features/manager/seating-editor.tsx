import { useState, type ReactNode } from "react";
import type { Event, Guest } from "@/lib/events/types";
import type { SeatingPlan } from "@/lib/events/seating";
import { attendees } from "@/lib/events/attendees";
import { proposeSeating, surnameOrder } from "@/lib/events/auto-seating";
import Icon from "@/components/icon";
import type { useSeatingAutosave } from "./use-seating-autosave";
import SeatingSaveBar from "./seating-save-bar";
import SeatingEmptyInspector from "./seating-empty-inspector";
import SeatingOverview from "./seating-overview";
import SeatingAddMenu from "./seating-add-menu";
import TableGuestWorkspace from "./table-guest-workspace";
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
  exportAction: ReactNode;
  onChange: (plan: SeatingPlan) => void;
  autosave: ReturnType<typeof useSeatingAutosave>;
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
  autosave,
  onReload,
}: Props) {
  const [selected, setSelected] = useState("");
  const [proposal, setProposal] = useState<ReturnType<
    typeof proposeSeating
  > | null>(null);
  const people = attendees(guests.filter((g) => g.response === "going"))
    .filter((person) => person.registered)
    .sort(surnameOrder);
  const table = plan.tables.find((t) => t.id === selected);
  const area = plan.areas?.find((item) => item.id === selected);
  const count = people.filter((p) => plan.assignments[p.id]).length;
  function move(id: string, x: number, y: number) {
    onChange({
      ...plan,
      tables: plan.tables.map((t) => (t.id === id ? { ...t, x, y } : t)),
    });
  }
  const automaticAction = (
    <button
      type="button"
      className="office-button seating-auto-action"
      disabled={busy}
      onClick={() => setProposal(proposeSeating(guests, plan, event, 10))}
    >
      <Icon name="users" />
      Asignar automáticamente
    </button>
  );
  return (
    <fieldset disabled={busy} className="seating-editor">
      <SeatingOverview
        tables={plan.tables.length}
        count={count}
        pending={people.length - count}
      />
      <TableGuestWorkspace
        table={table}
        area={area}
        plan={plan}
        people={people}
        limit={event.capacityUnlimited ? 5000 : Math.min(5000, event.capacity)}
        onChange={onChange}
      >
        {table ? (
          <TableInspector
            key={table.id}
            actions={automaticAction}
            table={table}
            plan={plan}
            people={people}
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
          <SeatingEmptyInspector actions={automaticAction} />
        )}
        <div className="seating-canvas-stage">
          <SeatingAddMenu
            plan={plan}
            onChange={onChange}
            onSelect={setSelected}
          />
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
        </div>
      </TableGuestWorkspace>
      <SeatingSaveBar
        busy={busy}
        dirty={dirty}
        stale={stale}
        autosave={autosave}
        onReload={onReload}
      />
      <section className="seating-export-panel">
        <div>
          <Icon name="lucide:file-spreadsheet" />
          <div>
            <h3>Lista para la entrada</h3>
            <p>
              Descarga la lista para quien recibe a tus invitados: nombres,
              acompañantes y mesa asignada para comprobar el ingreso y guiarlos.
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
