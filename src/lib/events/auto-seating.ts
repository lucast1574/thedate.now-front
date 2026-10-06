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
  return (
    key(guest.family || guest.lastName?.split(/\s+/)[0] || "") ||
    `individual:${guest.id}`
  );
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
  includePending: boolean,
) {
  const eligible = guests
    .filter(
      (g) =>
        g.response === "going" ||
        (includePending && g.response !== "not_going"),
    )
    .sort(surnameOrder);
  const groups = new Map<string, Attendee[][]>();
  for (const guest of eligible) {
    const group = groups.get(familyKey(guest)) || [];
    group.push(attendees([guest]));
    groups.set(familyKey(guest), group);
  }
  const people = attendees(eligible);
  const limit = event.capacityUnlimited ? 5000 : Math.min(event.capacity, 5000);
  const tables = current.tables.length
    ? current.tables.map((t) => ({ ...t }))
    : Array.from(
        {
          length: Math.min(
            100,
            Math.ceil(Math.min(people.length, limit) / defaultCapacity),
          ),
        },
        (_, n) => newTable(n, defaultCapacity, "round", `auto-${n + 1}`),
      );
  const assignments: Record<string, string> = {},
    loads = new Map(tables.map((t) => [t.id, 0]));
  const unassigned: Attendee[] = [];
  let splitFamilies = 0;
  function place(party: Attendee[]) {
    const table = tables.find(
      (t) => t.capacity - (loads.get(t.id) || 0) >= party.length,
    );
    if (!table || Object.keys(assignments).length + party.length > limit) {
      unassigned.push(...party);
      return false;
    }
    party.forEach((person) => {
      assignments[person.id] = table.id;
    });
    loads.set(table.id, (loads.get(table.id) || 0) + party.length);
    return true;
  }
  for (const family of groups.values()) {
    const all = family.flat();
    if (
      !tables.some((t) => t.capacity - (loads.get(t.id) || 0) >= all.length) ||
      Object.keys(assignments).length + all.length > limit
    ) {
      if (family.length > 1) splitFamilies++;
      family.forEach(place);
    } else place(all);
  }
  return {
    plan: { ...current, tables, assignments },
    unassigned,
    splitFamilies,
    total: people.length,
    unnamed: people.filter((p) => !p.registered).length,
  };
}
