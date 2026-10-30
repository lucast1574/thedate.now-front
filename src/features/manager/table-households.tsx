import { useState } from "react";
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
  const [search, setSearch] = useState(""),
    [filter, setFilter] = useState("all");
  const groups = tableHouseholds(people, plan, table, limit, search, filter);
  return (
    <section className="table-assignment">
      <div className="table-section-title">
        <h4>Personas en esta mesa</h4>
        <span>
          {people.filter((p) => plan.assignments[p.id] === table.id).length}/
          {table.capacity}
        </span>
      </div>
      <p>
        Selecciona una invitación para mover juntos al titular y sus
        acompañantes.
      </p>
      <label className="table-search">
        <span>Buscar por nombre o familia</span>
        <span>
          <Icon name="search" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Busca a tus invitados"
          />
        </span>
      </label>
      <div
        className="table-person-filters"
        role="group"
        aria-label="Filtrar personas"
      >
        {[
          ["all", "Todos"],
          ["unassigned", "Sin mesa"],
          ["here", "En esta mesa"],
        ].map(([value, label]) => (
          <button
            type="button"
            key={value}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="seating-households">
        {groups.map((group) => (
          <label
            className="seating-household"
            key={group.guestId}
            data-assigned={group.checked}
            data-disabled={!group.checked && group.disabled}
          >
            <input
              type="checkbox"
              checked={group.checked}
              disabled={!group.checked && group.disabled}
              aria-label={`${group.checked ? "Quitar" : "Asignar"} a ${fullName(group.members[0])}${group.members.length > 1 ? " y sus acompañantes" : ""}`}
              onChange={(e) => {
                const next = moveTableHousehold(
                  people,
                  plan,
                  table,
                  limit,
                  group.guestId,
                  e.target.checked,
                );
                if (next) onChange(next);
              }}
            />
            <span className="seating-household-people">
              {group.members.map((person) => (
                <span key={person.id} className="seating-household-person">
                  <PersonGlyph gender={person.gender} />
                  <span>
                    <strong>{fullName(person)}</strong>
                    <small>
                      {person.slot ? "Acompañante" : person.family || "Titular"}
                    </small>
                  </span>
                </span>
              ))}
              <small className="seating-household-state">
                {group.checked
                  ? "En esta mesa"
                  : group.disabled
                    ? "No hay espacio para todo el grupo"
                    : group.elsewhere.length
                      ? `${group.elsewhere.join(", ")} · se moverán aquí`
                      : group.here
                        ? `${group.here} de ${group.members.length} en esta mesa`
                        : "Sin mesa asignada"}
              </small>
            </span>
            <span className="seating-household-size">
              {group.members.length}
              <span>{group.members.length === 1 ? "persona" : "personas"}</span>
            </span>
          </label>
        ))}
        {!groups.length && (
          <p className="table-assignment-empty">
            {people.length
              ? "No hay invitados con este filtro."
              : "Los invitados aparecerán aquí cuando confirmen y registren sus datos."}
          </p>
        )}
      </div>
    </section>
  );
}
