import type { Workbook, Worksheet } from "exceljs";
import type { Event } from "./types";

const ink = "292929",
  pale = "ECECEC",
  line = "D8D8D8";
function merged(sheet: Worksheet, text: string, height: number, dark = false) {
  const row = sheet.addRow([text, "", ""]);
  sheet.mergeCells(row.number, 1, row.number, 3);
  row.height = height;
  row.font = {
    name: "Calibri",
    size: dark ? 18 : 11,
    bold: dark,
    color: { argb: ink },
  };
  row.alignment = { vertical: "middle", wrapText: true };
  return row;
}
export function addDoorSheet(book: Workbook, event: Event, rows: string[][]) {
  const sheet = book.addWorksheet("Invitados por mesa");
  [29, 37, 24].forEach((width, i) => {
    sheet.getColumn(i + 1).width = width;
    sheet.getColumn(i + 1).numFmt = "@";
  });
  merged(sheet, event.title, 38, true);
  merged(sheet, `GUÍA DE ENTRADA  ·  ${rows.length} personas invitadas`, 24);
  merged(
    sheet,
    "Invitados agrupados por mesa y ordenados por apellido. Sin mesa: consultar al organizador.",
    30,
  );
  const header = sheet.addRow(["Apellido", "Nombre", "Mesa"]);
  header.height = 26;
  header.font = { name: "Calibri", size: 12, bold: true, color: { argb: ink } };
  header.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: pale } };
    cell.alignment = { vertical: "middle" };
    cell.border = { bottom: { style: "thin", color: { argb: ink } } };
  });
  const tables = [...new Set(rows.map((row) => row[2]))].sort((a, b) =>
    a === "Sin mesa"
      ? 1
      : b === "Sin mesa"
        ? -1
        : a.localeCompare(b, "es", { numeric: true }),
  );
  // Reserve room for the repeated heading and footer on an A4 page.
  let usedHeight = 118;
  for (const table of tables) {
    const people = rows.filter((row) => row[2] === table);
    const heights = people.map((row) =>
      Math.max(
        28,
        16 *
          Math.max(
            ...row.map((text, i) => Math.ceil(text.length / [27, 35, 22][i])),
          ) +
          10,
      ),
    );
    const groupHeight = 30 + heights.reduce((sum, height) => sum + height, 0);
    if (
      (usedHeight > 118 && usedHeight + Math.min(groupHeight, 80) > 680) ||
      (groupHeight <= 562 && usedHeight > 118 && usedHeight + groupHeight > 680)
    ) {
      sheet.getRow(sheet.rowCount).addPageBreak();
      usedHeight = 118;
    }
    const group = merged(
      sheet,
      `${table}  ·  ${people.length} ${people.length === 1 ? "persona" : "personas"}`,
      30,
    );
    group.font = {
      name: "Calibri",
      size: 13,
      bold: true,
      color: { argb: ink },
    };
    group.getCell(1).border = {
      top: { style: "medium", color: { argb: ink } },
      bottom: { style: "thin", color: { argb: line } },
    };
    usedHeight += 30;
    people.forEach((values, index) => {
      if (usedHeight + heights[index] > 680) {
        sheet.getRow(sheet.rowCount).addPageBreak();
        usedHeight = 118;
      }
      const row = sheet.addRow(values);
      row.height = heights[index];
      row.eachCell((cell, col) => {
        cell.font = {
          name: "Calibri",
          size: 12,
          bold: col === 3,
          color: { argb: ink },
        };
        cell.alignment = { vertical: "middle", wrapText: true };
        cell.border = { bottom: { style: "hair", color: { argb: line } } };
      });
      usedHeight += heights[index];
    });
  }
  if (!rows.length) merged(sheet, "Todavía no hay invitados en la lista.", 32);
  sheet.views = [{ state: "frozen", ySplit: 4, showGridLines: false }];
  sheet.pageSetup = {
    paperSize: 9,
    orientation: "portrait",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    printTitlesRow: "1:4",
    printArea: `A1:C${sheet.rowCount}`,
    margins: {
      left: 0.3,
      right: 0.3,
      top: 0.4,
      bottom: 0.4,
      header: 0.15,
      footer: 0.2,
    },
  };
  sheet.headerFooter.oddFooter = "&LGuía de entrada&R Página &P de &N";
}
