import type { Attendee, SeatingPlan, SeatingTable } from "./seating";
import { fullName } from "./attendees";

export function tableHouseholds(
  people: Attendee[],
  plan: SeatingPlan,
  table: SeatingTable,
  limit: number,
  search = "",
  filter = "all",
) {
  const groups = new Map<string, Attendee[]>();
  for (const person of people)
    groups.set(person.guestId, [...(groups.get(person.guestId) || []), person]);
  const used = Object.keys(plan.assignments).length;
  const assigned = people.filter(
    (p) => plan.assignments[p.id] === table.id,
  ).length;
  const query = search.trim().toLocaleLowerCase("es");
  return [...groups.entries()]
    .map(([guestId, members]) => {
      members.sort((a, b) => a.slot - b.slot);
      const here = members.filter(
        (p) => plan.assignments[p.id] === table.id,
      ).length;
      const unassigned = members.filter((p) => !plan.assignments[p.id]).length;
      const elsewhere = [
        ...new Set(
          members
            .map((p) => plan.assignments[p.id])
            .filter((id) => id && id !== table.id),
        ),
      ]
        .map((id) => plan.tables.find((t) => t.id === id)?.name)
        .filter(Boolean);
      return {
        guestId,
        members,
        here,
        unassigned,
        elsewhere,
        checked: here === members.length,
        disabled:
          assigned + members.length - here > table.capacity ||
          used + unassigned > limit,
      };
    })
    .filter(
      (group) =>
        (!query ||
          group.members.some((p) =>
            `${fullName(p)} ${p.family}`
              .toLocaleLowerCase("es")
              .includes(query),
          )) &&
        (filter === "here"
          ? group.here > 0
          : filter === "unassigned"
            ? group.unassigned > 0
            : true),
    )
    .sort((a, b) => Number(b.here > 0) - Number(a.here > 0));
}

export function moveTableHousehold(
  people: Attendee[],
  plan: SeatingPlan,
  table: SeatingTable,
  limit: number,
  guestId: string,
  checked: boolean,
): SeatingPlan | null {
  const group = tableHouseholds(people, plan, table, limit).find(
    (g) => g.guestId === guestId,
  );
  if (!group || (checked && group.disabled)) return null;
  const assignments = { ...plan.assignments };
  for (const person of group.members) {
    if (checked) assignments[person.id] = table.id;
    else if (assignments[person.id] === table.id) delete assignments[person.id];
  }
  return { ...plan, assignments };
}
