import { type Translator, spanishTranslator } from "@/lib/i18n/translator";
import { attendees, fullName } from "./attendees";
import { surnameOrder } from "./auto-seating";
import { downloadFile } from "./guest-spreadsheet";
import type { Event, Guest } from "./types";
import type { SeatingPlan } from "./seating";
import { addDoorSheet } from "./door-workbook";
export function doorRows(
  guests: Guest[],
  plan: SeatingPlan,
  i18n: Translator = spanishTranslator,
) {
  const byGuest = new Map(guests.map((guest) => [guest.id, guest]));
  return attendees(guests, i18n)
    .sort(surnameOrder)
    .map((person) => {
      const table = plan.tables.find(
        (table) => table.id === plan.assignments[person.id],
      );
      return [
        person.lastName,
        person.registered
          ? person.name
          : i18n("Acompañante de {v0}", {
              v0: fullName(byGuest.get(person.guestId)!),
            }),
        table?.name || i18n("Sin mesa"),
      ];
    });
}
export async function exportDoorWorkbook(
  event: Event,
  guests: Guest[],
  plan: SeatingPlan,
  i18n: Translator = spanishTranslator,
) {
  const { Workbook } = await import("exceljs");
  const book = new Workbook();
  book.creator = event.kind === "wedding" ? "Save the Date" : "The Date";
  addDoorSheet(book, event, doorRows(guests, plan, i18n), i18n);
  downloadFile(
    new Uint8Array(await book.xlsx.writeBuffer()),
    "invitados-y-mesas-entrada.xlsx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}
