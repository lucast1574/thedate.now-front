import { attendees, fullName } from "./attendees";
import type { Event, Guest } from "./types";
import type { Attendee, SeatingPlan, SeatingTable } from "./seating";
const key = (value: string) =>
  value
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
export function familyKey(guest: Guest) {
  return key(guest.family || "") || "sin-categoria";
}
export function surnameOrder(
  a: { name: string; lastName?: string },
  b: { name: string; lastName?: string },
) {
  return (
    (a.lastName || a.name).localeCompare(b.lastName || b.name, "es", {
      sensitivity: "base",
    }) || fullName(a).localeCompare(fullName(b), "es")
  );
}
export function newTable(
  index: number,
  capacity: number,
  shape: SeatingTable["shape"],
  id: string,
): SeatingTable {
  return {
    id,
    name: `Mesa ${index + 1}`,
    shape,
    capacity,
    x: 50 + (index % 5) * 300,
    y: 50 + (Math.floor(index / 5) % 4) * 240,
    rotation: 0,
  };
}
export function proposeSeating(
  guests: Guest[],
  current: SeatingPlan,
  event: Pick<Event, "capacity" | "capacityUnlimited">,
  defaultCapacity: number,
) {
  const eligible = guests
    .filter((g) => g.response === "going")
    .sort(surnameOrder);
  const groups = new Map<string, Attendee[][]>();
  for (const guest of eligible) {
    const group = groups.get(familyKey(guest)) || [];
    group.push(attendees([guest]).filter((person) => person.registered));
    groups.set(familyKey(guest), group);
  }
  const people = attendees(eligible).filter((person) => person.registered);
  const limit = event.capacityUnlimited ? 5000 : Math.min(event.capacity, 5000);
  const tables = current.tables.map((t) => ({ ...t }));
  const allowed = new Set(people.map((p) => p.id));
  const assignments: Record<string, string> = Object.fromEntries(
    Object.entries(current.assignments).filter(
      ([id, table]) => allowed.has(id) && tables.some((t) => t.id === table),
    ),
  );
  const loads = new Map(
    tables.map((t) => [
      t.id,
      Object.values(assignments).filter((id) => id === t.id).length,
    ]),
  );
  const categories = new Map(
    tables.map((t) => [
      t.id,
      new Set(
        eligible
          .filter((g) => assignments[`${g.id}~0`] === t.id)
          .map(familyKey),
      ),
    ]),
  );
  const unassigned: Attendee[] = [];
  let splitFamilies = 0;
  function place(party: Attendee[], category: string) {
    if (
      assignments[party[0].id] &&
      party.every((p) => assignments[p.id] === assignments[party[0].id])
    )
      return true;
    const old = assignments[party[0].id];
    party.forEach((p) => {
      const id = assignments[p.id];
      if (id) loads.set(id, (loads.get(id) || 0) - 1);
      delete assignments[p.id];
    });
    if (Object.keys(assignments).length + party.length > limit) {
      unassigned.push(...party);
      return false;
    }
    const fits = (t: SeatingTable) =>
      t.capacity - (loads.get(t.id) || 0) >= party.length;
    let table =
      tables.find((t) => t.id === old && fits(t)) ||
      tables.find((t) => fits(t) && categories.get(t.id)?.has(category)) ||
      tables.find((t) => fits(t) && !loads.get(t.id));
    if (!table) {
      let index = tables.length;
      while (
        tables.some(
          (t) => t.id === `auto-${index + 1}` || t.name === `Mesa ${index + 1}`,
        )
      )
        index++;
      table = newTable(
        index,
        Math.max(defaultCapacity, party.length),
        "round",
        `auto-${index + 1}`,
      );
      tables.push(table);
    }
    party.forEach((person) => {
      assignments[person.id] = table.id;
    });
    loads.set(table.id, (loads.get(table.id) || 0) + party.length);
    const labels = categories.get(table.id) || new Set<string>();
    labels.add(category);
    categories.set(table.id, labels);
    return true;
  }
  for (const [category, family] of groups) {
    family.forEach((party) => place(party, category));
    if (
      new Set(
        family
          .flat()
          .map((p) => assignments[p.id])
          .filter(Boolean),
      ).size > 1
    )
      splitFamilies++;
  }
  return {
    plan: { ...current, tables, assignments },
    unassigned,
    splitFamilies,
    total: people.length,
    unnamed: people.filter((p) => !p.registered).length,
  };
}
