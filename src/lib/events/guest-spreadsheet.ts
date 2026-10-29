import { collectGuestRows, type GuestRowIssue } from "./guest-rows";
import { validateWorkbookZip } from "./xlsx-guard";
export async function readGuestFile(file: File) {
  const report = await readGuestFileReport(file);
  if (report.issues.length) {
    const issue = report.issues[0];
    throw new Error(`Revisa la fila ${issue.row}: ${issue.message}`);
  }
  if (!report.guests.length)
    throw new Error("Importa entre 1 y 500 invitados por archivo.");
  return report.guests;
}
export async function readGuestFileReport(file: File) {
  if (file.size > 2_000_000) throw new Error("El archivo supera 2 MB.");
  if (!/\.xlsx$/i.test(file.name))
    throw new Error("Selecciona un archivo Excel (.xlsx).");
  const bytes = await file.arrayBuffer();
  validateWorkbookZip(bytes);
  const { Workbook } = await import("exceljs");
  const book = new Workbook();
  try {
    await book.xlsx.load(bytes);
  } catch {
    throw new Error(
      "No pudimos leer este Excel. Descarga la plantilla y copia allí tu lista.",
    );
  }
  const sheet = book.worksheets[0];
  if (!sheet || sheet.rowCount > 520 || sheet.columnCount > 30)
    throw new Error(
      "Usa la primera hoja con hasta 500 invitados y 30 columnas.",
    );
  const rows: string[][] = [];
  const issues: GuestRowIssue[] = [];
  const header = Array.from({ length: Math.min(sheet.rowCount, 20) }, (_, i) =>
    sheet.getRow(i + 1),
  ).find((row) =>
    Array.from({ length: sheet.columnCount }, (_, i) =>
      row.getCell(i + 1).text.toLowerCase(),
    ).includes("nombre"),
  );
  const countryColumn =
    header &&
    Array.from({ length: sheet.columnCount }, (_, i) =>
      header.getCell(i + 1).text.toLowerCase(),
    ).findIndex((label) => ["país", "pais", "country"].includes(label));
  const countryIndex = countryColumn === undefined ? -1 : countryColumn;
  const firstDataRow = header ? header.number + 1 : 0;
  sheet.eachRow({ includeEmpty: true }, (row) => {
    if (header && row.number < header.number) {
      rows.push([]);
      return;
    }
    const cells: string[] = [];
    let unsafe = false;
    for (let i = 1; i <= sheet.columnCount; i++) {
      const cell = row.getCell(i);
      let value = cell.value;
      const formula =
        value &&
        typeof value === "object" &&
        ("formula" in value || "sharedFormula" in value)
          ? cell.formula
          : undefined;
      const firstCountry =
        countryIndex >= 0
          ? sheet.getRow(firstDataRow).getCell(countryIndex + 1)
          : null;
      if (
        formula &&
        i === countryIndex + 1 &&
        row.number > firstDataRow &&
        formula === `$${sheet.getColumn(i).letter}$${firstDataRow}`
      ) {
        const initial = firstCountry!.value;
        value = typeof initial === "string" ? initial : "";
      }
      if (
        formula &&
        header?.number === 10 &&
        countryIndex === 3 &&
        i === 4 &&
        row.number >= firstDataRow &&
        formula === `IF($B${row.number}="","",$D$5)`
      ) {
        const initial = sheet.getCell("D5").value;
        value =
          row.getCell(2).value && typeof initial === "string" ? initial : "";
      }
      if (
        value !== null &&
        typeof value !== "string" &&
        typeof value !== "number"
      ) {
        unsafe = true;
        break;
      }
      cells.push(value === null ? "" : String(value));
    }
    if (unsafe) {
      issues.push({
        row: row.number,
        message: "Usa texto y números; no fórmulas ni enlaces en la lista.",
      });
      rows.push([]);
    } else rows.push(cells);
  });
  const report = collectGuestRows(rows);
  return {
    guests: report.guests,
    issues: [...issues, ...report.issues].sort((a, b) => a.row - b.row),
  };
}
export function downloadFile(data: BlobPart, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function downloadGuestTemplate() {
  const response = await fetch("/templates/plantilla-invitados.xlsx");
  if (!response.ok)
    throw new Error("No pudimos descargar la plantilla. Vuelve a intentarlo.");
  downloadFile(
    await response.arrayBuffer(),
    "plantilla-invitados.xlsx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}
