import { parseGuestCSV } from "./guest-csv";
import { parseGuestRows, guestHeaders } from "./guest-rows";
import { validateWorkbookZip } from "./xlsx-guard";
export async function readGuestFile(file: File) {
  if (file.size > 2_000_000) throw new Error("El archivo supera 2 MB.");
  if (/\.csv$/i.test(file.name)) return parseGuestCSV(await file.text());
  if (!/\.xlsx$/i.test(file.name)) throw new Error("Selecciona .xlsx o .csv.");
  const bytes = await file.arrayBuffer();
  validateWorkbookZip(bytes);
  const { Workbook } = await import("exceljs");
  const book = new Workbook();
  await book.xlsx.load(bytes);
  const sheet = book.worksheets[0];
  if (!sheet || sheet.rowCount > 501 || sheet.columnCount > 30)
    throw new Error(
      "Usa la primera hoja con hasta 500 invitados y 30 columnas.",
    );
  const rows: string[][] = [];
  sheet.eachRow({ includeEmpty: true }, (row) => {
    const cells: string[] = [];
    for (let i = 1; i <= sheet.columnCount; i++) {
      const value = row.getCell(i).value;
      if (
        value !== null &&
        typeof value !== "string" &&
        typeof value !== "number"
      )
        throw new Error(
          "Usa texto y números; no fórmulas ni enlaces en la lista.",
        );
      cells.push(value === null ? "" : String(value));
    }
    rows.push(cells);
  });
  return parseGuestRows(rows);
}
export function downloadFile(data: BlobPart, name: string, type: string) {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function downloadGuestTemplate(format: "xlsx" | "csv") {
  const sample = [
    "Ana",
    "Rojas",
    "+51987654321",
    "2",
    "mujer",
    "Familia Rojas",
    "Luis",
    "Rojas",
    "hombre",
  ];
  if (format === "csv") {
    downloadFile(
      "\uFEFF" + [guestHeaders.join(","), sample.join(",")].join("\r\n"),
      "plantilla-invitados.csv",
      "text/csv;charset=utf-8",
    );
    return;
  }
  const { Workbook } = await import("exceljs");
  const book = new Workbook(),
    sheet = book.addWorksheet("Invitados");
  sheet.addRow(guestHeaders);
  sheet.addRow(sample);
  guestHeaders.forEach((_, i) => {
    const col = sheet.getColumn(i + 1);
    col.width = i > 5 ? 28 : 22;
    col.numFmt = "@";
  });
  sheet.getRow(1).font = { bold: true };
  sheet.views = [{ state: "frozen", ySplit: 1 }];
  downloadFile(
    new Uint8Array(await book.xlsx.writeBuffer()),
    "plantilla-invitados.xlsx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}
