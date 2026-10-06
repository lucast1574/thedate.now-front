import type { GuestFields } from "./types";
import { parseGuestRows } from "./guest-rows";
export function parseGuestCSV(source: string): GuestFields[] {
  if (source.length > 200_000)
    throw new Error("El archivo supera el tamaño permitido.");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  const text = source.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') {
        field += '"';
        i++;
      } else quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      field = "";
    } else field += char;
  }
  if (quoted) throw new Error("El CSV tiene comillas sin cerrar.");
  row.push(field);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return parseGuestRows(rows);
}
