import { attendees, fullName, responseLabel } from "./attendees";
import { surnameOrder } from "./auto-seating";
import { downloadFile } from "./guest-spreadsheet";
import type { Event, Guest } from "./types";
import type { SeatingPlan } from "./seating";
export function doorRows(
  guests: Guest[],
  plan: SeatingPlan,
  confirmedOnly: boolean,
) {
  const eligible = guests.filter((g) =>
    confirmedOnly ? g.response === "going" : g.response !== "going",
  );
  const byGuest = new Map(guests.map((g) => [g.id, g]));
  return attendees(eligible)
    .sort(surnameOrder)
    .map((person) => {
      const guest = byGuest.get(person.guestId)!;
      const table = plan.tables.find(
        (t) => t.id === plan.assignments[person.id],
      );
      return [
        person.lastName,
        person.name,
        fullName(guest),
        person.slot ? "Acompañante" : "Titular",
        person.family,
        responseLabel(guest),
        table?.name || "Sin mesa",
        !person.registered ? "Falta registrar nombre" : "",
        "",
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
  for (const [name, confirmed] of [
    ["Entrada confirmados", true],
    ["Revisar respuestas", false],
  ] as const) {
    const sheet = book.addWorksheet(name);
    sheet.addRow([
      event.title,
      `Actualizado ${new Date().toISOString()}`,
      `Plano v${plan.version}`,
    ]);
    sheet.addRow([
      "Apellido",
      "Nombre",
      "Invitación de",
      "Tipo",
      "Familia",
      "Respuesta",
      "Mesa",
      "Observaciones",
      "Ingresó (marcar)",
    ]);
    doorRows(guests, plan, confirmed).forEach((row) => sheet.addRow(row));
    for (let i = 1; i <= 9; i++) {
      const col = sheet.getColumn(i);
      col.width = 25;
      col.numFmt = "@";
    }
    sheet.getRow(2).font = { bold: true };
    sheet.views = [{ state: "frozen", ySplit: 2 }];
    sheet.autoFilter = { from: "A2", to: `I${Math.max(2, sheet.rowCount)}` };
  }
  downloadFile(
    new Uint8Array(await book.xlsx.writeBuffer()),
    "invitados-y-mesas-entrada.xlsx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}
