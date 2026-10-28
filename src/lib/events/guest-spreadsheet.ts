import { parseGuestRows, guestHeaders } from "./guest-rows";
import { validateWorkbookZip } from "./xlsx-guard";
import { guestCategories } from "./guest-categories";
export async function readGuestFile(file: File) {
  if (file.size > 2_000_000) throw new Error("El archivo supera 2 MB.");
  if (!/\.xlsx$/i.test(file.name))
    throw new Error("Selecciona un archivo Excel (.xlsx).");
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
export async function downloadGuestTemplate() {
  const sample = [
    "Ana",
    "Rojas",
    "+51987654321",
    "1",
    "mujer",
    "Familia de la novia",
    "",
    "",
    "",
  ];
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
  const choices = book.addWorksheet("Opciones");
  guestCategories.forEach((category) => choices.addRow([category]));
  choices.state = "hidden";
  book.definedNames.add(
    `Opciones!$A$1:$A$${guestCategories.length}`,
    "CategoriasInvitados",
  );
  for (let row = 2; row <= 501; row++) {
    sheet.getCell(`F${row}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: ["CategoriasInvitados"],
      showErrorMessage: true,
      errorStyle: "stop",
      errorTitle: "Categoría no válida",
      error: "Elige una categoría del desplegable.",
    };
    sheet.getCell(`D${row}`).dataValidation = {
      type: "whole",
      operator: "between",
      allowBlank: true,
      formulae: [0, 1],
      showErrorMessage: true,
      errorStyle: "stop",
      error: "Usa 0 o 1 acompañante.",
    };
  }
  const guide = book.addWorksheet("Cómo llenar la lista");
  guide.getColumn(1).width = 100;
  for (const line of [
    "Reemplaza la fila de ejemplo con tus invitados. Usa la hoja Invitados.",
    "Una fila por persona titular. Nombre y telefono son obligatorios.",
    "El orden de las filas será el orden de invitación. Las altas manuales van al final.",
    "Telefono: código de país, por ejemplo +51987654321. Conservar como texto.",
    "acompanantes_permitidos: 0 para ir solo o 1 para un plus one. Cada titular puede llevar como máximo un acompañante; se cuenta aparte.",
    "Deja los nombres de acompañantes vacíos para que el titular los registre al confirmar, o complétalos si ya los sabes.",
    "categoria: elige una opción del desplegable. Agrupa a familia y amigos para proponer mesas; no añade cupos. Puedes dejarla vacía.",
    "Puedes añadir más personas que el aforo. Se invita por orden cuando hay cupo para todo el grupo.",
    "Los mensajes empiezan al pulsar Enviar invitaciones, después de preparar la web.",
    "Una negativa, menos acompañantes o el vencimiento de una reserva libera cupos para la siguiente invitación.",
  ])
    guide.addRow([line]);
  downloadFile(
    new Uint8Array(await book.xlsx.writeBuffer()),
    "plantilla-invitados.xlsx",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
}
