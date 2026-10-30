import { newTable } from "./auto-seating";
import { newVenueArea, type VenueArea } from "./venue-areas";
import type { SeatingPlan } from "./seating";
export type SeatingAddition = "table" | VenueArea["kind"];
export function addSeatingItem(
  plan: SeatingPlan,
  kind: SeatingAddition,
  id: string,
): SeatingPlan | null {
  if (kind !== "table") {
    if ((plan.areas?.length || 0) >= 30) return null;
    return { ...plan, areas: [...(plan.areas || []), newVenueArea(kind, id)] };
  }
  const table = newTable(plan.tables.length, 10, "round", id);
  let number = plan.tables.length + 1;
  while (
    plan.tables.some(
      (item) => item.name.toLocaleLowerCase("es") === `mesa ${number}`,
    )
  )
    number++;
  table.name = `Mesa ${number}`;
  return { ...plan, tables: [...plan.tables, table] };
}
