import type { GuestFields } from "./types";
import type { Gender } from "./seating";
import { guestCategory } from "./guest-categories";
import { guestPhone, phoneCountry } from "./guest-phone";
export type GuestRowIssue = { row: number; message: string };
export const guestHeaders = [
  "nombre",
  "apellido",
  "telefono",
  "acompanantes_permitidos",
  "genero",
  "categoria",
  "acompanantes",
  "apellidos_acompanantes",
  "generos_acompanantes",
];
const gender = (value: string): Gender => {
  const v = value.toLowerCase();
  if (!v || v === "sin especificar" || v === "unspecified")
    return "unspecified";
  if (v === "hombre" || v === "man") return "man";
  if (v === "mujer" || v === "woman") return "woman";
  throw new Error("Usa hombre, mujer o sin especificar en género.");
};
export function parseGuestRows(rows: string[][]): GuestFields[] {
  const report = collectGuestRows(rows);
  if (report.issues.length) {
    const issue = report.issues[0];
    throw new Error(`Revisa la fila ${issue.row}: ${issue.message}`);
  }
  if (!report.guests.length)
    throw new Error("Importa entre 1 y 500 invitados por archivo.");
  return report.guests;
}
export function collectGuestRows(rows: string[][]) {
  const headerRow = rows.slice(0, 20).findIndex((row) => {
    const labels = row.map((cell) => cell.trim().toLowerCase());
    return (
      labels.some((label) => ["nombre", "name"].includes(label)) &&
      labels.some((label) =>
        ["telefono", "teléfono", "phone", "whatsapp"].includes(label),
      )
    );
  });
  const headers = rows[headerRow]?.map((c) => c.trim().toLowerCase()) || [];
  const index = (names: string[]) =>
    headers.findIndex((c) => names.includes(c));
  if (
    index(["nombre", "name"]) < 0 ||
    index(["telefono", "teléfono", "phone", "whatsapp"]) < 0
  )
    throw new Error(
      "Usa la plantilla con Nombre y WhatsApp. Elige un país o incluye el código de país en el número.",
    );
  const data = rows
    .map((cells, rowIndex) => ({ cells, rowIndex }))
    .slice(headerRow + 1)
    .filter(({ cells }) =>
      cells.some(
        (cell, column) =>
          column !== index(["país", "pais", "country"]) && cell.trim(),
      ),
    );
  if (data.length > 500)
    throw new Error("Importa entre 1 y 500 invitados por archivo.");
  const issues: GuestRowIssue[] = [];
  const guests = data.map(({ cells, rowIndex }) => {
    const field = (...names: string[]) => (cells[index(names)] || "").trim();
    const parts = (name: string) =>
      field(name)
        ? field(name)
            .split("|")
            .map((s) => s.trim())
        : [];
    try {
      const names = parts("acompanantes"),
        surnames = parts("apellidos_acompanantes"),
        genders = parts("generos_acompanantes");
      if (surnames.length > names.length || genders.length > names.length)
        throw new Error("Faltan nombres de acompañantes.");
      const allowance = index([
        "acompanantes_permitidos",
        "acompañantes permitidos",
        "acompañantes_permitidos",
      ]);
      const plusOne = index([
        "¿puede llevar +1?",
        "puede llevar +1",
        "plus one",
      ]);
      const choice =
        plusOne >= 0 ? (cells[plusOne] || "").trim().toLowerCase() : "";
      if (plusOne >= 0 && !["", "sí", "si", "no", "0", "1"].includes(choice))
        throw new Error("En +1 elige Sí o No.");
      const seats =
        plusOne >= 0
          ? ["sí", "si", "1"].includes(choice)
            ? 2
            : 1
          : allowance >= 0
            ? 1 + Number((cells[allowance] || "").trim() || 0)
            : Number(field("cupos", "seats") || 1);
      if (
        allowance >= 0 &&
        field("cupos", "seats") &&
        Number(field("cupos", "seats")) !== seats
      )
        throw new Error(
          "Los cupos no coinciden con los acompañantes permitidos.",
        );
      const countryValue = field("país", "pais", "country");
      const country = phoneCountry(countryValue);
      if (countryValue && !country)
        throw new Error("País: elige una opción de la lista.");
      const guest: GuestFields = {
        name: field("nombre", "name"),
        lastName: field("apellido"),
        phone: guestPhone(
          field("telefono", "teléfono", "phone", "whatsapp"),
          country,
        ),
        seats,
        gender: gender(field("genero")),
        family: guestCategory(
          field("categoria", "categoría", "familia", "grupo"),
        ),
        companions: names.map((name, i) => ({
          name,
          lastName: surnames[i] || "",
          gender: gender(genders[i] || ""),
        })),
      };
      if (guest.name.length < 2 || guest.name.length > 120)
        throw new Error("Nombre: escribe entre 2 y 120 caracteres.");
      if ((guest.lastName?.length || 0) > 80)
        throw new Error("Apellido: usa como máximo 80 caracteres.");
      if (!Number.isInteger(guest.seats) || guest.seats < 1 || guest.seats > 2)
        throw new Error("Acompañante: permite solo cero o un +1.");
      if (
        names.length > guest.seats - 1 ||
        guest.companions?.some(
          (p) =>
            p.name.length < 2 || p.name.length > 120 || p.lastName.length > 80,
        )
      )
        throw new Error(
          "Acompañante: permite solo uno y revisa su nombre y apellido.",
        );
      return guest;
    } catch (error) {
      issues.push({ row: rowIndex + 1, message: (error as Error).message });
      return undefined;
    }
  });
  return {
    guests: guests.filter((guest): guest is GuestFields => !!guest),
    issues,
  };
}
