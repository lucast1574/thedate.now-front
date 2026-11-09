import { attendees, fullName } from "./attendees";
import { surnameOrder } from "./auto-seating";
import { downloadFile } from "./guest-spreadsheet";
import type { Event, Guest } from "./types";
import type { SeatingPlan } from "./seating";
import { addDoorSheet } from "./door-workbook";
export function doorRows(guests: Guest[], plan: SeatingPlan) {
  const byGuest = new Map(guests.map((guest) => [guest.id, guest]));
  return attendees(guests)
    .sort(surnameOrder)
    .map((person) => {
      const table = plan.tables.find(
        (table) => table.id === plan.assignments[person.id],
      );
      return [
        person.lastName,
        person.registered
          ? person.name
          : `Acompañante de ${fullName(byGuest.get(person.guestId)!)}`,
        table?.name || "Sin mesa",
      ];
    });
}
export async function exportDoorWorkbook(
  event: Event,
  guests: Guest[],
  plan: SeatingPlan,
) {
  const { Workbook } = await import("exceljs");
  const book = new Workbook();
  book.creator = event.kind === "wedding" ? "Save the Date" : "The Date";
  addDoorSheet(book, event, doorRows(guests, plan));
  downloadFile(
    new Uint8Array(await book.xlsx.writeBuffer()),
    "invitados-y-mesas-entrada.xlsx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}
