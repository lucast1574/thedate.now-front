import { attendees, fullName } from "@/lib/events/attendees";
import type { Guest } from "@/lib/events/types";
import type { SeatingPlan } from "@/lib/events/seating";
import SeatingCanvas from "../seating-canvas";

export default function RecordTables({
  guests,
  plan,
}: {
  guests: Guest[];
  plan: SeatingPlan;
}) {
  const people = attendees(
    guests.filter((guest) => guest.response === "going"),
  );
  const groups = plan.tables.map((table) => ({
    id: table.id,
    name: table.name,
    people: people.filter((person) => plan.assignments[person.id] === table.id),
  }));
  const unassigned = people.filter((person) => !plan.assignments[person.id]);
  if (unassigned.length)
    groups.push({ id: "unassigned", name: "Sin mesa", people: unassigned });
  return (
    <>
      <p className="record-summary">
        {plan.tables.length} {plan.tables.length === 1 ? "mesa" : "mesas"} ·{" "}
        {people.length - unassigned.length} personas ubicadas
      </p>
      {!groups.length ? (
        <p className="record-empty">No hay mesas guardadas.</p>
      ) : (
        <div className="record-table-groups">
          {groups.map((group) => (
            <section key={group.id}>
              <h3>
                {group.name}
                <span>
                  {group.people.length}{" "}
                  {group.people.length === 1 ? "persona" : "personas"}
                </span>
              </h3>
              {group.people.length ? (
                <ul>
                  {group.people.map((person) => (
                    <li key={person.id}>{fullName(person)}</li>
                  ))}
                </ul>
              ) : (
                <p>Sin invitados asignados</p>
              )}
            </section>
          ))}
        </div>
      )}
      {(plan.tables.length > 0 || (plan.areas?.length || 0) > 0) && (
        <details className="record-plan">
          <summary>Ver plano del salón</summary>
          <fieldset disabled>
            <SeatingCanvas
              plan={plan}
              people={people}
              selected=""
              onSelect={() => {}}
              onMove={() => {}}
              areas={plan.areas}
              onMoveArea={() => {}}
            />
          </fieldset>
        </details>
      )}
    </>
  );
}
