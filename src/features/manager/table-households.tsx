import { useRef, useState } from "react";
import Icon from "@/components/icon";
import PersonGlyph from "@/components/person-glyph";
import { fullName } from "@/lib/events/attendees";
import {
  tableHouseholds,
  moveTableHousehold,
} from "@/lib/events/table-households";
import type { Attendee, SeatingPlan, SeatingTable } from "@/lib/events/seating";

export default function TableHouseholds({
  table,
  plan,
  people,
  limit,
  onChange,
}: {
  table: SeatingTable;
  plan: SeatingPlan;
  people: Attendee[];
  limit: number;
  onChange: (plan: SeatingPlan) => void;
}) {
  const addButton = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const groups = tableHouseholds(people, plan, table, limit);
  const seated = groups.filter((group) => group.here > 0);
  const available = tableHouseholds(people, plan, table, limit, search).filter(
    (group) => !group.checked,
  );
  function card(group: (typeof groups)[number], remove: boolean) {
    const action = remove
      ? "Quitar de esta mesa"
      : group.elsewhere.length
        ? "Mover aquí"
        : "Sentar aquí";
    return (
      <article className="seating-party-card" key={group.guestId}>
        <div className="seating-household-people">
          {group.members.map((person) => (
            <div key={person.id} className="seating-household-person">
              <PersonGlyph gender={person.gender} />
              <span>
                <strong>{fullName(person)}</strong>
                <small>
                  {person.slot ? "Acompañante" : person.family || "Invitado"}
                </small>
              </span>
            </div>
          ))}
        </div>
        <small className="seating-party-context">
          {group.members.length}{" "}
          {group.members.length === 1 ? "persona" : "personas"}
          {!remove &&
            (group.elsewhere.length
              ? ` · En ${group.elsewhere.join(", ")}`
              : " · Sin mesa")}
        </small>
        {!remove && group.disabled && (
          <small className="seating-party-context">
            No hay asientos disponibles para este grupo completo.
          </small>
        )}
        <button
          type="button"
          disabled={!remove && group.disabled}
          aria-label={`${action}: ${fullName(group.members[0])}${group.members.length > 1 ? " y acompañantes" : ""}`}
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
              setSearch("");
              addButton.current?.focus();
              setNotice(
                `${fullName(group.members[0])}${group.members.length > 1 ? " y acompañantes" : ""}: ${remove ? "ya no están en esta mesa" : `ubicados en ${table.name}`}.`,
              );
            }
          }}
        >
          <Icon name={remove ? "lucide:minus" : "plus"} />
          {action}
        </button>
      </article>
    );
  }
  return (
    <section className="table-assignment table-guest-workflow">
      <div className="table-section-title">
        <h4>Sentados en esta mesa</h4>
        <span>
          {people.filter((p) => plan.assignments[p.id] === table.id).length}/
          {table.capacity}
        </span>
      </div>
      <div className="seating-households">
        {seated.map((group) => card(group, true))}
        {!seated.length && (
          <p className="table-assignment-empty">
            Esta mesa está vacía. Añade invitados para empezar.
          </p>
        )}
      </div>
      <div className="table-add-panel">
        <h4>¿A quién quieres sentar aquí?</h4>
        <p>Cada invitado se mueve junto con sus acompañantes.</p>
        <label className="table-search">
          <span>Buscar invitado o acompañante</span>
          <span>
            <Icon name="search" />
            <input
              ref={addButton}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Escribe un nombre o apellido"
            />
          </span>
        </label>
        <div className="seating-households">
          {available.map((group) => card(group, false))}
          {!available.length && (
            <p className="table-assignment-empty">
              {search
                ? "No encontramos ese nombre."
                : people.length
                  ? "Todos los invitados confirmados ya están en esta mesa."
                  : "Aquí aparecerán tus invitados cuando confirmen su asistencia."}
            </p>
          )}
        </div>
      </div>
      <p className="table-assignment-notice" role="status">
        {notice}
      </p>
    </section>
  );
}
