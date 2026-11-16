import { useTranslator } from "@/lib/i18n/react";
import { useRef, useState } from "react";
import SeatingRotationControl from "./seating-rotation-control";
import Icon from "@/components/icon";
import { fullName } from "@/lib/events/attendees";
import {
  tableHouseholds,
  moveTableHousehold,
} from "@/lib/events/table-households";
import type { Attendee, SeatingPlan, SeatingTable } from "@/lib/events/seating";
export default function TableGuestPopover({
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
  const i18n = useTranslator();

  const [adding, setAdding] = useState(false),
    [search, setSearch] = useState(""),
    [notice, setNotice] = useState("");
  const add = useRef<HTMLButtonElement>(null),
    input = useRef<HTMLInputElement>(null);
  const groups = tableHouseholds(people, plan, table, limit);
  const seated = groups.filter((g) => g.here > 0);
  const available = tableHouseholds(people, plan, table, limit, search).filter(
    (g) => !g.checked,
  );
  const occupied = people.filter(
    (p) => plan.assignments[p.id] === table.id,
  ).length;
  function row(group: (typeof groups)[number], remove: boolean) {
    return (
      <div className="table-popover-party" key={group.guestId}>
        <div>
          <strong>{fullName(group.members[0])}</strong>
          <small>
            {group.members.length > 1
              ? group.members.slice(1).map(fullName).join(", ")
              : i18n("Sin acompañantes")}
          </small>
          {!remove && (
            <small>
              {group.disabled
                ? i18n("El grupo completo no cabe aquí")
                : group.elsewhere.length
                  ? `En ${group.elsewhere.join(", ")}`
                  : i18n("Sin mesa")}
            </small>
          )}
        </div>
        <button
          type="button"
          disabled={!remove && group.disabled}
          aria-label={`${remove ? i18n("Quitar") : "Sentar"} a ${fullName(group.members[0])} y su grupo`}
          onClick={() => {
            const next = moveTableHousehold(
              people,
              plan,
              table,
              limit,
              group.guestId,
              !remove,
            );
            if (next) {
              onChange(next);
              setNotice(
                remove
                  ? i18n("Grupo retirado de la mesa.")
                  : i18n("Grupo sentado en esta mesa."),
              );
              setSearch("");
              if (adding) input.current?.focus();
              else add.current?.focus();
            }
          }}
        >
          {remove
            ? i18n("Quitar")
            : group.elsewhere.length
              ? i18n("Mover")
              : i18n("Sentar")}
        </button>
      </div>
    );
  }
  return (
    <>
      <header>
        <div>
          <h3 id="table-popover-title">{table.name}</h3>
          <small>
            {occupied}/{table.capacity} {i18n("asientos ocupados")}
          </small>
        </div>
        <button
          type="button"
          aria-label={i18n("Cerrar invitados")}
          onClick={onClose}
        >
          <Icon name="close" />
        </button>
      </header>
      <SeatingRotationControl
        value={table.rotation}
        onChange={(rotation) =>
          onChange({
            ...plan,
            tables: plan.tables.map((item) =>
              item.id === table.id ? { ...item, rotation } : item,
            ),
          })
        }
      />
      <div className="table-popover-list">
        {seated.map((g) => row(g, true))}
        {!seated.length && <p>{i18n("Aún no hay personas en esta mesa.")}</p>}
      </div>
      <button
        className="table-popover-add"
        type="button"
        ref={add}
        aria-expanded={adding}
        onClick={() => {
          setAdding(!adding);
          setSearch("");
        }}
      >
        <Icon name="plus" />
        {adding ? i18n("Cerrar lista") : i18n("Añadir personas")}
      </button>
      {adding && (
        <section className="table-popover-search">
          <label>
            {i18n("Buscar invitado o acompañante")}{" "}
            <input
              ref={input}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={i18n("Nombre o apellido")}
            />
          </label>
          <div className="table-popover-list">
            {available.map((g) => row(g, false))}
            {!available.length && (
              <p>
                {search
                  ? i18n("No encontramos ese nombre.")
                  : i18n("No hay más invitados para añadir.")}
              </p>
            )}
          </div>
        </section>
      )}
      <small className="table-popover-hint">
        {i18n("Los acompañantes se mueven juntos.")}
      </small>
      <span className="table-popover-status" role="status">
        {notice}
      </span>
    </>
  );
}
