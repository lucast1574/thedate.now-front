import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import { newTable } from "./auto-seating";
import { newVenueArea, type VenueArea } from "./venue-areas";
import type { SeatingPlan } from "./seating";
export type SeatingAddition = "table" | VenueArea["kind"];
export function addSeatingItem(
  plan: SeatingPlan,
  kind: SeatingAddition,
  id: string,
  i18n: Translator = spanishTranslator,
): SeatingPlan | null {
  if (kind !== "table") {
    if ((plan.areas?.length || 0) >= 30) return null;
    return {
      ...plan,
      areas: [...(plan.areas || []), newVenueArea(kind, id, i18n)],
    };
  }
  const table = newTable(plan.tables.length, 10, "round", id, i18n);
  let number = plan.tables.length + 1;
  while (
    plan.tables.some((item) =>
      new RegExp(`^(?:mesa|table) ${number}$`, "i").test(item.name),
    )
  )
    number++;
  table.name = i18n("Mesa {v0}", { v0: number });
  return { ...plan, tables: [...plan.tables, table] };
}
