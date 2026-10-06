import type { GuestFields } from "./types";
import type { Gender } from "./seating";
export const guestHeaders = [
  "nombre",
  "apellido",
  "telefono",
  "cupos",
  "genero",
  "familia",
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
  const headers = rows[0]?.map((c) => c.trim().toLowerCase()) || [];
  const index = (names: string[]) =>
    headers.findIndex((c) => names.includes(c));
  if (
    index(["nombre", "name"]) < 0 ||
    index(["telefono", "teléfono", "phone"]) < 0
  )
    throw new Error(
      "Usa la plantilla con nombre,telefono,cupos y teléfonos +código de país.",
    );
  const data = rows.slice(1).filter((row) => row.some((cell) => cell.trim()));
  if (!data.length || data.length > 500)
    throw new Error("Importa entre 1 y 500 invitados por archivo.");
  return data.map((cells, n) => {
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
      const guest: GuestFields = {
        name: field("nombre", "name"),
        lastName: field("apellido"),
        phone: field("telefono", "teléfono", "phone"),
        seats: Number(field("cupos", "seats") || 1),
        gender: gender(field("genero")),
        family: field("familia"),
        companions: names.map((name, i) => ({
          name,
          lastName: surnames[i] || "",
          gender: gender(genders[i] || ""),
        })),
      };
      if (
        guest.name.length < 2 ||
        guest.name.length > 120 ||
        (guest.lastName?.length || 0) > 80 ||
        (guest.family?.length || 0) > 80 ||
        !/^\+[1-9][0-9]{6,14}$/.test(guest.phone) ||
        !Number.isInteger(guest.seats) ||
        guest.seats < 1 ||
        guest.seats > 20 ||
        names.length > guest.seats - 1 ||
        guest.companions?.some(
          (p) =>
            p.name.length < 2 || p.name.length > 120 || p.lastName.length > 80,
        )
      )
        throw new Error("Revisa nombres, teléfono, cupos y acompañantes.");
      return guest;
    } catch (error) {
      throw new Error(`Revisa la fila ${n + 2}: ${(error as Error).message}`);
    }
  });
}
