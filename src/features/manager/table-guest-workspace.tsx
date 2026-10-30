import { useEffect, useRef, useState, type ReactNode } from "react";
import Icon from "@/components/icon";
import type { Attendee, SeatingPlan, SeatingTable } from "@/lib/events/seating";
import TableHouseholds from "./table-households";
function GuestDialog({
  table,
  plan,
  people,
  limit,
  onChange,
  onClose,
}: {
  table: SeatingTable;
  plan: SeatingPlan;
  people: Attendee[];
  limit: number;
  onChange: (plan: SeatingPlan) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    return () => {
      if (trigger?.isConnected) trigger.focus();
    };
  }, []);
  return (
    <dialog
      ref={dialog}
      className="table-guests-dialog"
      aria-labelledby="table-guests-title"
      onCancel={onClose}
    >
      <header>
        <div>
          <h2 id="table-guests-title">Invitados de {table.name}</h2>
          <p>El invitado y sus acompañantes siempre se mueven juntos.</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Cerrar invitados">
          <Icon name="close" />
        </button>
      </header>
      <TableHouseholds
        key={table.id}
        table={table}
        plan={plan}
        people={people}
        limit={limit}
        onChange={onChange}
      />
      <footer>
        <span>Los cambios se guardan automáticamente.</span>
        <button type="button" onClick={onClose}>
          Listo
        </button>
      </footer>
    </dialog>
  );
}
export default function TableGuestWorkspace({
  children,
  table,
  plan,
  people,
  limit,
  onChange,
}: {
  children: ReactNode;
  table?: SeatingTable;
  plan: SeatingPlan;
  people: Attendee[];
  limit: number;
  onChange: (plan: SeatingPlan) => void;
}) {
  const [open, setOpen] = useState(false);
  const pointer = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  return (
    <div
      className="seating-workspace seating-workspace-wide seating-toolbar-workspace"
      onPointerDownCapture={(e) => {
        pointer.current = { x: e.clientX, y: e.clientY, moved: false };
      }}
      onPointerMoveCapture={(e) => {
        const p = pointer.current;
        if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 5)
          p.moved = true;
      }}
      onClick={(e) => {
        const target = e.target as Element;
        if (
          target.closest(".seating-table, [data-table-guests]") &&
          (e.detail === 0 || !pointer.current?.moved)
        )
          setOpen(true);
      }}
    >
      {children}
      {open && table && (
        <GuestDialog
          table={table}
          plan={plan}
          people={people}
          limit={limit}
          onChange={onChange}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}
