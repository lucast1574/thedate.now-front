import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import ExcelJS from "exceljs";
import { loadSource } from "./support/load-source.cjs";
// The source loader runs in a VM realm; ExcelJS checks instanceof Array in addRow.
// Normalize only that boundary so these tests exercise the actual workbook writer.
class RealmWorkbook extends ExcelJS.Workbook {
  addWorksheet(...args) {
    const sheet = super.addWorksheet(...args),
      add = sheet.addRow.bind(sheet);
    sheet.addRow = (row, ...options) => add(Array.from(row), ...options);
    return sheet;
  }
}
const excelMock = { Workbook: RealmWorkbook };
const { readGuestFile } = loadSource("src/lib/events/guest-spreadsheet.ts", {
  globals: { TextDecoder },
});
test("real Excel round trip preserves international phone strings and companions", async () => {
  const book = new ExcelJS.Workbook(),
    sheet = book.addWorksheet("Invitados");
  sheet.addRow([
    "nombre",
    "apellido",
    "telefono",
    "cupos",
    "familia",
    "acompanantes",
    "apellidos_acompanantes",
  ]);
  sheet.addRow([
    "Ana",
    "Rojas",
    "+51987654321",
    2,
    "Familia de la novia",
    "Luis",
    "Rojas",
  ]);
  const bytes = new Uint8Array(await book.xlsx.writeBuffer());
  const rows = await readGuestFile({
    name: "lista.xlsx",
    size: bytes.length,
    arrayBuffer: async () => bytes.buffer,
  });
  assert.equal(rows[0].phone, "+51987654321");
  assert.equal(rows[0].companions[0].name, "Luis");
  assert.equal(rows[0].seats, 2);
  sheet.getCell("A2").value = {
    formula: 'HYPERLINK("https://example.com","Ana")',
  };
  const unsafe = new Uint8Array(await book.xlsx.writeBuffer());
  await assert.rejects(
    () =>
      readGuestFile({
        name: "lista.xlsx",
        size: unsafe.length,
        arrayBuffer: async () => unsafe.buffer,
      }),
    /fórmulas/,
  );
});
test("Excel template and door export create valid workbooks with no formula cells", async () => {
  let blob;
  const book = new ExcelJS.Workbook();
  await book.xlsx.load(
    await readFile("public/templates/plantilla-invitados.xlsx"),
  );
  const sheet = book.worksheets[0];
  assert.equal(sheet.getCell("C8").value, "WhatsApp");
  assert.equal(sheet.getCell("C9").numFmt, "@");
  assert.equal(sheet.getCell("D9").dataValidation.type, "list");
  assert.equal(sheet.getCell("E508").dataValidation.type, "list");
  assert.equal(sheet.getCell("A9").value, null);
  assert.equal(sheet.views[0].showGridLines, false);
  assert.equal(sheet.views[0].ySplit, 8);
  sheet.getCell("A9").value = "Ana";
  sheet.getCell("B9").value = "Rojas";
  sheet.getCell("C9").value = "+51987654321";
  sheet.getCell("D9").value = "Si";
  sheet.getCell("E9").value = "Familia de la novia";
  const templateBytes = new Uint8Array(await book.xlsx.writeBuffer());
  const imported = await readGuestFile({
    name: "template.xlsx",
    size: templateBytes.length,
    arrayBuffer: async () => templateBytes.buffer,
  });
  assert.equal(imported.length, 1);
  assert.equal(imported[0].seats, 2);
  assert.equal(imported[0].family, sheet.getCell("E9").value);
  assert.equal(imported[0].companions.length, 0);
  sheet.getCell("A508").value = "Luis";
  sheet.getCell("C508").value = "+51987654322";
  sheet.getCell("D508").value = "No";
  const lastBytes = new Uint8Array(await book.xlsx.writeBuffer());
  const lastRow = await readGuestFile({
    name: "last.xlsx",
    size: lastBytes.length,
    arrayBuffer: async () => lastBytes.buffer,
  });
  assert.equal(lastRow.length, 2);
  assert.equal(lastRow[1].seats, 1);
  sheet.getCell("D508").value = "Tal vez";
  const invalidBytes = new Uint8Array(await book.xlsx.writeBuffer());
  await assert.rejects(
    () =>
      readGuestFile({
        name: "invalid.xlsx",
        size: invalidBytes.length,
        arrayBuffer: async () => invalidBytes.buffer,
      }),
    /fila 508/,
  );
  const exported = loadSource("src/lib/events/door-export.ts", {
    mocks: {
      exceljs: excelMock,
      "./guest-spreadsheet": {
        downloadFile: (data) => {
          blob = new Blob([data]);
        },
      },
    },
  });
  await exported.exportDoorWorkbook(
    { kind: "wedding", title: "Ana y Luis" },
    [
      {
        id: "a",
        name: "=Danger()",
        lastName: "Rojas",
        seats: 2,
        response: "going",
        companions: [{ name: "Luis", lastName: "Rojas" }],
      },
    ],
    {
      version: 2,
      tables: [{ id: "t", name: "Mesa 1" }],
      assignments: { "a~0": "t", "a~1": "t" },
    },
  );
  const door = new ExcelJS.Workbook();
  await door.xlsx.load(await blob.arrayBuffer());
  assert.equal(door.worksheets.length, 2);
  assert.equal(door.worksheets[0].rowCount, 4);
  assert.equal(door.worksheets[0].getCell("B3").value, "=Danger()");
  assert.equal(door.worksheets[0].getCell("G4").value, "Mesa 1");
});
